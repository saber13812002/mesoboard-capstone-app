const db = require('../config/postgres')();
const scheduleUtils = require('../lib/scheduleUtils')

// no funcionaria con  "times": "630,1500,110|1300,2130,1700",
exports.setUserSchedule = async (req, res, next) => {
  // console.log('setUserSchedule')
  const schedule_id = req.body.schedule_id;
  const user_id = req.body.user_id;
  const is_hour_lunch = req.body.is_hour_lunch;
  const tuesday = req.body['0'];
  const wednesday = req.body['1'];
  const thursday = req.body['2'];
  const friday = req.body['3'];
  const saturday = req.body['4'];
  const sunday = req.body['5'];
  const monday = req.body['6'];
  console.log('user_id:', user_id)
  console.log('schedule_id:', schedule_id)
  console.log('is_hour_lunch', is_hour_lunch)

  const datesArray = [tuesday, wednesday, thursday, friday, saturday, sunday, monday]
  console.log('datesArray', datesArray)
  /**   
    EXPECTED RESULT:
    dates = [
      '2021-11-10T06:30:00.776Z',
      '2021-11-10T15:00:00.776Z',
      '2021-11-10T11:00:00.776Z',
      '2021-11-11T13:00:00.776Z',
      '2021-11-11T21:30:00.776Z',
      '2021-11-11T17:00:00.776Z',
      '2021-11-13T14:00:00.776Z',
      '2021-11-13T22:30:00.776Z',
      '2021-11-13T18:00:00.776Z'
    ]
  */
  let dates = []
  datesArray.forEach(datesObj => {
    if (datesObj)
      dates.push(...Object.values(datesObj))
  })
  // console.log('dates', dates)
  const deleteQuery = 'DELETE FROM user_schedule WHERE user_id=$1 and schedule_id=$2';
  if (dates.length === 0)
    db.any(deleteQuery, [user_id, schedule_id])
      .then(_ => res.status(200).json({ newWeekDates: [] }))
  else {
    /*
      EXPECTED RESULT:
      q = INSERT INTO user_schedule(user_id, schedule_id, is_hour_lunch, turn_id, date_start, date_end, date_lunch)
          VALUES 
            ($1,$2,$3,$4,$5,$6,$7,false),
            ($1,$2,$3,$8,$9,$10,$11,false),
            ($1,$2,$3,$12,$13,$14,$15,false) returning *;
      `
    */
    let q = `WITH del AS (${deleteQuery})
    INSERT INTO user_schedule(user_id, schedule_id, is_hour_lunch, turn_id, date_start, date_end, date_lunch)
    VALUES `;

    const nColumnToInject = 4;
    for (let i = 0; i < dates.length; i += nColumnToInject) {
      // to inject user_id, schedule_id, is_hour_lunch
      q += '($1,$2,$3,'

      // creating injection indexes for date_start, date_end, and date_lunch
      for (let k = i; k < (i + nColumnToInject); k++) {
        const reachedLastParam = (k === i + nColumnToInject - 1);
        q += `$${k + 4}${reachedLastParam ? '' : ','}`
      }

      q += ')'
      if (i < dates.length - nColumnToInject && dates.length > nColumnToInject)
        q += ','
    }
    q += ' returning *'
    // console.log('dates', dates)
    // console.log(q);

    // res.status(200).json({ status: 'Developing...' })
    return db.any(q, [user_id, schedule_id, is_hour_lunch, ...dates]).then(data => {
      res.status(200).json({ newWeekDates: data })
    })
      .catch(error => { next(error) })
  }
}


