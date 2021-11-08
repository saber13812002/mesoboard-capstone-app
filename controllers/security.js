var db = require('../config/postgres')();

// exports.isValidUser = function authMiddleware(req, res, next) {
exports.verifyJWT = function (req, res, next) {
  const tokenParts = req.headers.authorization.split(' ');

  if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
    try {
      const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, { algorithms: ['RS256'] });
      req.jwt = verification; //store token on request object
      next();
    } catch (err) {
      res.status(401).json({ success: false, msg: 'You are not authorized to visit this route' });
    }
  } else {
    res.status(401).json({ success: false, msg: 'You are not authorized to visit this route' });
  }
}

exports.isAdmin = function (req, res, next) {
  var user_type = req.app.locals.user_type;
  console.log('\n\nuser_type', user_type)
  if (user_type == 'admin') {
    next();
  } else {
    var error = new Error();
    error.message = "Forbidden: Admin privileges required for this operation.";
    error.httpStatusCode = 403;
    next(error);
  }
};

exports.fileCheck = function (req, res, next) {
  // var filename = req.files.filename;
  var name;
  if (req.files.poster)
    name = req.files.poster.name;

  if (req.files.presentation)
    name = req.files.presentation.name;

  if (req.files.resume)
    name = req.files.resume.name;

  if (req.files.picture)
    name = req.files.picture.name;

  if (req.files.proposal)
    name = req.files.proposal.name;

  if (req.files.sponsorLogo)
    name = req.files.sponsorLogo.name;

  if (req.files.purchase)
    name = req.files.purchase.name

  var content = name.split('.');
  format = content[content.length - 1];
  if (format != 'pdf' && format != 'png' && format != 'jpg' && format != 'jpeg' && format != 'ppt' && format != 'pptx' && 'odp') {
    error = new Error('File Type not accepted');
    return next(error);
  }

  next();
}

exports.isAdmin = function (req, res, next) {
  var user_type = req.app.locals.user_type;
  if (user_type == 'admin') {
    next();
  } else {
    var error = new Error();
    error.message = "Forbidden: Admin privileges required for this operation.";
    error.httpStatusCode = 403;
    next(error);
  }
};

exports.isManager = function (req, res, next) {
  var user_type = req.app.locals.user_type;
  if (user_type == 'manager') {
    next();
  } else {
    var error = new Error();
    error.message = "Forbidden: Manager privileges required for this operation.";
    error.httpStatusCode = 403;
    next(error);
  }
};

exports.isEmployee = function (req, res, next) {
  var user_type = req.app.locals.user_type;
  if (user_type == 'employee') {
    next();
  } else {
    var error = new Error();
    error.message = "Forbidden: Employee privileges required for this operation.";
    error.httpStatusCode = 403;
    next(error);
  }
};

exports.isAdminOrManager = function (req, res, next) {
  var user_type = req.app.locals.user_type;
  if (user_type == 'admin' || user_type == 'manager') {
    next();
  } else {
    var error = new Error();
    error.message = "Forbidden: Admin or Manager privileges required for this operation.";
    error.httpStatusCode = 403;
    next(error);
  }
};
