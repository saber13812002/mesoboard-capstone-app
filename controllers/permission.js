const db = require('../config/postgres')();

exports.addPermission = (req, res, next) => {
  console.log('res.body', req.body);
  const { email, permission_type, code, restaurant_id, employee_id } = req.body;
  const is_assistant_manager = req.body.is_assistant_manager || false;

  // req.app.locals.permission_type = permission_type;
  // req.app.locals.email = email;
  // req.app.locals.restaurant_id = restaurant_id;
  // req.app.locals.is_assistant_manager = is_assistant_manager;

  const error = new Error();
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

  if (!code) {
    error.message = "Malformed Query (missing provisional code)";
    error.httpStatusCode = 400;
    return next(error);
  }

  if (!restaurant_id) {
    error.message = "Malformed Query (missing provisional restaurant id)";
    error.httpStatusCode = 400;
    return next(error);
  }

  if (!employee_id) {
    error.message = "Malformed Query (missing provisional employee number)";
    error.httpStatusCode = 400;
    return next(error);
  }

  return db.task(async t => {
    return t.any("select (count(*)>0) as existing_email from permission where email = $1", email).then(data1 => {
      // console.log('data1', data1)
      if (data1[0].existing_email) {
        error.message = "Existing permission with specified email";
        error.httpStatusCode = 400;
        throw error;
      } else {
        const last_update = new Date().toDateString();
        const q = 'INSERT into permission (code, email, permission_type, restaurant_id, employee_id, last_update, is_assistant_manager) values ($1, $2, $3, $4, $5, $6, $7) returning *';
        return t.one(q, [code, email, permission_type, restaurant_id, employee_id, last_update, is_assistant_manager]);
      }
    });
  }).then(data => {
    console.log('permission_data:', data)
    req.app.locals.permission_data = data;
    next();
  }).catch(error => {
    next(error);
  });
};


exports.checkPermission = (req, res, next) => {
  console.log('checkPermission body:', req.body);
  const code = req.body.code;
  const email = req.body.email;

  const error = new Error();
  if (!code) {
    error.message = "Malformed Query (missing code)";
    error.httpStatusCode = 400;
    return next(error);
  }

  const q = `SELECT (count(*) = 1) as entity_exists FROM permission WHERE code = $1 and email=$2`;
  const q1 = `SELECT permission_type, email, employee_id, r.restaurant_id, email, location
    FROM permission left join restaurant AS r on r.restaurant_id=permission.restaurant_id WHERE code=$1 and email=$2`;

  return db.task(async t => {
    console.log(email, code)
    return t.one(q, [code, email]).then(data => {
      console.log('data', data)
      if (!data.entity_exists) {
        console.log('Either privisional code or email doesn\'t exist')
        error.message = "Invalid provisional code.";
        error.httpStatusCode = 400;
        throw error;
      } else {
        console.log('getting permission_type, email, and restaurant_id location from permission table')
        return t.one(q1, [code, email]);
      }
    });
  }).then(data1 => {
    console.log('permission_type', data1.permission_type)
    if (data1) { //if finds permission
      res.status(200)
        .json({
          ...data1,
          message: 'Retrieved Permission',
          status: 'success'
        });
      res.end();
    }
  }).catch(err => {
    next(err);
  });
};


exports.getPermissionsAndUsers = async (req, res, next) => {
  // const q = `select first_name || ' ' || last_name as name, u.email, last_update, creation_date, u.user_type
  // from users AS u left join permission AS p on u.email=p.email`;
  const q = `select first_name || ' ' || last_name as name, u.email, creation_date, u.user_type
  from users AS u`;

  return db.task(async t => {
    return t.any(q).then(async data => {
      const q1 = `select * from permission where email not in (select email from users)`;
      return t.any(q1).then(data1 => {
        data1.push(...data);
        // console.log('\ndata1', data1);
        res.status(200).json({ data: data1 })
      })
    }).catch(err => {
      next(err);
    });
  })
    .catch(err => { next(err) });
};
