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

/** The given number represents the day of the week as a number.
 *  (0 -> Tuesday), (1 -> Wednesday), ...
 *  @param {number} n the day in number form.
 *  @return name of the day of the week that represents the given day.
 */
export const getDayName = n => DAY_NAME[n]

export const get24HourFormatOf12HourDate = d => {
  const split = get24HourFormatOfDate(d).split(':');
  // console.log('split', split)
  return get24HourFormatOfDate(d)
}

/** Returns the hours of the given date in a 24 hour format.
 *  @param {string} d a date object
 */
export const get24HourFormatOfDate = d => {
  const date = new Date(d);
  let hour = date.getUTCHours();
  const minute = addLeadingZeros(date.getUTCMinutes());
  return hour + ':' + minute;
}

/** Returns the given hour string with the hour period ('AM' or 'PM').
 *  @param {string} d a date object
 *  @param {boolean} spaceBeforePeriod true to add a space between the hour and the hour period
 */
export const get12HourFormatOfDate = (d, spaceBeforePeriod) => {
  const split = get24HourFormatOfDate(d).split(':')
  // console.log('split', split)
  // console.log('-', d.getHours())
  let hour = Number(split[0])
  let period = 'AM'
  if (hour > 12) {
    hour -= 12
    period = 'PM'
  }
  // console.log('hour', hour)
  const minute = split[1] + (spaceBeforePeriod ? ' ' : '')
  // const minute = addLeadingZeros(date.getUTCMinutes()) + (spaceBeforePeriod ? ' ' : '')

  return hour + ':' + minute + period
}

/** Returns the given hour in 24 hour format string.
 *  @param {string} h string representing the time of a day in 12 hour format
 */
export const get24HourFormatOfHour = h => {
  h = String(h)
  const split = h.split(':')

  // console.log('h', h)
  // console.log('split', split)

  if (h.includes('PM')) {
    const hour = Number(split[0])
    if (hour > 12)
      hour += 12
    return (hour + ':' + split[1]).substr(0, h.length - 2)
  }

  if (h.includes('AM'))
    return h.substr(0, h.length - 2)

  if (Number(split[0]) > 12)
    return Number(split[0]) - 12 + split[1]
  else
    return h
}

// export const getDateIdOf = d => toISOString(d).trim()
/** Returns a string representation of a date in YYYYMMDD format.
 *  @param {moment.Moment} m an instance of the Moment library
 */
export const getScheduleIdOfMoment = m => m.format('YYYYMMDD')

/** Returns the date string in ISO format.
 *  @param {Date} d a date object
 */
export const getScheduleIdOfDate = d => toISOString(d).replace('-', '')

/** Returns a string representing the id of a schedule turn.
 *  @param {string} h string representing the time of a day
 */
export const getTurnIdOfHour = h => {
  console.log('h', h, typeof h)
  return get24HourFormatOfHour(h).replace(':', '')
}
// export const getTurnIdOfHour = h => {
//   h = String(h)
//   // console.log('h', h)
//   // console.log('res', h.substr(0, h.length - 2))
//   return h.substr(0, h.length - 2).replace(':', '')
// }

/** Returns given date into ISO format string excluding the hour. 
  * date.toISOString() annoyingly returns the day after sometimes. 
export const toISOString = d => d.toISOString().slice(0, 10) 
*/

/** Returns given date into ISO format string excluding the hour.
 *  @param {object} obj a date object
 */
export const toISOString = obj => {
  const addLeadingZeros = d => {
    return ("0" + d).slice(-2)
  }
  const parsed = new Date(obj)
  const s = parsed.getUTCFullYear() + '-' + addLeadingZeros(parsed.getMonth()) + '-' + addLeadingZeros(parsed.getDate())
  // console.log(obj.toISOString())
  // console.log('s', s)
  return s
}


/** Returns a string format describing the given date (i.e. Nov. 16, 2021).
 *  @param {*} d date to be beautify
 */
export const beautifyDate = d => beautifyDateStr(toISOString(d))

/** Returns a string format describing the given date in string string form (i.e. Nov. 16, 2021).
 *  @param {string} s iso date formatted string (i.e. 2021-11-16).  
 */
export const beautifyDateStr = isoStr => {
  const split = isoStr.split('-');
  const [nYear, nMonth, nDay] = split
  return MONTH_NAME[nMonth] + '. ' + nDay + ', ' + nYear
}


// ***  PRIVATE METHODS  ***
const addLeadingZeros = d => {
  return ("0" + d).slice(-2)
}

// const get12HourFormat = (h, withPeriod) => {
//   h = String(h)
//   return h.substr(0, h.length - 2).replace(':', '')
// }

// export const getDateId = d => {
//   const s = toISOString(d)
//   // const split = s.split('-');
//   console.log('-s', s.replaceAll('-', ''))
//   // const [nYear, nMonth, nDay] = split
// }