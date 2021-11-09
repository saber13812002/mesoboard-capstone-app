const tokens = require('../controllers/tokens');
const security = require('../controllers/security');
const calendar = require('../controllers/calendar');
const authUtils = require('../lib/authUtils')

module.exports = app => {
  app.route('/api/calendar/week')
    // .get(security.verifyJWT, calendar.getWeekSchedule)
    .get(calendar.getWeekSchedule)
};

// module.exports = app => {
//   // app.route('/api/permissions/all')
//   //   .get(tokens.removeExpiredTokens, tokens.checkToken, security.isAdminOrManager, permissions.getAllPermissions);

//   app.route('/api/permissions/add')
//     .post(tokens.removeExpiredTokens, tokens.checkToken, security.isAdminOrManager, permissions.addPermission);

//   app.route('/api/permissions/verify')
//     .post(permissions.checkPermission);
// };
