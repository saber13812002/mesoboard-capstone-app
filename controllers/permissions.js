var db = require('../config/postgres')();

exports.addPermission = function (req, res, next) {
  var email = req.body.email;
  var last_update = new Date().toDateString();
  var permission_type = req.body.permission_type;
  req.app.locals.permission_type = permission_type;
  req.app.locals.email = email;
  var error = new Error();
  //check if email is empty
  if (!email) {
    error.message = "Malformed Query (missing email)";
    error.httpStatusCode = 400;
    return next(error);
  }

  //check if permission is empty
  if (!permission_type) {
    error.message = "Malformed Query (missing permission type)";
    error.httpStatusCode = 400;
    return next(error);
  }
  return db.task(function (task) {
    return task.any("select (count(*)>0) as existing_email from permissions where email = $1", email).then(function (data1) {
      if (data1[0].existing_email) {
        error.message = "Existing permission with specified email";
        error.httpStatusCode = 400;
        throw error;
      } else {
        var query = 'INSERT into permissions (email, last_update, permission_type) values ($1, $2, $3) returning *';
        return task.any(query, [email, last_update, permission_type]);
      }
    });
  }).then(function (data) {
    req.app.locals.permission_data = data;
    next();
  }).catch(function (error) {
    next(error);
  });
};

exports.checkPermission = function (req, res, next) {
  console.log('checkPermission body:', req.body)
  const code = req.body.code
  const error = new Error();
  if (!code) {
    error.message = "Malformed Query (missing code)";
    error.httpStatusCode = 400;
    return next(error);
  }

  // const query = "SELECT (count(*) = 1) as user_created FROM users WHERE code = $1;";
  const query = "SELECT (count(*) = 1) as code_exists FROM permissions WHERE code = $1;";
  const query1 = "SELECT permission_type FROM permissions WHERE code = $1;";

  return db.task(function (t) {
    console.log(typeof code)
    return t.one(query, code).then(function (data) {
      console.log('data', data)
      if (!data.code_exists) {
        console.log('Privisional code doesn\'t exist')
        error.message = "Invalid provisional code.";
        error.httpStatusCode = 400;
        throw error;
      } else {
        console.log('getting permission_type from permissions table')
        return t.any(query1, code);
      }
    });
  }).then(function (data1) {
    console.log('data1', data1)
    if (data1.length == 1) { //if finds permission
      res.status(200)
        .json({
          data: data1[0],
          message: 'Retrieved Permission',
          status: 'success'
        });
      res.end();
    }
  }).catch(function (err) {
    next(err);
  });
};