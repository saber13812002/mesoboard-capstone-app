
/* first include the db config. This is important for every controller file because it does the db queries. */
var db = require('../config/postgres')();
var fs = require('fs');
const authUtils = require('../lib/authUtils')

exports.login = (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  console.log(email, password)

  //check if fields are filled
  var error = new Error();
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
    .catch(err => {
      next(err);
    });
};

exports.checkTokenAndGetUser = (req, res, next) => {
  console.log('checkTokenAndGetUser')
  var user_id = req.body.user_id;
  var token = req.body.token;

  const query = `select users.user_id, first_name, last_name, email, password, users.user_type, gender, is_deleted, token 
    from users inner join tokens on users.user_id = tokens.user_id where users.user_id=$1 and tokens.token=$2`

  return db.one(query, [user_id, token]).then(data => {
    if (!data || data.is_deleted) {
      error.httpStatusCode = 404;
      error.message = "Invalid user metadata";
      return next(error);
    }
    else {
      data['expiresIn'] = '2'; //amount of days
      res.status(200)
        .json({
          data,
          message: 'Valid user metadata',
        });
      // res.end();
    }
  }).catch(err => {
    next(err);
  });
}

exports.confirmEmail = (req, res, next) => {
  console.log('confirmEmail')
  var email = req.body.email;
  var token = req.body.token;
  //need something to validate this email (like a token maybe?)
  return db.task(t => {
    return t.one("select user_id from tokens where token = $1", token).then(data => {
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
        var query = "Update users set verified = TRUE where email = $1 returning verified";
        return task.any(query, [email]);
      });
    });
  }).then(data => {
    res.send(l);
  }).catch(error => {
    next(error);
  });
};

exports.createUser = (req, res, next) => {
  console.log('createUser')
  var code = req.body.code;
  var email = req.body.email;
  var password = req.body.password;
  console.log('password', password)
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var gender = req.body.gender;
  var user_type = "";
  console.log('code', code)
  var error = new Error();
  req.app.locals.email = email;
  //check if user fields are filled
  if (!code || !email || !password || !first_name || !last_name || !gender) {
    error.message = "Malformed Query: Missing Fields. (Required fields: first_name, last_name, email, password, gender)";
    error.httpStatusCode = 400;
    return next(error);
  }

  return db.task(t => {
    return t.one("Select permission_type From permissions Where code = $1", code).then(data => {
      if (!data) {
        error.message = "Provisional code does\'t exist";
        error.httpStatusCode = 403;
        throw error;
      } else {
        user_type = data.permission_type;
      }
      console.log('user_type', user_type)

      //check if criteria exists 
      //I was thinking, for employee will be either email or phone.
      //Which ever the employee chooses
      return t.any("Select * from users where email = $1", [email]).then(data2 => {
        if (data2.length > 0) {
          error.message = "User Already Exist";
          error.httpStatusCode = 403;
          throw error;
        }
        else {
          //user doesn't exist
          const saltHash = authUtils.genPassword(password);
          console.log('saltHash', saltHash)

          // const salt = saltHash.salt;
          // req.app.locals.salt = saltHash.salt;

          const hash = saltHash.hash;
          const salt = saltHash.salt;
          const userInfo = [
            first_name,
            last_name,
            email,
            hash,
            new Date().toUTCString(),
            false,
            user_type,
            gender,
            salt
          ];
          if (user_type == "admin") {
            // console.log('userInfo', userInfo)
            const query4 = `insert into users(first_name, last_name, email, password, creation_date, is_deleted,
                user_type, gender, salt) values ($1, $2, $3, $4, $5,
                $6, $7, $8, $9) returning user_id;`

            return t.any(query4, userInfo);
          } else {
            error.message = "Unsupported account type";
            error.httpStatusCode = 401;
            throw error;
          }
          // })
          /* I recommend doing this only if administrators want to reuse provisional codes (non-unique code) */
          // .then(_ => {
          //   console.log('updating code to null')
          //   const query5 = 'update permissions set code = null where code=$1;'
          //   return task.one(query5, code)
          // })
        }
      });
    });
  }).then(data => {
    req.app.locals.user_id = data[0].user_id;
    req.app.locals.user_type = user_type;
    req.app.locals.email = email;
    next();
  }).catch(err => {
    next(err);
  });
};

exports.resetPassConfirmation = (req, res, next) => {
  var user_id = req.params.user_id;
  var pid = req.params.pass_request_id;
  var link = "https://mesoboard-capstone-app.herokuapp.com/api/auth/resetPassword/" + user_id;
  db.oneOrNone("Select * from reset_password where user_id = $1 and reset_id = $2", [user_id, pid]).then(data => {
    // db.any("delete from reset_password where user_id = $1",[user_id]).then(data => {
    if (data == null) return res.redirect("https://mesoboard-capstone-app.herokuapp.com/not-found");
    else {
      file1 = readFile(__dirname + "/../views/reset-password", "reset-password-form1.html")
      file2 = readFile(__dirname + "/../views/reset-password", "reset-password-form2.html")
      file = file1 + link + file2;
      return res.send(file); //do the re direct here
    }
    //must delete reset_password request when pass are changed
    // });
  });
};
