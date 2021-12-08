import moment from 'moment';

export const MONTH_NAME = {
  0: 'Ene',
  1: 'Feb',
  2: 'Mar',
  3: 'Abr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Ago',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dic',
}

export const DAY_NAME = {
  0: 'Martes',
  1: 'Miércoles',
  2: 'Jueves',
  3: 'Viernes',
  4: 'Sábado',
  5: 'Domingo',
  6: 'Lunes',
}

/** 
 * The given number represents the day of the week as a number.
 * (0 -> Tuesday), (1 -> Wednesday), ...
 * @param {number} day the day in number form.
 * @return name of the day of the week that represents the given day.
 */
export const getDayName = day => DAY_NAME[day];


/** 
 * Returns a string representation of a date in YYYYMMDD format.
 * @param {moment.Moment} m an instance of the Moment library
 */
export const getScheduleIdOfMoment = m => m.format('YYYYMMDD')


/** 
 * Returns the date string in ISO format.
 * @param {Date} d a date object
 */
export const getScheduleIdOfDate = d => toISOYearFormat(d).replaceAll('-', '')

/** 
 * Returns a string representation of a date in YYYYMMDD format.
 * @param {String} s a string representing a date in Iso Format
 */
export const getScheduleIdOfIsoDateStr = sIso => sIso.replaceAll('-', '')

/** 
 * Returns a string representing the database id of a schedule turn.
 * @param {string} t string representing the time of a day
 */
export const getTurnIdByTime = t => get24HourFormatOfTime(t).replaceAll(':', '');


/** 
 * Returns the hours of the given date in a 24 hour format.
 * @param {string} d a date object.
 */
export const get24HourFormatOfDate = d => {
  if (!d) return ''
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
  if (!t) return ''

  t = String(t);
  const split = t.split(':');

  if (t.includes('PM')) {
    let hour = Number(split[0]);
    if (hour !== 12)
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
    if (hour === 24) hour = '00';
  }
  // console.log(hour + ':' + minute + (spaceBeforePeriod ? ' ' : '') + period)
  return hour + ':' + minute + (spaceBeforePeriod ? ' ' : '') + period;

}

/** 
 * Returns given date into ISO format string excluding the time section.
 * @param {object | string} d a date object
 */
export const toISOYearFormat = d => {
  if (!d) return ''
  const parsed = new Date(d);
  return parsed.getUTCFullYear() + '-' + addLeadingZeros(parsed.getUTCMonth() + 1) + '-' + addLeadingZeros(parsed.getDate());
}


/** 
 * Returns a string format describing the given date (i.e. Nov. 16, 2021).
 * @param {*} d date to be beautify
 */
export const beautifyDate = d => d ? beautifyDateStr(toISOYearFormat(d)) : ''

/** 
 * Returns a string format describing the given date in string string form (i.e. Nov. 16, 2021).
 * @param {string} s iso date formatted string (i.e. 2021-11-16).  
 */
export const beautifyDateStr = isoStr => {
  const split = isoStr.split('-');
  const [nYear, nMonth, nDay] = split;
  return MONTH_NAME[nMonth - 1] + '. ' + nDay + ', ' + nYear;
}


/**
 * calculate the total hours of a particular week
 * @param weekDates days of the week to calculate total hours
 * @param isHourLunch determines if substracting either 30 or 60 minutes (1 or 0.5 hours)
 * @return the total hours of the given week dates
 */
export const calculateTotalHours = (weekDates, isHourLunch) => {
  if (!weekDates) return 0

  // calculate and set the total hours of a particular week
  let totalHours = 0;
  for (let dates of weekDates) {
    if (dates) {
      const dateStart = new Date(dates.dateStart ? dates.dateStart : dates.date_start)
      const dateEnd = new Date(dates.dateEnd ? dates.dateEnd : dates.date_end)
      const diff = Math.abs(dateEnd - dateStart);
      totalHours += (diff / 36e5) - (isHourLunch ? 1 : 0.5)
    }
  }
  return totalHours;
}


/**
 * Last feature to be implemented, it works with the manual tests Kevin did, but needs more testing
 * @param {*} profileArr the array of profiles with week dates to calculate the accumulated hours
 */
