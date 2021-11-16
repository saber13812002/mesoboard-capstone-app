const db = require('../config/postgres')();

// no funcionaria con  "times": "630,1500,110|1300,2130,1700",
exports.createUserSchedule = (req, res, next) => {
  console.log('createUserSchedule')
  const schedule_id = req.body.schedule_id;
  const user_id = req.body.user_id;
  const hour_lunch = req.body.hour_lunch;
  const tuesday = req.body['1'];
  const wednesday = req.body['2'];
  const thursday = req.body['3'];
  const friday = req.body['4'];
  const saturday = req.body['5'];
  const sunday = req.body['6'];
  const monday = req.body['7'];

  const dateArrays = [tuesday, wednesday, thursday, friday, saturday, sunday, monday]
  let dates = []
  dateArrays.forEach(datesStr => {
    console.log(datesStr)
    if (datesStr)
      dates.push(...datesStr.split(','))
  })

  /**    RESULT
   arr [
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



  /*
    EXPECTED RESULTING q:
    INSERT INTO user_schedule(user_id, schedule_id, date_start, date_end, date_start_lunch, hour_lunch)
    VALUES 
      ($1,$2,$3,$4,$5,false),
      ($1,$2,$6,$7,$8,false),
      ($1,$2,$9,$10,$11,false) returning *;
    `
  */
  let q = `INSERT INTO user_schedule(user_id, schedule_id, date_start, date_end, date_start_lunch, hour_lunch)
  VALUES `

  const nDatesPerColumn = 3;
  for (let i = 0; i < dates.length; i += nDatesPerColumn) {
    // to inject user_id and schedule_id
    q += '($1,$2,'

    // creating injection indexes for date_start, date_end, and date_start_lunch
    for (let k = i; k < (i + nDatesPerColumn); k++)
      q += `$${k + 3},`

    // set hour_lunch as false
    q += 'false)'
    if (i <= dates.length / nDatesPerColumn)
      q += ','
  }
  q += ' returning *'
  // console.log(q)

  console.log(' ')
  console.log(' ')
  console.log(' ')
  console.log(' ')
  // console.log(...dates)

  // res.status(200).json({ status: 'Developing...' })
  return db.any(q, [user_id, schedule_id, ...dates]).then(data => {
    console.log('data', data)
    res.status(200).json({ status: 'Developing...' })
  })
    .catch(err => {
      console.log(err)
      res.status(400).json({ message: `Failed to create/update weeh schedule` })
    })


  /*
    INSERT INTO user_schedule(user_id, schedule_id, date_start, date_end, date_start_lunch, hour_lunch)
    VALUES
      (4, 20211109, '2021-11-10T06:30:00.776Z', '2021-11-10T15:00:00.776Z', '2021-11-10T11:00:00.776Z', false),
      (4, 20211109, '2021-11-11T13:00:00.776Z', '2021-11-11T21:30:00.776Z', '2021-11-11T17:00:00.776Z', false),
      (4, 20211109, '2021-11-13T14:00:00.776Z', '2021-11-13T22:30:00.776Z', '2021-11-13T18:00:00.776Z', false);
  */

  // let currentDate = latestTuesday;
  // for (let i = 0; i < 7; i++) {
  // pScheduleIds.push('schedule_id=' + getDateId(currentDate))
  // currentDate = getNextDateOf(currentDate)
  // }

  // queries
  // const q = `select schedule_id, date, date_format from schedule
  //   where ${pScheduleIds.join(' OR ')};`;
}



exports.getUserSchedules = (req, res, next) => {
  console.log('getUserSchedule', req.params)
  // const date = new Date(); //current date
  // const user_id = req.body.user_id;
  const schedule_id = req.params.schedule_id;

  // console.log(';user_id', user_id)
  console.log('schedule_id', schedule_id)
  //   const q = `select schedule_id, date_format, num_day_in_week, name_day_en from schedule
  //     where ${predicateIds.join(' OR ')};`;

  /*
   const q = `with sched as (select user_schedule.*, schedule.is_approved from schedule inner join user_schedule
    on schedule.schedule_id = user_schedule.schedule_id where user_schedule.schedule_id = $1)
    select first_name || ' ' || last_name AS name, sched.*
    from sched inner join users on sched.user_id=users.user_id ORDER BY name`;
   */
  /**** applying (date - interval '4 hours') because for some reason its returning the date with 4 hours added. ¯\_(ツ)_/¯ ****/
  const q = `with sched as (select user_schedule.*, schedule.is_approved from schedule inner join user_schedule
    on schedule.schedule_id = user_schedule.schedule_id where user_schedule.schedule_id = $1)
    select first_name || ' ' || last_name AS name, sched.*, sched.date_start - interval '4 hours' AS date_start,
    sched.date_end - interval '4 hours' AS date_end, sched.date_start_lunch - interval '4 hours' AS date_start_lunch
    from sched inner join users on sched.user_id=users.user_id ORDER BY name`;

  // const q = "select user_schedule.date_start - interval '4 hours' AS date_start, user_schedule.date_end - interval '4 hours' from user_schedule where schedule_id=20211109"
  // const q = "select user_schedule.date_start - interval '4 hours' AS date_start, user_schedule.date_end - interval '4 hours' AS date_end from user_schedule where schedule_id=20211109"
  // const q = `with sched as (select user_schedule.*, schedule.is_approved from schedule inner join user_schedule
  //   on schedule.schedule_id = user_schedule.schedule_id where user_schedule.schedule_id = $1)
  //   select first_name || ' ' || last_name AS name, sched.*, sched.date_start - interval '4 hours' AS date_start,
  //   sched.date_end - interval '4 hours' AS date_end, sched.date_start_lunch - interval '4 hours' AS date_start_lunch
  //   from sched inner join users on sched.user_id=users.user_id ORDER BY name`;


  // console.log('q', q)
  // res.status(200).json({ status: 'success' })
  return db.any(q, schedule_id).then(data => {
    if (data.length === 0)
      res.status(200).json({ status: 'success', message: 'Did not find any schedule information for this week' })
    else {
      console.log('schedule', data)
      /** key is the number that represents the day of the week. (0 -> tuesday, 1 -> wednesday, ...) */
      let weekDates = {
        // 1: { dateStart: _, dateEnd: _, dateStartLunch: _ }
        // 3: { dateStart: _, dateEnd: _, dateStartLunch: _ }
      }

      /** Array of employee information -> employeeName, isHourLunch, array of weekDate objects */
      const schedules = []

      // construct schedule of each employee with array of objects
      let dCurr = data[0]
      data.forEach(d => {
        if (dCurr.user_id !== d.user_id) {
          console.log('dCurr', dCurr)
          schedules.push({
            employeeName: dCurr.name,
            isHourLunch: dCurr.hour_lunch,
            weekDates
          })
          dCurr = d
        }

        // create weekDate information of a particular day
        const day = d.date_start.getDay() - 2
        weekDates[day] = {
          dateStart: d.date_start,
          dateEnd: d.date_end,
          dateStartLunch: d.date_start_lunch
        }
      })
      schedules.push({
        employeeName: dCurr.name,
        isHourLunch: dCurr.hour_lunch,
        weekDates
      })
      console.log('schedules', schedules)
      res.status(200).json({ schedules, status: 'success' })
    }
  })
    .catch(err => {
      console.log(err)
      next(err)
    })
}

