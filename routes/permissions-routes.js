const permissions = require('../controllers/permissions');
const tokens = require('../controllers/tokens');
// const mailer = require('../controllers/mailer');
const security = require('../controllers/security');

module.exports = app => {

  // app.route('/api/permissions/all')
  //   .get(tokens.removeExpiredTokens, tokens.checkToken, security.isAdminOrManager, permissions.getAllPermissions);

  app.route('/api/permissions/add')
    .post(tokens.removeExpiredTokens, tokens.checkToken, security.isAdminOrManager, permissions.addPermission);

  app.route('/api/permissions/verify')
    .post(permissions.checkPermission);

  // app.route('/api/permissions/revoke')
  // .post(tokens.removeExpiredTokens, tokens.checkToken, security.isAdmin, permissions.revokePermission);
};
