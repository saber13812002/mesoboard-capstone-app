const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const Permissions = mongoose.model('Permissions');

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const pathToPubKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');
const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8');


function authMiddleware(req, res, next) {
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

function verifyPermissionMiddleware(req, res, next) {
  const code = req.body.code;
  const email = req.body.email;
  var error = new Error();

  if (!code) {
    error.message = "Malformed Query (missing code)";
    error.httpStatusCode = 400;
    return next(error);
  }
  // else if (!code && !email) {
  //   error.message = "Malformed Query (missing email)";
  //   error.httpStatusCode = 400;
  //   return next(error);
  // }

  const toFind = {}
  if (code)
    toFind['code'] = code
  else if (email)
    toFind['email'] = email


  Users.findOne(toFind).then(user => {
    console.log('---')
    if (user) {
      error.message = "User already exists.";
      error.httpStatusCode = 400;
      throw error;
    } else {
      Permissions.findOne(toFind).then(permission => {
        // if (permission) {
        //   res.status(200)
        //     .json({
        //       data: permission,
        //       message: 'Retrieved Permission',
        //       status: 'success'
        //     });
        // }
        // else {
        if (!permission) {
          res.status(404).json({ message: 'Crediential provided is not found' });
        }
      })
      next()
    }
  })
    .catch((err) => {
      next(err);
    });
}

/**
 * -------------- HELPER FUNCTIONS ----------------
 */

/**
 * 
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 * 
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password, hash, salt) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

/**
 * 
 * @param {*} password - The password string that the user inputs to the password field in the register form
 * 
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 * 
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  return {
    salt: salt,
    hash: genHash
  };
}


/**
 * @param user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
function issueJWT(user) {
  const payload = {
    sub: user._id,
    iat: Date.now()
  };
  const expiresIn = '1d';
  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn, algorithm: 'RS256' });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.authMiddleware = authMiddleware;
module.exports.verifyPermissionMiddleware = verifyPermissionMiddleware;