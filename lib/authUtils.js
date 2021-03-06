const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

/**
 * -------------- HELPER FUNCTIONS ----------------
 */

/**
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 * 
 * @param {string} password - The plain text password
 * @param {string} hash - The hash stored in the database
 * @param {string} salt - The salt stored in the database
 */
const isValidPassword = (password, hash, salt) => {
  const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

/** 
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 * 
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 * 
 * @param {string} password - The password string that the user inputs to the password field in the register form
 */
const genPassword = (password) => {
  const salt = crypto.randomBytes(32).toString('hex');
  const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  return {
    salt: salt,
    hash: genHash
  };
}


/**
 * @param {object} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
const issueJWT = (user_id, user_type) => {
  const expiresIn = '2'; //amount of days

  const payload = {
    sub: user_id,
    user_type,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(
    payload, PRIV_KEY, { expiresIn, algorithm: 'RS256' }
  );

  return {
    token: 'Bearer ' + signedToken,
    exp: expiresIn
  }
}

module.exports.isValidPassword = isValidPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;