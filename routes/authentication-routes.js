const auth = require('../controllers/authentication');
var tokens = require('../controllers/tokens');
var mailer = require('../controllers/mailer');
var messenger = require('../controllers/messenger');

module.exports = app => {
  app.route('/api/auth/login')
    .post(auth.login, tokens.enforceMaxUserTokensConstraint, tokens.addToken);

  app.route('/api/auth/logout')
    .get(tokens.expireUserTokens);

  app.route('/api/auth/signup')
    .post(auth.createUser, tokens.addToken, messenger.sendVerificationCode);
  // .post(auth.createUser, tokens.addToken, mailer.sendVerificationEmail);

  app.route('/api/auth/confirmEmail/:email/:token')
    .get(auth.confirmEmail);

  app.route('/api/auth/verifyToken/getUser')
    .post(auth.checkTokenAndGetUser);

  // app.route('/api/auth/changePassword')
  //     .post(tokens.checkToken, auth.changePassword);

  // app.route('/api/auth/resetPassword/:user_id')
  //     .get(auth.resetPass);

  // app.route('/api/auth/:user_id/reset_password/:pass_request_id')
  //     .get(auth.resetPassConfirmation);
};