exports.getEmployeeSchedules = async (req, res, next) => {
  // console.log('getEmployeeSchedules', req.params)
  const schedule_id = req.params.schedule_id;

  /*
  const q = `with sched as (select user_schedule.*, schedule.is_approved from schedule inner join user_schedule
    on schedule.schedule_id = user_schedule.schedule_id where user_schedule.schedule_id = $1)
    select first_name || ' ' || last_name AS name, sched.*
    from sched inner join users on sched.user_id=users.user_id ORDER BY name`;
   */
  /**** applying (date - interval '4 hours') because for its returning the date with 4 hours added (not UTC). need fix? ¯\_(ツ)_/¯ ****/
  // const q = `with sched AS (select us.*, schedule.is_approved from schedule full outer join user_schedule AS us
  //   on schedule.schedule_id = us.schedule_id where us.schedule_id = $1) 
  //   select first_name || ' ' || last_name AS name, email, creation_date, user_type, u.gender, sched.schedule_id,
  //   CASE WHEN sched.user_id IS NULL THEN false ELSE true END AS has_schedule,
  //   sched.turn_id, sched.is_hour_lunch, sched.is_approved, sched.date_start - interval '4 hours' AS date_start,
  //   sched.date_end - interval '4 hours' AS date_end, sched.date_lunch - interval '4 hours' AS date_lunch
  //   from sched right join users AS u on sched.user_id=u.user_id where user_type='employee' ORDER BY name`;

  const q = scheduleUtils.outerJoinUserScheduleQuery;
  return db.any(q, schedule_id).then(userSchedulesData => {
    // console.log('userSchedulesData', userSchedulesData)
    if (userSchedulesData.length === 0)
      res.status(200).json({ status: 'success', message: 'No employees yet in the system' })
    else {
      userSchedulesData = scheduleUtils.joinUserSchedulesByUser(userSchedulesData);
      // console.log('res', userSchedulesData)
      res.status(200).json({ userSchedulesData, status: 'success' })
    }
  })
    .catch(err => {
      next(err)
    })
}

exports.insertUserTurn = (req, res, next) => {
  const { turn_id, user_id, time_start, time_end, time_lunch } = req.body;
  console.log('turn_id', turn_id);
  console.log('user_id', user_id);
  console.log('time_start', time_start);

  const q = `INSERT INTO turn(turn_id, user_id, time_start, time_end, time_lunch)
    VALUES($1, $2, $3, $4, $5) returning *`;

  // res.status(200).json({ status: 'success', message: 'Developing...' })
  return db.one(q, [turn_id, user_id, time_start, time_end, time_lunch]);
  // .then(_ => res.status(200)
  // .catch(err => next(err))
}


exports.getUserTurns = (req, res, next) => {
  // const user_id = req.params.user_id;
  const user_id = req.jwt.sub;

  const q = `SELECT * FROM turn where user_id=$1 ORDER BY time_start`;

  // res.status(200).json({ status: 'success', message: 'Developing...' })
  return db.any(q, user_id).then(data => {
    // console.log('turns data', data)
    const turns = data.map((d, i) => {
      return {
        turnId: d.turn_id,
        turnIndex: i + 1,
        timeStart: scheduleUtils.shortenFull24HoursTo12(d.time_start),
        timeEnd: scheduleUtils.shortenFull24HoursTo12(d.time_end),
        timeLunch: scheduleUtils.shortenFull24HoursTo12(d.time_lunch)
      }
    })
    // console.log('turns', turns)
    res.status(200).json({ turns, status: 'success' })
  })
    .catch(err => next(err))
}

exports.removeUserTurn = (req, res, next) => {
  var user_id = req.jwt.sub;
  var turn_id = Number(req.params.turn_id);

  const q = `delete from turn where user_id=$1 and turn_id=$2`;
  return db.any(q, [user_id, turn_id])
}




