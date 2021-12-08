var db = require('../config/postgres')();
const utils = require('../lib/utils');

const notificationTypes = {
  newUser: 'new_user',
  loadedNotifications: 'Loaded Notifications',
  message: 'message'
}


exports.notifyUserGotRegistered = async (req, res, next) => {
  const user_full_name = req.app.locals.name;
  let user_type = req.app.locals.user_type;
  user_type = utils.getUserTypeInSpanish(user_type);
  const title = 'User Registered';
  const body = `${user_type} ${user_full_name} ha sido registrado`;
  const restaurant_id = req.app.locals.restaurant_id;

  const q = `WITH notif AS (INSERT INTO notification (title, body, sent_date, type) VALUES ($1, $2, now(), '${notificationTypes.newUser}') returning *, notification.notification_id AS notif_id)
    INSERT INTO user_notification (notification_id, user_id, seen, seen_date) select notif_id, users.user_id, false, null from users, notif where users.restaurant_id=$3 and user_type='manager'`;

  return db.any(q, [title, body, restaurant_id]).then(data => {
    console.log('data', data);
    next();
  })
    .catch(error => {
      next(error);
    });
};


exports.getAllUserNotifications = async (req, res, next) => {
  // var user_id = req.app.locals.user_id;
  const user_id = req.jwt.sub;
  const query = `select * from notification natural inner join user_notification where user_id = $1 order by sent_date desc`;
  return db.any(query, user_id).then(notifications => {
    res.status(200).json({
      status: 'success',
      message: 'Succesfully Retrieved Notifications',
      notifications
    });
    res.end();
  }).catch(error => {
    next(error);
  });
};


exports.getUnseenUserNotifications = async (req, res, next) => {
  const user_id = req.jwt.sub;
  const q = `SELECT * FROM notification natural inner join user_notification where user_id = $1 and not seen order by sent_date desc`;
  return db.any(q, user_id).then(notifications => {
    res.status(200).json({
      status: 'success',
      message: 'Succesfully Retrieved Unseen Notifications',
      notifications
    });
    res.end();
  }).catch(error => {
    next(error);
  });
};

exports.setUserNotificationsAsSeen = async (req, res, next) => {
  const user_id = req.jwt.sub;
  const q = `update user_notification set seen = true, seen_date = now() where not seen and user_id = $1`;
  return db.any(q, user_id).then(() => {
    res.status(201).json({
      status: 'success',
      message: 'Succesfully marked notification as seen',
      data: []
    });
    res.end();
  }).catch(error => {
    next(error);
  });
};


