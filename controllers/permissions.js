const db = require('../config/postgres')();

exports.addPermission = (req, res, next) => {
  const { email, permission_type, code } = req.body;
  console.log('\n\nemail', email)
  console.log('permission_type', permission_type)
  console.log('code', code)
  const last_update = new Date().toDateString();
  req.app.locals.permission_type = permission_type;
  req.app.locals.email = email;

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

  return db.task(t => {
    return t.any("select (count(*)>0) as existing_email from permissions where email = $1", email).then(data1 => {
      // console.log('data1', data1)
      if (data1[0].existing_email) {
        error.message = "Existing permission with specified email";
        error.httpStatusCode = 400;
        throw error;
      } else {
        const q = 'INSERT into permissions (code, email, last_update, permission_type) values ($1, $2, $3, $4) returning *';
        return t.any(q, [code, email, last_update, permission_type]);
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
  console.log('checkPermission body:', req.body)
  const code = req.body.code
  const error = new Error();
  if (!code) {
    error.message = "Malformed Query (missing code)";
    error.httpStatusCode = 400;
    return next(error);
  }

  // const query = "SELECT (count(*) = 1) as user_created FROM users WHERE code = $1;";
  const q = "SELECT (count(*) = 1) as code_exists FROM permissions WHERE code = $1;";
  const q1 = "SELECT permission_type FROM permissions WHERE code = $1;";

  return db.task(async t => {
    console.log(typeof code)
    return t.one(q, code).then(data => {
      console.log('data', data)
      if (!data.code_exists) {
        console.log('Privisional code doesn\'t exist')
        error.message = "Invalid provisional code.";
        error.httpStatusCode = 400;
        throw error;
      } else {
        console.log('getting permission_type from permissions table')
        return t.one(q1, code);
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
  const q = `select first_name || ' ' || last_name as name, u.email, last_update, creation_date, u.user_type
  from users AS u left join permissions AS p on u.email=p.email`;

  return db.task(async t => {
    return t.any(q).then(async data => {
      const q1 = `select * from permissions where email not in (select email from users)`;
      return t.any(q1).then(data1 => {
        data1.push(...data);
        console.log('\ndata1', data1);
        res.status(200).json({ data: data1 })
      })
    }).catch(err => {
      next(err);
    });
  })
    .catch(err => { next(err) });
};
