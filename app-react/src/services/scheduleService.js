export const MONTH_NAME = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Abr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
}

export const DAY_NAME = {
  0: 'Tuesday',
  1: 'Wednesday',
  2: 'Thursday',
  3: 'Friday',
  4: 'Saturday',
  5: 'Sunday',
  6: 'Monday',
}

/** 
 * The given number represents the day of the week as a number.
 * (0 -> Tuesday), (1 -> Wednesday), ...
 * @param {number} day the day in number form.
 * @return name of the day of the week that represents the given day.
 */
export const getDayName = day => DAY_NAME[day];

/**
 * calculate the total hours of a particular week
 * @param weekDates days of the week to calculate total hours
 * @return the total hours of the given week dates
 */
export const calculateTotalHours = weekDates => {
  // calculate and set the total hours of a particular week
  let totalHours = 0;
  for (let dates of weekDates) {
    if (dates) {
      const dateStart = dates.dateStart ? dates.dateStart : dates.date_start
      const dateEnd = dates.dateEnd ? dates.dateEnd : dates.date_end
      totalHours += Math.abs(new Date(dateEnd) - new Date(dateStart)) / 36e5;
    }
  }
  return totalHours;
}


/** 
 * Returns a string representation of a date in YYYYMMDD format.
 * @param {moment.Moment} m an instance of the Moment library
 */
export const getScheduleIdOfMoment = m => m.format('YYYYMMDD')


/** 
 * Returns the date string in ISO format.
 * @param {Date} d a date object
 */
export const getScheduleIdOfDate = d => toISOYearFormat(d).replace('-', '')


/** 
 * Returns a string representing the database id of a schedule turn.
 * @param {string} t string representing the time of a day
 */
export const getTurnIdByTime = t => get24HourFormatOfTime(t).replace(':', '');


/** 
 * Returns the hours of the given date in a 24 hour format.
 * @param {string} d a date object.
 */
export const get24HourFormatOfDate = d => {
  const date = new Date(d);
  let hour = date.getUTCHours();
  const minute = addLeadingZeros(date.getUTCMinutes());
  return hour + ':' + minute;
}


/** 
 * Returns the given hour string with the hour period ('AM' or 'PM').
 * @param {string} d a date object.
 * @param {boolean} spaceBeforePeriod true to add a space between the minute and the time period.
 */
export const get12HourFormatOfDate = (d, spaceBeforePeriod) => {
  if (!d) return null;
  const split = get24HourFormatOfDate(d).split(':')

  // console.log('-', d.getHours())
  let hour = Number(split[0])
  let period = 'AM'
  if (hour >= 12) period = 'PM';
  if (hour > 12) hour -= 12;

  const minute = split[1] + (spaceBeforePeriod ? ' ' : '')
  return hour + ':' + minute + period
}


/** 
 * Returns the given hour in 24 hour format string.
 * @param {string} h string representing the time of a day in 12 hour format.
 * @param {boolean} zeroOnHour determines adding leading zero to the hour.
 */
export const get24HourFormatOfTime = (t, zeroOnHour) => {
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


export const get12HourFormatByTurnId = (tid, spaceBeforePeriod) => {
  if (!tid) return;
  let hour, minute, period = 'AM';
  tid = String(tid);

  if (tid.length === 3) {
    hour = Number(tid[0]);
    minute = tid[1] + tid[2];
  }
  else {
    hour = Number(tid[0] + tid[1]);
    minute = tid[2] + tid[3];
    if (hour >= 12) period = 'PM';
    if (hour == 24) hour = '00';
  }
  // console.log(hour + ':' + minute + (spaceBeforePeriod ? ' ' : '') + period)
  return hour + ':' + minute + (spaceBeforePeriod ? ' ' : '') + period;

}

/** 
 * Returns given date into ISO format string excluding the time section.
 * @param {object | string} d a date object
 */
export const toISOYearFormat = d => {
  const parsed = new Date(d);
  return parsed.getUTCFullYear() + '-' + addLeadingZeros(parsed.getUTCMonth() + 1) + '-' + addLeadingZeros(parsed.getDate());
}


/** 
 * Returns a string format describing the given date (i.e. Nov. 16, 2021).
 * @param {*} d date to be beautify
 */
export const beautifyDate = d => beautifyDateStr(toISOYearFormat(d))

/** 
 * Returns a string format describing the given date in string string form (i.e. Nov. 16, 2021).
 * @param {string} s iso date formatted string (i.e. 2021-11-16).  
 */
export const beautifyDateStr = isoStr => {
  const split = isoStr.split('-');
  const [nYear, nMonth, nDay] = split;
  return MONTH_NAME[nMonth - 1] + '. ' + nDay + ', ' + nYear;
}


// ***  PRIVATE METHODS  ***
const addLeadingZeros = d => ('0' + d).slice(-2)

// /** Returns given date into ISO format string excluding the hour. 
//   * date.toISOYearFormat() returns the day after sometimes. 
//   */
// export const toISOYearFormat = d => d.toISOString().slice(0, 10) 

// const get12HourFormat = (h, withPeriod) => {
//   h = String(h)
//   return h.substr(0, h.length - 2).replace(':', '')
// }

// export const getDateId = d => {
//   const s = toISOYearFormat(d)
//   // const split = s.split('-');
//   console.log('-s', s.replaceAll('-', ''))
//   // const [nYear, nMonth, nDay] = split
// }