export const calculateAccumulatedHours = profileArr => {
  console.log('profileArr', profileArr);
  // const accHoursArr = new Array(profileArr.length).fill(0); //for testing purposes (console logs), not needed

  profileArr.forEach((profile, i) => {
    const weekDates = profile.weekDates;
    profile.accumulatedHours = 0;
    console.log('weekDates', weekDates);

    const isHourLunch = profile.isHourLunch;
    let now = moment.utc().clone();
    let mCurrStart, mCurrEnd, mCurrLunch, nowDay, mCurrStartDay; //mCurrEndDay;
    let accHours = 0;
    // iterate through each valid week date
    for (let d of weekDates) {
      console.log('\n\n')
      if (!d) continue;

      mCurrStart = moment.utc(d.dateStart).clone();
      mCurrEnd = moment.utc(d.dateEnd).clone();
      mCurrLunch = moment.utc(d.dateLunch).clone();
      // console.log('nowDay', nowDay)
      // console.log('mCurrStart', mCurrStart)
      // console.log('mCurrEnd', mCurrEnd)
      // console.log('mCurrLunch', mCurrLunch)

      // day of the week for each
      nowDay = now.toDate().getDate();
      mCurrStartDay = mCurrStart.toDate().getDate();
      // mCurrEndDay = mCurrEnd.toDate().getDate();


      // console.log('mCurrStartDay', mCurrStartDay)

      // // console.log('now.isSame(mCurrStart)', now.isSame(mCurrStart));
      // console.log('now.isAfter(mCurrStart)', now.isAfter(mCurrStart));


      if (nowDay === mCurrStartDay) {
        // console.log('isSame');

        // const now
        // console.log('now', now);
        // console.log('mCurrStart', mCurrStart);
        console.log('mCurrLunch', mCurrLunch);

        // HOURS to be analyzed
        const mCurrStartHour = mCurrStart.toDate().getUTCHours();
        const mCurrEndHour = mCurrEnd.toDate().getUTCHours();
        const mCurrLunchHour = mCurrLunch.toDate().getUTCHours();
        let nowHour = now.toDate().getHours();
        if (nowHour > mCurrEndHour) {
          now = mCurrEnd; //now represents the latest valid moment
          nowHour = mCurrEndHour;
        }
        console.log('nowHour', nowHour);

        console.log('mCurrStartHour', mCurrStartHour);
        console.log('mCurrEndHour', mCurrEndHour);
        console.log('mCurrLunchHour', mCurrLunchHour);

        // MINUTES to be analyzed
        let nowMinute = now.toDate().getMinutes();
        let mCurrStartMinute = mCurrStart.toDate().getMinutes();
        let mCurrEndMinute = mCurrEnd.toDate().getMinutes();

        if (nowMinute < 30) nowMinute = 0;
        if (nowMinute >= 30) nowMinute = 0.5;
        console.log('\nnowMinute', nowMinute);

        if (mCurrStartMinute < 30) mCurrStartMinute = 0;
        if (mCurrStartMinute >= 30) mCurrStartMinute = 0.5;
        console.log('mCurrStartMinute', mCurrStartMinute);

        if (mCurrEndMinute < 30) mCurrEndMinute = 0;
        if (mCurrEndMinute >= 30) mCurrEndMinute = 0.5;
        console.log('mCurrEndMinute', mCurrEndMinute);

        const mCurrLunchMinute = mCurrLunch.toDate().getUTCMinutes();
        console.log('mCurrLunchMinute', mCurrLunchMinute);


        // condition for something?
        // if (nowHour === mCurrStartHour) {
        //   console.log('TRUE');
        // }
        // else {
        //   console.log('FALSE');
        // }

        // debugger;



        const mCurrLunchTime = Number(mCurrLunchHour + '.' + (mCurrLunchMinute === 0 ? '00' : '30'));
        const hour24DateLunch = Number(get24HourFormatOfDate(d.dateLunch).replaceAll(':', '.')); //for debugger
        console.log('mCurrLunchTime', mCurrLunchTime);
        console.log('get24HourFormatOfDate(dateLunch)', hour24DateLunch)


        // only if NOW time is after LUNCH time
        // then we'll substract 0.5 or 1 
        let lunchHoursToSubstract = 0;
        if (mCurrLunchTime > hour24DateLunch) {
          lunchHoursToSubstract = isHourLunch ? 1 : 0.5;
        }

        let mCurrLunchEndMinute; //expected 5.0
        if (mCurrLunchMinute === 0.5 && (nowMinute === 0.5)) {
          mCurrLunchEndMinute = mCurrLunchHour + 1;
        }
        else if (mCurrLunchMinute === 0 && isHourLunch) {
          mCurrLunchEndMinute = mCurrLunchHour + 1;
        }

        if (mCurrLunchTime === hour24DateLunch && nowMinute >= mCurrLunchEndMinute) {
          lunchHoursToSubstract = isHourLunch ? 1 : 0.5;
        }

        // const mCurrLunchTime = mCurrLunchHour + ':' + (mCurrLunchMinute === 0 ? '00' : '30');
        // const hour24DateLunch = get24HourFormatOfDate(d.dateLunch); //for debugger
        // console.log('mCurrLunchTime', mCurrLunchTime);
        // console.log('get24HourFormatOfDate(dateLunch)', get24HourFormatOfDate(d.dateLunch))
        // // only if NOW time is after LUNCH time
        // // then we'll substract 0.5 or 1 
        // let lunchHoursToSubstract = 0;
        // if (mCurrLunchTime === get24HourFormatOfDate(d.dateLunch)) {
        //   lunchHoursToSubstract = isHourLunch ? 1 : 0.5;
        // }


        // determin accHours after all the analysis
        const diff = Math.abs((nowHour + nowMinute) - (mCurrStartHour + mCurrStartMinute));
        console.log('diff', diff);
        accHours += diff - lunchHoursToSubstract;
      }
      else if (now.isAfter(mCurrStart)) {
        console.log('now isAfter mCurr')

        const dateStart = new Date(d.dateStart)
        const dateEnd = new Date(d.dateEnd)
        const diff = Math.abs(dateEnd - dateStart);
        accHours += (diff / 36e5) - (isHourLunch ? 1 : 0.5);
      }
      profile.accumulatedHours = accHours;
      // accHoursArr[i] = accHours; //TO BE REMOVED
    }
    console.log('\n\naccHours', accHours);
    console.log('expected:', 2);
  })
  // console.log('accHoursArr', accHoursArr)
}


// ***  PRIVATE METHODS  ***
const addLeadingZeros = s => ('0' + s).slice(-2)

