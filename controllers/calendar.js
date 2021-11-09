const db = require('../config/postgres')();
// const moment = require('moment')

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
  const paramIds = []
  let currentDate = latestTuesday;
  for (let i = 0; i < 7; i++) {
    paramIds.push('calendar_dates_id=' + getDateId(currentDate))
    currentDate = getNextDateOf(currentDate)
  }
  // console.log('\n\n' + idParams.join(' AND '))

  const query = `select calendar_dates_id, date_format, num_day_in_week, name_day_en from calendar_dates
    where ${paramIds.join(' OR ')};`;

  // res.status(200).json({ status: 'success' })
  return db.any(query, paramIds).then(data => {
    // return db.any(query, id).then(data => {
    console.log('data', data)
    res.status(200).json({ data, status: 'success' })
  })
    .catch(err => {
      console.log(err)
      next(err)
    })
}

const isDateInstance = d => Object.prototype.toString.call(d) === '[object Date]'

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
  while (currDate.getDay() != 2) {
    currDate.setDate(currDate.getDate() - 1);
    // console.log('currDate', currDate)
  }
  console.log('res', currDate)
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