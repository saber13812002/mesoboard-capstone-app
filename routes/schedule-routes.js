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
    .post(schedule.setUserSchedule)

  app.route('/protected/schedule/week/all/:schedule_id')
    .get(schedule.getUserSchedules)

  // app.route('/protected/schedule/turn/:turn_id/:user_id')
  app.route('/protected/schedule/turn/all')
    .post(schedule.insertUserTurn)

  app.route('/protected/schedule/turn/:user_id')
    .get(schedule.getUserTurns)
  // app.route('/api/schedule/week') //for testing purposes
  //   .get(schedule.getWeekSchedule) //will not be used

};

// module.exports = app => {
//   // app.route('/api/permissions/all')
//   //   .get(tokens.removeExpiredTokens, tokens.checkToken, security.isAdminOrManager, permissions.getAllPermissions);

//   app.route('/api/permissions/add')
//     .post(tokens.removeExpiredTokens, tokens.checkToken, security.isAdminOrManager, permissions.addPermission);

//   app.route('/api/permissions/verify')
//     .post(permissions.checkPermission);
// };