/**************  FOR TESTING PURPOSES  **************/
exports.getWeekSchedule = (req, res, next) => {
  // const date = req.body.date;
  const date = new Date(); //current date

  // console.log('date', date)
  // const latestTuesday = getLatestTuesdayDate(date)
  // console.log('latestTuesday', latestTuesday)

  // date.setDate(date.getUTCDate() - 1)
  // const latestTuesday = getLatestTuesdayDate(date)
  // console.log('latestTuesdayMoment', latestTuesday)
  // console.log('getNextDateOf', getNextDateOf(latestTuesday))

  // get the date of the latest tuesday  
  const latestTuesday = getLatestTuesdayDate(date)

  // populate q params with schedule ids
  const predicateIds = []
  let currentDate = latestTuesday;
  for (let i = 0; i < 7; i++) {
    predicateIds.push('schedule_id=' + getDateId(currentDate))
    currentDate = getNextDateOf(currentDate)
  }
  // console.log('\n\n' + idParams.join(' AND '))

  const q = `select schedule_id, date, date_format, num_day_in_week, day_name from schedule
    where ${predicateIds.join(' OR ')}; `;

  // res.status(200).json({ status: 'success' })
  return db.any(q).then(data => {
    // console.log('data', data)

    res.status(200).json(data)
    // console.log('data', data)
    // const weekDates = {
    //   tuesday: data[0],
    //   wednesday: data[1],
    //   thursday: data[2],
    //   friday: data[3],
    //   saturday: data[4],
    //   sunday: data[5],
    //   monday: data[6],
    // }

    // res.status(200).json({ ...weekDates })
  })
    .catch(err => {
      console.log(err)
      next(err)
    })
}


//-------------------------------------------------------------------------------

// /** Returns given date into ISO format string excluding the hour */
// const toISOString = d => d.toISOString().slice(0, 10)

// const shortenFull24HoursTo12 = h => {
//   const split = h.split(':');
//   let hour = Number(split[0]);
//   let period = 'AM';
//   if (hour >= 12) period = 'PM';
//   if (hour > 12) hour -= 12;

//   const minute = split[1];
//   return hour + ':' + minute + ' ' + period
// }

// const calculateTotalHours = weekDates => {
//   // calculate and set the total hours of a particular week
//   let totalHours = 0;
//   for (let dates of weekDates)
//     if (dates)
//       totalHours += Math.abs(new Date(dates.dateEnd) - new Date(dates.dateStart)) / 36e5;
//   return totalHours;
// }

// const isDateInstance = d => Object.prototype.toString.call(d) === '[object Date]';

// const getDateId = d => {
//   // console.log('isDateInstance(date)', isDateInstance(date), isDateInstance({ n: 1 }))
//   if (isDateInstance(d)) {
//     d = convertDateToJson(d);
//   }

//   return d.year + d.month + d.day
// }

// const getPrevDateOf = d => {
//   let date = new Date(d.valueOf())
//   date.setDate(date.getUTCDate() - 1);
//   return date;
// }

// const getNextDateOf = d => {
//   let date = new Date(d.valueOf())
//   date.setDate(date.getUTCDate() + 1);
//   return date;
// }

// const getLatestTuesdayDate = d => {
//   // d.setDate(d.getUTCDate() - 1);
//   // console.log('d', d)
//   // console.log('d.getDay', d.getDay())
//   let currDate = d;
//   console.log('dude', currDate)
//   while (currDate.getDay() != 2) {
//     currDate.setDate(currDate.getUTCDate() - 1);
//     // console.log('currDate', currDate)
//   }
//   // console.log('res', currDate)
//   return currDate
// }



// const getFollowingTuesdayDate = d => {
//   const followingTuesday = d.getUTCDate() + (3 - d.getDay() + 1) + 5;
//   d.setDate(followingTuesday)
//   return d
// }

// // 11/08/2020
// const pgFormatDate = d => {
//   if (isDateInstance(d))
//     d = convertDateToJson(d);

//   return d.month + '/' + d.day + '/' + d.year
// }

// const convertDateToJson = d => {
//   // console.log('--', date)
//   /* Via http://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date */
//   const addLeadingZeros = d => {
//     return ("0" + d).slice(-2)
//   }

