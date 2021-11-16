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

export const getDayName = n => DAY_NAME[n]

export const getHourFormatOf = (d, spaceOnPeriod) => {
  const date = new Date(d)
  // console.log('-', d.getHours())
  let hour = date.getUTCHours()
  let period = 'AM'
  if (hour > 12) {
    hour -= 12
    period = 'PM'
  }
  const minute = addLeadingZeros(date.getUTCMinutes()) + (spaceOnPeriod ? ' ' : '')

  return hour + ':' + minute + period

  // var date = new Date();
  // console.log(date.toLocaleString('en-GB'));
}

// export const getDateIdOf = d => toISOString(d).trim()
export const getScheduleIdOfMoment = m => m.format('YYYYMMDD')
export const getScheduleIdOfDate = d => toISOString(d).replace('-', '')

// export const getDateId = d => {
//   const s = toISOString(d)
//   // const split = s.split('-');
//   console.log('-s', s.replaceAll('-', ''))
//   // const [nYear, nMonth, nDay] = split

// }

/** Returns given date into ISO format string excluding the hour. 
  * date.toISOString() annoyingly returns the day after sometimes. 
export const toISOString = d => d.toISOString().slice(0, 10) 
*/

/** Returns given date into ISO format string excluding the hour */
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


/**
 * 
 * @param {*} d date to be beautify
 *  @return string format describing the given date (i.e. Nov. 16, 2021).
 */
export const beautifyDate = d => beautifyDateStr(toISOString(d))
//   // console.log('m', m)
//   console.log(d)
//   const s = toISOString(d)

//   // return 'in progress...'
//   return beautifyDateStr(s)
// }

/**
 *  @param {string} s iso date formatted string (i.e. 2021-11-16).  
 *  @return string format describing the given string (i.e. Nov. 16, 2021).
 */
export const beautifyDateStr = s => {
  // console.log('s', s)
  const split = s.split('-');
  // console.log('split', split)
  const [nYear, nMonth, nDay] = split
  return MONTH_NAME[nMonth] + '. ' + nDay + ', ' + nYear
}

// ***  PRIVATE METHODS  ***
const addLeadingZeros = d => {
  return ("0" + d).slice(-2)
}