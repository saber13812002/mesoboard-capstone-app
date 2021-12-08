const tokens = require('../controllers/tokens');
const security = require('../controllers/security');
const schedule = require('../controllers/schedule');
const authUtils = require('../lib/authUtils')

module.exports = app => {
  app.route('/protected/schedule/week')
    .post(security.isAdminOrManager, schedule.setUserSchedule)

  app.route('/protected/schedule/week/all/:schedule_id')
    .get(schedule.getEmployeeSchedules)

  // app.route('/protected/schedule/turn/:turn_id/:user_id')
  app.route('/protected/schedule/turn')
    .post(security.isManager, schedule.insertUserTurn)

  app.route('/protected/schedule/turn/all')
    .get(security.isManager, schedule.getUserTurns)

  app.route('/protected/schedule/turn/:turn_id/remove')
    .delete(security.isManager, schedule.removeUserTurn)
  // app.route('/api/schedule/week') //for testing purposes
  //   .get(schedule.getWeekSchedule) //will not be used

};