// // // const scheduleIds = req.body.schedule.split(',')
// // // const timeIdsBySchedule = req.body.times.split('|')
// // console.log('timeIdsBySchedule', timeIdsBySchedule)
// // const pScheduleIds = [] //schedule ids to inject into q
// // scheduleIds.forEach(id => pScheduleIds.push('schedule_id=' + id))
// // const pTimeIds = [] //schedule ids to inject into q
// // timeIdsBySchedule.forEach((id, i) => {
// //   const [timeStart, timeEnd, timeLunchStart] = id.split(',');
// //   console.log(timeStart, timeEnd, timeLunchStart)
// // })





/**************  FOR TESTING PURPOSES  **************/
exports.getWeekSchedule = (req, res, next) => {
  // const date = req.body.date;
  const date = new Date(); //current date

  // console.log('date', date)
  // const latestTuesday = getLatestTuesdayDate(date)
  // console.log('latestTuesday', latestTuesday)

  // date.setDate(date.getDate() - 1)
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
    console.log('data', data)

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
// const getDateId = d => {
//   const s = toISOString(d)
//   // const split = s.split('-');
//   console.log('-s', s.replaceAll('-', ''))
//   // const [nYear, nMonth, nDay] = split

// }

// /** Returns given date into ISO format string excluding the hour */
// const toISOString = d => d.toISOString().slice(0, 10)


const isDateInstance = d => Object.prototype.toString.call(d) === '[object Date]'

const setHoursOf = (d, h, m, s) => {
  console.log('h - 4', h - 4)
  d.setHours(h - 4, m, s || 0)
}

const getDateId = d => {
  // console.log('isDateInstance(date)', isDateInstance(date), isDateInstance({ n: 1 }))
  if (isDateInstance(d)) {
    d = convertDateToJson(d);
  }

  return d.year + d.month + d.day
}

const getPrevDateOf = d => {
  let date = new Date(d.valueOf())
  date.setDate(date.getDate() - 1);
  return date;
}

const getNextDateOf = d => {
  let date = new Date(d.valueOf())
  date.setDate(date.getDate() + 1);
  return date;
}

const getLatestTuesdayDate = d => {
  // d.setDate(d.getDate() - 1);
  // console.log('d', d)
  // console.log('d.getDay', d.getDay())
  let currDate = d;
  console.log('dude', currDate)
  while (currDate.getDay() != 2) {
    currDate.setDate(currDate.getDate() - 1);
    // console.log('currDate', currDate)
  }
  // console.log('res', currDate)
  return currDate
}



// const getFollowingTuesdayDate = d => {
//   const followingTuesday = d.getDate() + (3 - d.getDay() + 1) + 5;
//   d.setDate(followingTuesday)
//   return d
// }

// 11/08/2020
const pgFormatDate = d => {
  if (isDateInstance(d))
    d = convertDateToJson(d);

  return d.month + '/' + d.day + '/' + d.year
}

const convertDateToJson = d => {
  // console.log('--', date)
  /* Via http://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date */
  const addLeadingZeros = d => {
    return ("0" + d).slice(-2)
  }

  const parsed = new Date(d)
  // console.log('parsed', parsed)
  return {
    year: parsed.getUTCFullYear(),
    month: addLeadingZeros(parsed.getMonth() + 1),
    day: addLeadingZeros(parsed.getDate()),
    // hour: addLeadingZeros(parsed.getHours()),
    // minute: addLeadingZeros(parsed.getMinutes()),
    // second: addLeadingZeros(parsed.getSeconds())
  }
}


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
