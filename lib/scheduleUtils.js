/**** applying (date - interval '4 hours') because for its returning the date with 4 hours added (not UTC). need fix? ¯\_(ツ)_/¯ ****/
const outerJoinUserScheduleQuery = `with sched AS (select us.*, schedule.is_approved from schedule full outer join user_schedule AS us
  on schedule.schedule_id = us.schedule_id where us.schedule_id = $1) 
  select first_name || ' ' || last_name AS name, email, creation_date, user_type, u.gender, u.user_id, sched.schedule_id,
  CASE WHEN sched.user_id IS NULL THEN false ELSE true END AS has_schedule,
  sched.turn_id, sched.is_hour_lunch, sched.is_approved, sched.date_start - interval '4 hours' AS date_start,
  sched.date_end - interval '4 hours' AS date_end, sched.date_lunch - interval '4 hours' AS date_lunch
  from sched right join users AS u on sched.user_id=u.user_id where user_type='employee' or user_type='manager' ORDER BY name`;


const joinUserSchedulesByUser = (userScheduleArr) => {
  /** key is the number that represents the day of the week. (0 -> tuesday, 1 -> wednesday, ...) */
  let weekDates = {
    // 1: { dateStart: _, dateEnd: _, dateLunch: _ }
    // 3: { dateStart: _, dateEnd: _, dateLunch: _ }
  }

  /** Array of user information and its schedule -> name, isHourLunch, array of weekDate objects */
  const res = [];

  /** push the information of the given data and the current week dates object into the userScheduleArr array */
  const pushDataToSchedule = data => {
    // console.log('pushDataToSchedule', data)
    res.push({
      userId: data.user_id,
      name: data.name,
      email: data.email,
      creationDate: data.creation_date,
      gender: data.gender,
      userType: data.user_type,
      isHourLunch: data.is_hour_lunch,
      scheduleId: data.schedule_id,
      weekDates
    })
  }

  // construct schedule of each user with array of objects
  let dCurr = userScheduleArr[0];
  // console.log('userScheduleArr', userScheduleArr)

  userScheduleArr.forEach(d => {
    // console.log('d', d)
    // console.log(dCurr.user_id !== d.user_id)
    // has_schedule=undefined means that a manager hasn't created a work schedule yet for this user
    if (dCurr.user_id !== d.user_id) {
      // console.log('dCurr', dCurr)
      pushDataToSchedule(dCurr);
      dCurr = d;
      weekDates = {};
    }
    if (d.has_schedule) {
      // create weekDate information of a particular day
      let day = d.date_start.getDay() - 2;
      if (day < 0)
        day += 7;

      weekDates[day] = {
        turnId: d.turn_id,
        dateStart: d.date_start,
        dateEnd: d.date_end,
        dateLunch: d.date_lunch
      }
    }
  })

  // console.log('\n\n\ndCurr', dCurr)
  // console.log('weekDates', weekDates)

  pushDataToSchedule(dCurr);

  res.forEach(user => {
    if (user.weekDates) {
      // set weekDate obj to array containing each day as keys
      user.weekDates = [0, 1, 2, 3, 4, 5, 6].map(day => user.weekDates[day] ? user.weekDates[day] : null)

      // calculate and set the total hours of a particular week
      user.totalHours = calculateTotalHours(user.weekDates, user.isHourLunch || false)
    }
    else {
      user.weekDates = new Array(7).fill(null);
      user.totalHours = 0;
    }
  })

  return res;
}

const shortenFull24HoursTo12 = h => {
  const split = h.split(':');
  let hour = Number(split[0]);
  let period = 'AM';
  if (hour >= 12) period = 'PM';
  if (hour > 12) hour -= 12;

  const minute = split[1];
  return hour + ':' + minute + ' ' + period
}

/*
  const newTimeStart = get24HourFormatOfTime(turn.timeStart, true);
  const newTimeEnd = get24HourFormatOfTime(turn.timeEnd, true);
  const newTimeLunch = get24HourFormatOfTime(turn.timeLunch, true);

  // create new dates with the times of the turn. (working with UTC time zone)
  const isoYearFormat = toISOYearFormat(dateToModify);
  const newDateStart = new Date(`${isoYearFormat}T${newTimeStart}Z`).toISOString();
  const newDateEnd = new Date(`${isoYearFormat}T${newTimeEnd}Z`).toISOString();
  const newDateLunch = new Date(`${isoYearFormat}T${newTimeLunch}Z`).toISOString();
*/

const calculateTotalHours = (weekDates, isHourLunch) => {
  // calculate and set the total hours of a particular week
  let totalHours = 0;
  for (let dates of weekDates) {
    if (dates) {
      const dateStart = new Date(dates.dateStart)
      const dateEnd = new Date(dates.dateEnd)
      const diff = Math.abs(dateEnd - dateStart);
      totalHours += (diff / 36e5) - (isHourLunch ? 1 : 0.5)
    }
  }
  return totalHours;
}

/** 
 * Returns given date into ISO format string excluding the time section.
 * @param {object | string} d a date object
 */
const toISOYearFormat = d => {
  if (!d) return ''
  const parsed = new Date(d);
  return parsed.getUTCFullYear() + '-' + addLeadingZeros(parsed.getUTCMonth() + 1) + '-' + addLeadingZeros(parsed.getDate());
}

/** 
 * Returns the given hour in 24 hour format string.
 * @param {string} h string representing the time of a day in 12 hour format.
 * @param {boolean} zeroOnHour determines adding leading zero to the hour.
 */
const get24HourFormatOfTime = (t, zeroOnHour) => {
  if (!t) return ''

  t = String(t);
  const split = t.split(':');

  if (t.includes('PM')) {
    let hour = Number(split[0]);
    if (hour != 12)
      hour += 12;
    return (hour + ':' + split[1]).substr(0, t.length - 2).trim();
  }

  if (t.includes('AM')) {
    let res = t.substr(0, t.length - 2).trim();
    const hour = res.split(':')[0];
    if (zeroOnHour && hour.length === 1)
      res = '0' + res;
    return res;
  }

  return t;
}

const addLeadingZeros = s => ('0' + s).slice(-2)

module.exports.joinUserSchedulesByUser = joinUserSchedulesByUser;
module.exports.shortenFull24HoursTo12 = shortenFull24HoursTo12;
module.exports.outerJoinUserScheduleQuery = outerJoinUserScheduleQuery;

