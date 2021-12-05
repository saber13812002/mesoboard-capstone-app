const auth = require('../controllers/authentication');
const tokens = require('../controllers/tokens');
// const mailer = require('../controllers/mailer');
const messenger = require('../controllers/messenger');
const security = require('../controllers/security');

// tokens.removeExpiredTokens
module.exports = app => {
  app.route('/api/auth/login')
    .post(auth.login, tokens.enforceMaxUserTokensConstraint, tokens.addToken);

  app.route('/protected/auth/logout')
    .get(tokens.expireUserTokens);

  app.route('/api/auth/signup')
    .post(auth.createUser, tokens.addToken, /*messenger.sendVerificationCode*/); //send message code MW only purpose is to end response, for now
  // .post(auth.createUser, tokens.addToken, mailer.sendVerificationEmail);

  app.route('/protected/auth/restaurant/all')
    .get(security.isAdminOrManager, auth.getAllRestaurants)

  app.route('/api/auth/confirmEmail/:email/:token')
    .get(auth.confirmEmail);

  // used for login and registering on the app
  app.route('/api/auth/verifyToken/getUser')
    .post(auth.checkTokenAndGetUser);

  // used for when logged in, but react app was refreshed
  app.route('/protected/auth/userData')
    .get(tokens.removeExpiredTokens, auth.getUserData);

  app.route('/api/auth/resetPassword/:user_id')
    .get(auth.resetPassword);

  app.route('/api/auth/:user_id/reset_password/:pass_request_id')
    .get(auth.resetPassConfirmation);

  // .get(tokens.removeExpiredTokens, tokens.checkToken, auth.getUserData);

}
