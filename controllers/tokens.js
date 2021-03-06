const db = require('../config/postgres')();
const authUtils = require('../lib/authUtils')

exports.enforceMaxUserTokensConstraint = (req, res, next) => {
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
  return db.any(query, [max_token_for_query, user_id]).then(() => {
    next();
  }).catch(error => {
    next(error);
  });
};

exports.expireUserTokens = (req, res, next) => {
  console.log('expireUserTokens')
  const token = req.headers.authorization.split(' ')[1];
  // const token = req.get('token');

  // if (!token) { //remove this ya que se implement√≥ '/protected' routes that verifies the token
  //   const error = new Error("Malformed Query: Missing Token");
  //   error.httpStatusCode = 400;
  //   return next(error);
  // } else {
  const query = "DELETE FROM tokens WHERE user_id in (SELECT user_id FROM tokens WHERE token = $1);";
  return db.any(query, token).then(_ => {
    res.status(200).json({
      status: "success",
      message: "Successfully logged out of all devices."
    });
    // next();
    res.end()
  }).catch(error => {
    next(error);
  });
};

exports.addToken = (req, res, next) => {
  console.log('add token');
  const user_id = req.app.locals.user_id;
  const user_type = req.app.locals.user_type;

  let { token, exp } = authUtils.issueJWT(user_id, user_type);
  token = token.split(' ')[1] //exclude the Bearer part of the token

  const q = `INSERT into tokens (token, user_id, expiration_date, user_type) 
    values($1, $2, current_timestamp + interval '48 hours', $3) returning user_id, token, user_type;`;

  return db.one(q, [token, user_id, user_type]).then(data => {
    data['token'] = token;
    data['exp'] = exp;
    if (req.path == '/api/auth/login') {
      console.log('added token on login')
      res.status(200).json({
        ...data,
        status: 'success',
        messge: 'successfully added token'
      });
      res.end();
    }
    else if (req.path == '/api/auth/signup') {
      console.log('added token on signup')
      req.app.locals.token = token;
      res.status(200).json({
        ...data,
        status: 'success',
        messge: 'successfully added token'
      });
      next();
    }
    else {
      const error = new Error();
      error.message = "Unexpected path in add token";
      error.httpStatusCode = 500;
      next(error);
    }
  }).catch(err => {
    next(err);
  });
};

exports.removeExpiredTokens = (req, res, next) => {
  const query = "DELETE FROM tokens WHERE expiration_date < TIMESTAMP 'now'";
  return db.any(query).then(() => {
    next();
  }).catch(err => {
    next(err);
  });
};

// may not be used now with the '/protected' routes implementation
exports.checkToken = (req, res, next) => {
  // const token = req.get('token');
  const token = req.jwt.token;
  console.log('checkToken -> token:\n', token)
  const error = new Error();
  if (!token) {
    error.message = "Malformed Query: Missing Token";
    error.httpStatusCode = 400;
    return next(error);
  }
  const query = "SELECT * from tokens where token = $1";
  return db.any(query, [token]).then(data => {
    if (data.length == 0) {
      error.message = "Access Denied: Token Expired";
      error.httpStatusCode = 401;
      next(error);
    } else {
      req.app.locals.user_id = data[0].user_id;
      req.app.locals.user_type = data[0].user_type;
      next();
    }
  }).catch(err => {
    next(err);
  });
};