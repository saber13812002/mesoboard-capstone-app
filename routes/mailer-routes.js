var mailer = require('../controllers/mailer');

module.exports = app => {
  app.route('/api/mailer/resetPassword')
    .post(mailer.sendResetPasswordEmail);
};
