const permissions = require('../controllers/permissions');
const tokens = require('../controllers/tokens');
const mailer = require('../controllers/mailer');
const security = require('../controllers/security');

module.exports = app => {
  // app.route('/api/permissions/all')
  //   .get(tokens.removeExpiredTokens, tokens.checkToken, security.isAdminOrManager, permissions.getAllPermissions);

  app.route('/protected/permissions/add')
    .post(tokens.removeExpiredTokens, /*tokens.checkToken,*/ security.isAdminOrManager, permissions.addPermission, mailer.sendRegisterInvitationEmail); //send mail MW only purpose is to end response, for now
  // .post(tokens.removeExpiredTokens, tokens.checkToken, security.isAdminOrManager, permissions.addPermission, mailer.sendRegisterInvitationEmail); //send mail MW only purpose is to end response, for now

  app.route('/protected/permissions/users/all')
    .get(security.isAdminOrManager, permissions.getPermissionsAndUsers);

  app.route('/api/permissions/verify')
    .post(permissions.checkPermission);

  // app.route('/api/permissions/revoke')
  // .post(tokens.removeExpiredTokens, tokens.checkToken, security.isAdmin, permissions.revokePermission);
};
