const db = require('../config/postgres')();
const authUtils = require('../lib/authUtils')

exports.enforceMaxUserTokensConstraint = function (req, res, next) {
  const user_id = req.app.locals.user_id;
  const max_token_amount = 2;
  const max_token_for_query = max_token_amount - 1;
  console.log('enforceMaxUserTokensConstraint', user_id);

  const query = "DO " +
    "$do$ " +
    "BEGIN " + "IF " +
    "(SELECT count(*) > $1 as exceded_tokens from tokens where user_id = $2) THEN " +
    "DELETE from tokens where token_id in (SELECT token_id from tokens where user_id = $2 Order By expiration_date DESC Limit $1); " +
    "END IF ;" +
    "END " +
    "$do$";
  return db.any(query, [max_token_for_query, user_id]).then(function () {
    next();
  }).catch(function (error) {
    next(error);
  });
};

exports.expireUserTokens = function (req, res, next) {
  console.log('expireUserTokens', req.body)
  const token = req.get('token');
  console.log(!token, 'token', token)
  if (!token) {
    var error = new Error("Malformed Query: Missing Token");
    error.httpStatusCode = 400;
    return next(error);
  } else {
    console.log('deleting token')
    var query = "DELETE FROM tokens WHERE user_id in (SELECT user_id FROM tokens WHERE token = $1);";
    return db.any(query, [token]).then(_ => {
      res.status(200).json({
        status: "success",
        message: "Successfully logged out of all devices."
      });
      // next();
      res.end()
    }).catch(function (error) {
      next(error);
    });
  }
};

exports.addToken = function (req, res, next) {
  console.log('add token');
  const user_id = req.app.locals.user_id;
  const user_type = req.app.locals.user_type;

  const { token, expiresIn } = authUtils.issueJWT(user_id);
  const query =
    `INSERT into tokens (token, user_id, expiration_date, user_type) 
     values($1, $2, current_timestamp + interval '48 hours', $3) returning user_id, token, user_type;`;

  return db.one(query, [token, user_id, user_type]).then(function (data) {
    data['token'] = token;
    data['expiresIn'] = expiresIn;
    if (req.path == '/api/auth/login') {
      console.log('added token on login')
      res.status(200).json({
        data,
        status: 'success',
        messge: 'successfully added token'
      });
      res.end();
    }
    else if (req.path == '/api/auth/signup') {
      console.log('added token on signup')
      res.status(200).json({
        data,
        status: 'success',
        messge: 'successfully added token'
      });
      next();
    }
    else {
      var error = new Error();
      error.message = "Unexpected path in add token";
      error.httpStatusCode = 500;
      next(error);
    }
  }).catch(function (err) {
    next(err);
  });
};

exports.removeExpiredTokens = function (req, res, next) {
  var query = "DELETE FROM tokens WHERE expiration_date < TIMESTAMP 'now'";
  return db.any(query).then(function () {
    next();
  }).catch(function (err) {
    next(err);
  });
};

exports.checkToken = function (req, res, next) {
  var token = req.get('token');
  var error = new Error();
  if (!token) {
    error.message = "Malformed Query: Missing Token";
    error.httpStatusCode = 400;
    return next(error);
  }
  var query = "SELECT * from tokens where token = $1";
  return db.any(query, [token]).then(function (data) {
    if (data.length == 0) {
      error.message = "Access Denied: Token Expired";
      error.httpStatusCode = 401;
      next(error);
    } else {
      req.app.locals.user_id = data[0].user_id;
      req.app.locals.user_type = data[0].user_type;
      next();
    }
  }).catch(function (err) {
    next(err);
  });
};