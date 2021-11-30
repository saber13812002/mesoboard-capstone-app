
/* first include the db config. This is important for every controller file because it does the db queries. */
const db = require('../config/postgres')();
// const fs = require('fs');
// const authUtils = require('../lib/authUtils');

exports.getAllEmployees = function (req, res, next) {
  // const user_id = parseInt(req.body.user_id);
  // const user_type = req.body.user_type;
  // console.log('req.jwt', req.jwt)
  // const user_id = req.jwt.sub;
  // const user_type = req.jwt.user_type;
  console.log('getAllEmployees')
  const query = `select user_id, first_name || ' ' || last_name AS name, email, user_type, creation_date from users where user_type='employee'`;
  return db.any(query).then(employees => {
    console.log('employees', employees)
    res.status(200).json({
      employees,
      message: "Succesfully retrieved all employees",
      status: "Success"
    });
    res.end();
  }).catch(err => {
    next(err);
  });
  // error.message = "Invalid account type";
  // error.httpStatusCode = 500;
  // next(error);
};