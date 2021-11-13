export const MONTH_NAME = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Abr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
}

export const DAY_NAME = {
  1: 'Tuesday',
  2: 'Wednesday',
  3: 'Thursday',
  4: 'Friday',
  5: 'Saturday',
  6: 'Sunday',
  7: 'Monday',
}

export const getDateId = d => {
  const s = toISOString(d)
  // const split = s.split('-');
  console.log('-s', s.replaceAll('-', ''))
  // const [nYear, nMonth, nDay] = split

}

/** Returns given date into ISO format string excluding the hour */
export const toISOString = d => d.toISOString().slice(0, 10)


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
