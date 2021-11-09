const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs')
const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

exports.verifyJWT = (req, res, next) => {
  console.log('verifyJWT')
  // console.log('PUB_KEY', PUB_KEY)
  // console.log(req.headers)
  const tokenParts = req.headers.authorization.split(' ');

  if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
    try {
      console.log('verifying...')
      const verification = jwt.verify(tokenParts[1], PUB_KEY, { algorithms: ['RS256'] });
      // const verification = jwt.verify(`
      // eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYzNjM4NTE3ODM3MSwiZXhwIjoxNjM2Mzg1MTc4MzcxfQ.fzVDDdUq5HprwmPQirQELAMX5L3azzjVy-GWfireafs79VZgl_t3a9sM3AtSnO9PjOUKLB3Pm6oZUcjS2JjcFYxCs97NcEmihV1xGPsCJJtsjukF4Ck5j9PPCRrHRnuN4pHO-WsreO4scIVbzEGhzbLklWLz7G3d2BOR-oi9J-EXgCNb6u4fENPxs9PJyNPMAMqBayUMeuHZQbFtoMLsHbk1mescpaiAm07d_X-Sow6HwT468Jhe3QinqJ8Vc_jWR9-IKlF-eeYiGe4cFx_Ksce2N3ZSAGqAlvkXoYBEn0NEghAhf7nhTgirosO2J0zaWI2NMZjjcXBPdqn_xVJ8Ud7bUz8HHqzyHZCLANjucNnjGnY1HRNf6xy75wYpQTAxUS2KH7EaOXB5STV6QwXZ-k2ttF0ZpdJWw2ePO2TdLaTRGv0R5tMXaZMtaV9hO1wBwNd8ep4hBD8N7LQBDdAcuClon6LmDYBqQVUyCSpUJco_VpcIzHfuHyqWkeiZvF9j_jO9jaYETwxOmm4tdjT7ZWwWTX4Vd_p9DWiFlDSTXTbOIx1Z2BpGNAHo0Xs8y3pm4yF1Ev5EKKwWuk__VWISMsvnfLgJ_KJxm9UcBii7AmcRMH-tT6J0FrNQTE55J0d99kRU35AwvmH6oumwOa6ZRUNaLpwaZwBBqRlHlVGGxM0
      // `, PUB_KEY, { algorithms: ['RS256'] });

      console.log('verified')
      req.jwt = verification; //store token on request object
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

exports.fileCheck = (req, res, next) => {
  // const filename = req.files.filename;
  let name;
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

  const content = name.split('.');
  format = content[content.length - 1];
  if (format != 'pdf' && format != 'png' && format != 'jpg' && format != 'jpeg' && format != 'ppt' && format != 'pptx' && 'odp') {
    error = new Error('File Type not accepted');
    return next(error);
  }

  next();
}

exports.isAdmin = (req, res, next) => {
  const user_type = req.app.locals.user_type;
  if (user_type == 'admin') {
    next();
  } else {
    const error = new Error();
    error.message = "Forbidden: Admin privileges required for this operation.";
    error.httpStatusCode = 403;
    next(error);
  }
};

exports.isManager = (req, res, next) => {
  const user_type = req.app.locals.user_type;
  if (user_type == 'manager') {
    next();
  } else {
    const error = new Error();
    error.message = "Forbidden: Manager privileges required for this operation.";
    error.httpStatusCode = 403;
    next(error);
  }
};

exports.isEmployee = (req, res, next) => {
  const user_type = req.app.locals.user_type;
  if (user_type == 'employee') {
    next();
  } else {
    const error = new Error();
    error.message = "Forbidden: Employee privileges required for this operation.";
    error.httpStatusCode = 403;
    next(error);
  }
};

exports.isAdminOrManager = (req, res, next) => {
  const user_type = req.app.locals.user_type;
  if (user_type == 'admin' || user_type == 'manager') {
    next();
  } else {
    const error = new Error();
    error.message = "Forbidden: Admin or Manager privileges required for this operation.";
    error.httpStatusCode = 403;
    next(error);
  }
};
