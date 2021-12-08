
/* first include the db config. This is important for every controller file because it does the db queries. */
const db = require('../config/postgres')();
const fs = require('fs');
const authUtils = require('../lib/authUtils')
const utils = require('../lib/utils')

exports.login = (req, res, next) => {
  const { email, password } = req.body
  console.log(email, password)

  //check if fields are filled
  const error = new Error();
  if (!email || !password) {
    error.httpStatusCode = 400;
    error.message = 'Malformed Query: Missing Email or Password';
    return next(error);
  }

  const query = `SELECT user_id, password as hash, user_type, first_name || ' ' || last_name as name, is_deleted, salt from users where email = $1`;

  return db.one(query, email).then(data => {
    console.log('data', data)
    if (!data || data.is_deleted) {
      error.httpStatusCode = 404;
      error.message = "User Not Found";
      return next(error);
    }
    const { hash, user_id, user_type, salt } = data;

    const isValid = authUtils.isValidPassword(password, hash, salt);
    console.log('is password valid?', isValid)
    if (isValid) {
      req.app.locals.user_id = user_id;
      req.app.locals.user_type = user_type;
      req.app.locals.salt = salt;
      next();
    }
    else {
      error.httpStatusCode = 401;
      error.message = "Incorrect Password";
      return next(error);
    }
  })
    .catch(error => {
      next(error);
    });
};


// not protected - need to get token from body
exports.checkTokenAndGetUser = async (req, res, next) => {
  console.log('checkTokenAndGetUser')
  const { user_id, token } = req.body

  const q = `select users.user_id, first_name, last_name, email, password, users.user_type, gender, employee_id, restaurant_id, 
    is_deleted, token from users inner join tokens on users.user_id=tokens.user_id where users.user_id=$1 and tokens.token=$2`

  return db.task(async t => {
    return t.one(q, [user_id, token]).then(data => {
      // console.log('-data', data)
      if (!data || data.is_deleted) {
        error.httpStatusCode = 404;
        error.message = "Invalid user metadata";
        return next(error);
      }
      else {
        return t.oneOrNone('select * from restaurant where restaurant_id=$1', data.restaurant_id).then(data1 => {
          if (!data1) data1 = []; //happens when getting admin
          // console.log('-data1', data1)
          data['exp'] = '2'; //amount of days
          res.status(200)
            .json({
              ...data,
              ...data1,
              message: 'Valid user metadata',
            });
        })
      }
    })
  })
    .catch(error => {
      next(error);
    });
}


exports.confirmEmail = (req, res, next) => {
  console.log('confirmEmail')
  let email = req.body.email;
  const token = req.body.token;

  //need something to validate this email (like a token maybe?)
  return db.task(async t => {
    return t.one("select user_id from tokens where token = $1", token).then(async data => {
      //console.log(data[0].user_id);
      id = data.user_id;
      l = fs.readFileSync(__dirname + "/../views/confirm-email/confirmed-email.html", 'utf8', (err, data) => {
        if (err) {
          console.log(err);
        }
        return data;
      });

      //console.log(id);
      return t.one("select email from users where user_id = $1", id).then(data2 => {
        email = data2.email;
        const query = "Update users set verified = TRUE where email = $1 returning verified";
        return task.any(query, email);
      });
    });
  }).then(data => {
    res.send(l);
  }).catch(error => {
    next(error);
  });
};


exports.createUser = (req, res, next) => {
  console.log('createUser', req.body);
  const { code, email, password, first_name, last_name, gender, employee_id, phone } = req.body;
  const location = req.body.location || '';

  // console.log('req.body', req.body);

  let user_type = '';
  let is_assistant_manager = undefined;
  req.app.locals.email = email;
  req.app.locals.name = `${first_name} ${last_name}`;

  const error = new Error();

  //check if user fields are filled
  if (!code || !email || !password || !first_name || !last_name || !gender) {
    error.message = "Malformed Query: Missing Fields. (Required fields: code, first_name, last_name, email, password, gender)";
    error.httpStatusCode = 400;
    return next(error);
  }

  return db.task(async t => {
    return t.any('Select permission_type, is_assistant_manager From permission Where code = $1', code).then(async data => {
      data = data[0];
      // console.log('data', data)
      if (!data) {
        error.message = "Provisional code does\'t exist";
        error.httpStatusCode = 403;
        throw error;
      } else {
        user_type = data.permission_type;
        is_assistant_manager = data.is_assistant_manager
      }
      console.log('user_type', user_type)
      console.log('is_assistant_manager', is_assistant_manager)

      //check if criteria exists 
      return t.any('Select * from users where email = $1', email).then(async data2 => {
        // console.log('data2', data2)
        if (data2.length > 0) {
          error.message = "User Already Exist";
          error.httpStatusCode = 403;
          throw error;
        }
        else {
          //get restaurant_id for which the user belongs to
          return t.oneOrNone('Select restaurant_id from restaurant where location=$1', location).then(data3 => {
            restaurant_id = data3?.restaurant_id;
            console.log('\nrestaurant_id', restaurant_id);
            req.app.locals.restaurant_id = restaurant_id;

            //user doesn't exist
            const saltHash = authUtils.genPassword(password);
            const hash = saltHash.hash;
            const salt = saltHash.salt;

            const userInfo = [
              first_name,
              last_name,
              email,
              hash,
              restaurant_id,
              employee_id,
              new Date().toUTCString(),
              user_type,
              gender,
              phone,
              salt
            ];

            let query4 = '';

            if (user_type === 'manager') {
              query4 = `with new_user AS (insert into users(first_name, last_name, email, password, restaurant_id, employee_id, creation_date, is_deleted,
              user_type, gender, phone, salt) values ($1, $2, $3, $4, $5, $6, $7, FALSE, $8, $9, $10, $11) returning user_id AS id)
              insert into manager (user_id, is_assistant) select id, $12 from new_user returning user_id`;

              userInfo.push(is_assistant_manager)
            }
            else if (user_type === 'admin' || user_type === 'employee') {
              query4 = `insert into users(first_name, last_name, email, password, restaurant_id, employee_id, creation_date, is_deleted,
              user_type, gender, phone, salt) values ($1, $2, $3, $4, $5, $6, $7, FALSE, $8, $9, $10, $11) returning user_id`;
            }
            else {
              error.message = 'Unsupported account type';
              error.httpStatusCode = 401;
              throw error;
            }

            console.log('userInfo', userInfo)
            return t.any(query4, userInfo);
          })
            /* I recommend doing this only if administrators want to reuse provisional codes (non-unique code) */
            .then(userIdData => {
              req.app.locals.user_id = userIdData[0].user_id;
              req.app.locals.user_type = user_type;
              req.app.locals.email = email;
              console.log('updating code to null', code)
              t.any('update permission set code = null where code=$1', code)
              next();
            });
        }
      });
    });
  })
    .catch(error => {
      next(error);
    });
};

