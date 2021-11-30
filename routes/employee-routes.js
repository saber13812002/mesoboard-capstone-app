// const tokens = require('../controllers/tokens');
// const mailer = require('../controllers/mailer');
// const messenger = require('../controllers/messenger');
const security = require('../controllers/security');
const employee = require('../controllers/employee');

// tokens.removeExpiredTokens
module.exports = app => {
  app.route('/protected/employee/all')
    .get(security.isAdminOrManager, employee.getAllEmployees);
};
