const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs')
const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

exports.verifyJWT = (req, res, next) => {
  console.log('verifyJWT')
  const tokenParts = req.headers.authorization.split(' ');

  if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
    try {
      const payload = jwt.verify(tokenParts[1], PUB_KEY, { algorithms: ['RS256'] });
      req.jwt = payload; //store token's payload on request object
      next();
    } catch (err) {
      console.log(err)
      res.status(401).json({ success: false, msg: 'You are not authorized to visit this route' });
    }
  } else {
    res.status(401).json({ success: false, msg: "Invalid token format. Don't forget the 'Bearer ' before the token signature" });
  }
}

exports.isAdmin = (req, res, next) => {
  const user_type = req.app.locals.user_type;
  console.log('\n\nuser_type', user_type)
  if (user_type == 'admin') {
    next();
  } else {
    const error = new Error();
    error.message = "Forbidden: Admin privileges required for this operation.";
    error.httpStatusCode = 403;
    next(error);
  }
};

// exports.isManager = (req, res, next) => {
//   const user_type = req.app.locals.user_type;
//   if (user_type == 'manager') {
//     next();
//   } else {
//     const error = new Error();
//     error.message = "Forbidden: Manager privileges required for this operation.";
//     error.httpStatusCode = 403;
//     next(error);
//   }
// };

// exports.isEmployee = (req, res, next) => {
//   const user_type = req.app.locals.user_type;
//   if (user_type == 'employee') {
//     next();
//   } else {
//     const error = new Error();
//     error.message = "Forbidden: Employee privileges required for this operation.";
//     error.httpStatusCode = 403;
//     next(error);
//   }
// };

exports.isAdminOrManager = (req, res, next) => {
  // const user_type = req.app.locals.user_type;
  const user_type = req.jwt.user_type;
  console.log('user_type', user_type)
  if (user_type == 'admin' || user_type == 'manager') {
    next();
  } else {
    const error = new Error();
    error.message = "Forbidden: Admin or Manager privileges required for this operation.";
    error.httpStatusCode = 403;
    next(error);
  }
};




// exports.fileCheck = (req, res, next) => {
//   // const filename = req.files.filename;
//   let name;
//   if (req.files.poster)
//     name = req.files.poster.name;

//   if (req.files.presentation)
//     name = req.files.presentation.name;

//   if (req.files.resume)
//     name = req.files.resume.name;

//   if (req.files.picture)
//     name = req.files.picture.name;

//   if (req.files.proposal)
//     name = req.files.proposal.name;

//   if (req.files.sponsorLogo)
//     name = req.files.sponsorLogo.name;

//   if (req.files.purchase)
//     name = req.files.purchase.name

//   const content = name.split('.');
//   format = content[content.length - 1];
//   if (format != 'pdf' && format != 'png' && format != 'jpg' && format != 'jpeg' && format != 'ppt' && format != 'pptx' && 'odp') {
//     error = new Error('File Type not accepted');
//     return next(error);
//   }

//   next();
// }