const notification = require('../controllers/notification');
const tokens = require('../controllers/tokens');
const security = require('../controllers/security');

module.exports = app => {
  app.route('/protected/notification/unseen')
    .get(notification.getUnseenUserNotifications);

  app.route('/protected/notification/markAllAsSeen')
    .post(notification.setUserNotificationsAsSeen);

  app.route('/protected/notification/all')
    .get(notification.getAllUserNotifications);
};