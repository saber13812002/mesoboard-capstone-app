const db = require('../config/postgres')();

// no funcionaria con  "times": "630,1500,110|1300,2130,1700",
exports.createUserSchedule = (req, res, next) => {
  console.log('createUserSchedule')
  const user_id = req.body.user_id;
  const hour_lunch = req.body.hour_lunch;
  const dates = req.body.dates;



  // let currentDate = latestTuesday;
  // for (let i = 0; i < 7; i++) {
  // pScheduleIds.push('schedule_id=' + getDateId(currentDate))
  // currentDate = getNextDateOf(currentDate)
  // }

  // for (let i = 0; i < 7; i++) {
  //   timeIdsBySchedule.push('day_times_id=' + getDateId(currentDate))
  //   currentDate = getNextDateOf(currentDate)
  // }

  // queries
  const query = `select schedule_id, date, date_format from schedule
    where ${pScheduleIds.join(' OR ')};`;

  // SELECT day_times_id, hour, minute, time_format, is_am

  const query1 = `select * from day_times;`

  res.status(200).json({ status: 'Developing...' })

  // return db.task(t => {
  //   return t.any(query).then(data => {
  //     // console.log('data', data)
  //     // const d = new Date()
  //     // console.log(d)
  //     // d.setHours(7, 15, 47)
  //     // console.log(d, '\n')

  //     // for (let i = 0; i < 7; i++) {
  //     //   timeIdsBySchedule.push('day_times_id=' + getDateId(currentDate))
  //     //   currentDate = getNextDateOf(currentDate)
  //     // }

  //     // const d1 = new Date()
  //     // console.log(d1)
  //     // setHoursOf(d1, 7, 15)
  //     // console.log(d1)
  //     res.status(200).json({ status: 'Developing...' })
  //   })
  //     .catch(err => {
  //       console.log(err)
  //       res.status(400).json({ status: 'FAILED' })
  //     })
  // })
}

// // // const scheduleIds = req.body.schedule.split(',')
// // // const timeIdsBySchedule = req.body.times.split('|')
// // console.log('timeIdsBySchedule', timeIdsBySchedule)
// // const pScheduleIds = [] //schedule ids to inject into query
// // scheduleIds.forEach(id => pScheduleIds.push('schedule_id=' + id))
// // const pTimeIds = [] //schedule ids to inject into query
// // timeIdsBySchedule.forEach((id, i) => {
// //   const [timeStart, timeEnd, timeLunchStart] = id.split(',');
// //   console.log(timeStart, timeEnd, timeLunchStart)
// // })


exports.getUserSchedule = (req, res, next) => {
  console.log('getUserSchedule')
  // const schedule_id = req.body.schedule_id;
  const date = new Date(); //current date

  // get the date of the latest tuesday  
  const latestTuesday = getLatestTuesdayDate(date)

  const query = `select schedule_id, date_format, num_day_in_week, name_day_en from schedule
    where ${predicateIds.join(' OR ')};`;

  console.log('query', query)

  return db.any(query, predicateIds).then(data => {
    console.log('schedule', data)
    res.status(200).json({ data, status: 'success' })
  })
    .catch(err => {
      console.log(err)
      next(err)
    })
}


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

  // populate query params with schedule ids
  const predicateIds = []
  let currentDate = latestTuesday;
  for (let i = 0; i < 7; i++) {
    predicateIds.push('schedule_id=' + getDateId(currentDate))
    currentDate = getNextDateOf(currentDate)
  }
  // console.log('\n\n' + idParams.join(' AND '))

  const query = `select schedule_id, date, date_format, num_day_in_week, day_name from schedule
    where ${predicateIds.join(' OR ')};`;

  // res.status(200).json({ status: 'success' })
  return db.any(query).then(data => {
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
export const getDateId = d => {
  const s = toISOString(d)
  // const split = s.split('-');
  console.log('-s', s.replaceAll('-', ''))
  // const [nYear, nMonth, nDay] = split

}

/** Returns given date into ISO format string excluding the hour */
export const toISOString = d => d.toISOString().slice(0, 10)


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

//   // populate query params with schedule ids
//   const predicateIds = []
//   let currentDate = latestTuesday;
//   for (let i = 0; i < 7; i++) {
//     predicateIds.push('schedule_id=' + getDateId(currentDate))
//     currentDate = getNextDateOf(currentDate)
//   }

//   const query = `select schedule_id, date_format, num_day_in_week, name_day_en from schedule
//     where ${predicateIds.join(' OR ')};`;

//   console.log('query', query)

//   return db.any(query, predicateIds).then(data => {
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

//   // populate query params with schedule ids
//   const paramIds = []
//   let currentDate = latestTuesday;
//   for (let i = 0; i < 7; i++) {
//     paramIds.push('schedule_id=' + getDateId(currentDate))
//     currentDate = getNextDateOf(currentDate)
//   }
//   // console.log('\n\n' + idParams.join(' AND '))

//   const query = `select schedule_id, date, date_format, num_day_in_week, day_name from schedule
//     where ${paramIds.join(' OR ')};`;

//   // res.status(200).json({ status: 'success' })
//   return db.any(query, paramIds).then(data => {
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