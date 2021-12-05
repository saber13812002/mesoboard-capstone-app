const permissions = require('../controllers/permission');
const tokens = require('../controllers/tokens');
const mailer = require('../controllers/mailer');
const security = require('../controllers/security');

module.exports = app => {
  // app.route('/api/permission/all')
  //   .get(tokens.removeExpiredTokens, tokens.checkToken, security.isAdminOrManager, permissions.getAllPermissions);

  app.route('/protected/permission/add')
    .post(tokens.removeExpiredTokens, /*tokens.checkToken,*/ security.isAdminOrManager, permissions.addPermission, mailer.sendRegisterInvitationEmail);
  // .post(tokens.removeExpiredTokens, tokens.checkToken, security.isAdminOrManager, permissions.addPermission, mailer.sendRegisterInvitationEmail); //send mail MW only purpose is to end response, for now

  app.route('/protected/permission/users/all')
    .get(security.isAdminOrManager, permissions.getPermissionsAndUsers);

  app.route('/api/permission/verify')
    .post(permissions.checkPermission);

  // app.route('/api/permission/revoke')
  // .post(tokens.removeExpiredTokens, tokens.checkToken, security.isAdmin, permissions.revokePermission);
};