// exports.getUserById = async (req, res, next) => {
//   const user_id = req.params.id;
//   const query = 'select * from users where user_id=$1;'

//   return db.one(query, [user_id]).then(user => {
//     return res.status(200).json({ data: user })
//   }).catch(error => {
//     next(error)
//   })
// }

exports.getUserData = async (req, res, next) => {
  // const user_id = parseInt(req.body.user_id);
  // const user_type = req.body.user_type;
  console.log('req.jwt', req.jwt)
  const user_id = req.jwt.sub;
  const user_type = req.jwt.user_type;
  console.log('\n\nuser_id', user_id);

  let q;
  if (user_type === 'admin')
    q = `select user_id, first_name, last_name, email, user_type, gender, employee_id from users where user_id=$1`;
  else
    q = `select user_id, first_name, last_name, email, user_type, gender, employee_id, location  
      from users inner join restaurant on users.restaurant_id=restaurant.restaurant_id where user_id=$1`;


  return db.oneOrNone(q, user_id).then(data => {
    // console.log('data', data)
    res.status(200).json({
      // data,
      ...data,
      message: "Succesfully retrieved user data",
      status: "Success"
    });
    res.end();
  }).catch(_ => {
    const error = new Error();
    error.httpStatusCode = 409;
    error.message = `User with id ${user_id} does not exist`;
    next(error);
  });
  // error.message = "Invalid account type";
  // error.httpStatusCode = 500;
  // next(error);
};


exports.resetPassword = (req, res, next) => {
  const newPassword = req.query.pass;
  const user_id = req.params.user_id;
  console.log('newPassword', newPassword);
  // console.log('user_id', user_id);

  const saltHash = authUtils.genPassword(newPassword);
  const hash = saltHash.hash;
  const salt = saltHash.salt;
  console.log('saltHash', saltHash);

  return db.task(async t => {
    return t.none('UPDATE users SET password = $2, salt = $3 where user_id = $1', [user_id, hash, salt]).then(async _ => {
      return t.none('Delete from reset_password where user_id = $1', user_id).then(_ => {
        const link = utils.getUrlByEnvironment(req, 'signin', 3000); //redirect to app's signin component
        console.log('redirecting to', link);
        return res.redirect(link);
      });
    }).catch(error => {
      next(error);
    });
  });
}

exports.resetPassConfirmation = async (req, res, next) => {
  console.log('\n\nresetPassConfirmation\n\n');
  const user_id = req.params.user_id;
  const pid = req.params.pass_request_id;
  // console.log('user_id, pass_request_id', user_id, pid);
  const link = utils.getUrlByEnvironment(req, `api/auth/resetPassword/${user_id}`);
  // console.log('link', link);

  return db.oneOrNone("Select * from reset_password where user_id = $1 and reset_id = $2", [user_id, pid]).then(data => {
    console.log('data', data)
    if (data == null) return res.redirect(utils.getUrlByEnvironment(req, 'not-found'));
    else {
      file1 = readFile(__dirname + "/../views/reset-password", "reset-password-form1.html");
      file2 = readFile(__dirname + "/../views/reset-password", "reset-password-form2.html");
      file = file1 + link + file2;
      // console.log('file', file);
      return res.send(file); //do the re direct here
    }
  });
};

exports.getAllRestaurants = async (req, res, next) => {
  return db.many('Select * from restaurant where restaurant_id > 0').then(data => {
    res.status(200).json({ restaurants: data });
    res.end();
  });
}
