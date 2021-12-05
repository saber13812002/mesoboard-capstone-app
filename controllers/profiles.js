const db = require('../config/postgres')();
const scheduleUtils = require('../lib/scheduleUtils');

exports.getUsers = async (req, res, next) => {
  const user_type = req.jwt.user_type;

  let userTypeConditions = `user_type='manager' or user_type='employee'`
  if (user_type === 'admin')
    userTypeConditions += ` or user_type = 'admin'`

  const q = `select user_id, first_name, last_name, email, user_type, gender from users where ${userTypeConditions}`;
  return db.one(q).then(data => {
    console.log('data', data)
    res.status(200).json({
      // data,
      ...data,
      message: "Succesfully retrieved user data",
      status: "Success"
    });
    res.end();
  }).catch(error => {
    // const error = new Error();
    // error.httpStatusCode = 409;
    // error.message = ``;
    next(error);
  });
};

exports.getAllUsersWithSchedule = async (req, res, next) => {
  // const user_type = req.jwt.user_type;
  const schedule_id = req.params.schedule_id;
  // const user_id = req.params.user_id;

  let userTypeConditions = `user_type='employee'`;
  // if (user_type === 'admin')
  //   userTypeConditions += ` or user_type = 'admin'`;

  // const q = `with u as (select * from users where (${userTypeConditions}))
  // select u.user_id, u.first_name || ' ' || u.last_name AS name, u.email, u.user_type, u.gender, us.schedule_id, 
  // CASE WHEN us.user_id IS NULL THEN false ELSE true END AS has_schedule,
  // us.date_start, us.date_end, us.date_lunch, us.is_hour_lunch
  // from u full outer join user_schedule as us on u.user_id=us.user_id where schedule_id=$1`;
  const q = scheduleUtils.outerJoinUserScheduleQuery;


  return db.many(q, schedule_id).then(userSchedulesData => {
    // console.log('userSchedulesData', userSchedulesData)
    userSchedulesData = scheduleUtils.joinUserSchedulesByUser(userSchedulesData);
    console.log('-res', userSchedulesData)
    // res.status(200).json({ userSchedulesData, status: 'success' })
    // console.log('data', data)
    res.status(200).json({
      userSchedulesData,
      message: "Succesfully retrieved user data",
      status: "Success"
    });
    res.end();
  }).catch(error => {
    // const error = new Error();
    // error.httpStatusCode = 409;
    // error.message = ``;
    next(error);
  });
}


exports.getUserWithSchedule = async (req, res, next) => {
  // const user_type = req.jwt.user_type;
  const schedule_id = req.params.schedule_id;
  const user_id = req.params.user_id;

  console.log('user_id', user_id)
  let userTypeConditions = `user_type='employee'`;
  // if (user_type === 'admin')
  //   userTypeConditions += ` or user_type = 'admin'`;

  // const q = `with usrs as (select user_id, first_name || ' ' || last_name AS name, email, user_type, gender from users where ${userTypeConditions})
  //   select  from usrs inner join user_schedule on usrs.user_id=user_schedule.user_id where schedule_id=$1`;

  const q = `with u as (select * from users where user_id=$1 and (${userTypeConditions}))
    select u.user_id, u.first_name || ' ' || u.last_name AS name, u.email, u.user_type, u.gender, us.schedule_id, 
    CASE WHEN us.user_id IS NULL THEN false ELSE true END AS has_schedule,
    us.date_start, us.date_end, us.date_lunch, us.is_hour_lunch
    from u inner join user_schedule as us on u.user_id=us.user_id where schedule_id=$2`;

  return db.many(q, [user_id, schedule_id]).then(userScheduleData => {
    console.log('userScheduleData', userScheduleData)

    userScheduleData = scheduleUtils.joinUserSchedulesByUser(userScheduleData);


    console.log('-res', userScheduleData)
    // res.status(200).json({ userScheduleData, status: 'success' })
    // console.log('data', data)
    res.status(200).json({
      userScheduleData: userScheduleData[0],
      message: "Succesfully retrieved user data",
      status: "Success"
    });
    res.end();
  }).catch(error => {
    // const error = new Error();
    // error.httpStatusCode = 409;
    // error.message = ``;
    next(error);
  });
  // error.message = "Invalid account type";
  // error.httpStatusCode = 500;
  // next(error);
};

const calculateTotalHours = weekDates => {
  // calculate and set the total hours of a particular week
  let totalHours = 0;
  for (let dates of weekDates)
    if (dates)
      totalHours += Math.abs(new Date(dates.dateEnd) - new Date(dates.dateStart)) / 36e5;
  return totalHours;
}