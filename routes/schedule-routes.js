const tokens = require('../controllers/tokens');
const security = require('../controllers/security');
const schedule = require('../controllers/schedule');
const authUtils = require('../lib/authUtils')

module.exports = app => {
  app.route('/api/schedule/week')
    // .get(security.verifyJWT, schedule.getWeekSchedule)
    // .get(schedule.getWeekSchedule)
    .get(security.verifyJWT)

  app.route('/protected/schedule/week')
    .get(schedule.getWeekSchedule)
};

// module.exports = app => {
//   // app.route('/api/permissions/all')
//   //   .get(tokens.removeExpiredTokens, tokens.checkToken, security.isAdminOrManager, permissions.getAllPermissions);

//   app.route('/api/permissions/add')
//     .post(tokens.removeExpiredTokens, tokens.checkToken, security.isAdminOrManager, permissions.addPermission);

//   app.route('/api/permissions/verify')
//     .post(permissions.checkPermission);
// };