//   const parsed = new Date(d)
//   // console.log('parsed', parsed)
//   return {
//     year: parsed.getUTCFullYear(),
//     month: addLeadingZeros(parsed.getMonth() + 1),
//     day: addLeadingZeros(parsed.getUTCDate()),
//     // hour: addLeadingZeros(parsed.getHours()),
//     // minute: addLeadingZeros(parsed.getMinutes()),
//     // second: addLeadingZeros(parsed.getSeconds())
//   }
// }


// exports.getWeekSchedule = (req, res, next) => {
//   console.log('getWeekSchedule')
//   const date = req.body.date;
//   // const user_id = req.body.user_id;
//   // const date = new Date(); //current date

//   // get the date of the latest tuesday  
//   const latestTuesday = getLatestTuesdayDate(date)

//   // populate q params with schedule ids
//   const predicateIds = []
//   let currentDate = latestTuesday;
//   for (let i = 0; i < 7; i++) {
//     predicateIds.push('schedule_id=' + getDateId(currentDate))
//     currentDate = getNextDateOf(currentDate)
//   }

//   const q = `select schedule_id, date_format, num_day_in_week, name_day_en from schedule
//     where ${predicateIds.join(' OR ')};`;

//   console.log('q', q)

//   return db.any(q, predicateIds).then(data => {
//     console.log('schedule', data)
//     res.status(200).json({ data, status: 'success' })
//   })
//     .catch(err => {
//       console.log(err)
//       next(err)
//     })
// }

// exports.getWeekSchedule = (req, res, next) => {
//   // const date = req.body.date;
//   const date = new Date(); //current date

//   // console.log('date', date)
//   // const latestTuesday = getLatestTuesdayDate(date)
//   // console.log('latestTuesday', latestTuesday)

//   // date.setDate(date.getDate() - 1)
//   // const latestTuesday = getLatestTuesdayDate(date)
//   // console.log('latestTuesdayMoment', latestTuesday)
//   // console.log('getNextDateOf', getNextDateOf(latestTuesday))


//   // get the date of the latest tuesday  
//   const latestTuesday = getLatestTuesdayDate(date)

//   // populate q params with schedule ids
//   const paramIds = []
//   let currentDate = latestTuesday;
//   for (let i = 0; i < 7; i++) {
//     paramIds.push('schedule_id=' + getDateId(currentDate))
//     currentDate = getNextDateOf(currentDate)
//   }
//   // console.log('\n\n' + idParams.join(' AND '))

//   const q = `select schedule_id, date, date_format, num_day_in_week, day_name from schedule
//     where ${paramIds.join(' OR ')};`;

//   // res.status(200).json({ status: 'success' })
//   return db.any(q, paramIds).then(data => {
//     console.log('data', data)

//     res.status(200).json(data)
//     // console.log('data', data)
//     // const weekDates = {
//     //   tuesday: data[0],
//     //   wednesday: data[1],
//     //   thursday: data[2],
//     //   friday: data[3],
//     //   saturday: data[4],
//     //   sunday: data[5],
//     //   monday: data[6],
//     // }

//     // res.status(200).json({ ...weekDates })
//   })
//     .catch(err => {
//       console.log(err)
//       next(err)
//     })
// }


// /** check if the value is a valid type of the standard JS-date object. */
// function isValidDate(date) {
//   return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
// }

// const getLatestFridayDate = () => {
//   const t = new Date().getDate() + (6 - new Date().getDay() - 1) - 7;
//   const lastFriday = new Date();
//   lastFriday.setDate(t);
//   return lastFriday
// }


// const getLatestTuesdayDate = d => {
//   // console.log('d', d)

//   const dayINeed = 2; // for Thursday
//   const today = moment().isoWeekday();

//   let res;
//   // if we haven't yet passed the day of the week that I need:
//   if (today <= dayINeed) {
//     // then just give me this week's instance of that day
//     res = moment().isoWeekday(dayINeed);
//   } else {
//     // otherwise, give me *next week's* instance of that same day
//     res = moment().add(1, 'weeks').isoWeekday(dayINeed);
//   }

//   return new Date(res.format())
// }
