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
    // console.log('data', data)
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
    else if (d.has_schedule) {
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



    // if (d.has_schedule) {
    //   console.log(dCurr.user_id !== d.user_id)
    //   if (dCurr.user_id !== d.user_id) {
    //     console.log('dCurr', dCurr)
    //     pushDataToSchedule(dCurr);
    //     dCurr = d;
    //   }

    //   // create weekDate information of a particular day
    //   let day = d.date_start.getDay() - 2;
    //   if (day < 0)
    //     day += 7;

    //   weekDates[day] = {
    //     turnId: d.turn_id,
    //     dateStart: d.date_start,
    //     dateEnd: d.date_end,
    //     dateLunch: d.date_lunch
    //   }
    // }
    // else {
    //   console.log('dCurr', dCurr)
    //   pushDataToSchedule(dCurr);
    // }
    // // else res.push({
    // //   userId: d.user_id,
    // //   name: d.name,
    // //   email: d.email,
    // //   creationDate: d.creation_date,
    // //   gender: d.gender,
    // //   userType: d.user_type,
    // //   isHourLunch: d.is_hour_lunch,
    // //   scheduleId: d.schedule_id,
    // // });
  })

  console.log('\n\n\ndCurr', dCurr)
  console.log('weekDates', weekDates)

  // if (dCurr.has_schedule)
  pushDataToSchedule(dCurr);

  res.forEach(user => {
    // console.log('user', user)
    if (user.weekDates) {
      // set weekDate obj to array containing each day as keys
      user.weekDates = [0, 1, 2, 3, 4, 5, 6].map(day => user.weekDates[day] ? user.weekDates[day] : null)

      // calculate and set the total hours of a particular week
      user.totalHours = calculateTotalHours(user.weekDates)
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

const calculateTotalHours = weekDates => {
  // calculate and set the total hours of a particular week
  let totalHours = 0;
  for (let dates of weekDates)
    if (dates)
      totalHours += Math.abs(new Date(dates.dateEnd) - new Date(dates.dateStart)) / 36e5;
  return totalHours;
}

module.exports.joinUserSchedulesByUser = joinUserSchedulesByUser;
module.exports.shortenFull24HoursTo12 = shortenFull24HoursTo12;
module.exports.outerJoinUserScheduleQuery = outerJoinUserScheduleQuery;

