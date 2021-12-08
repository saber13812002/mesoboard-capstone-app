const security = require('../controllers/security');
const controller = require('../controllers/profiles');

module.exports = function (app) {
    app.route('/protected/profiles')
        .get(security.isAdminOrManager, controller.getUsers);

    app.route('/protected/profiles/schedule/all/:schedule_id')
        .get(security.isAdminOrManager, controller.getAllUsersWithSchedule);

    app.route('/protected/profiles/schedule/:user_id/:schedule_id')
        .get(security.isAdminOrManager, controller.getUserWithSchedule);
}


// const controller = require('../controllers/users');
// const router = require('express').Router();

// router
//     .get('/', controller.hello)
//     .get('/hello', controller.hello)
//     .get('/users', controller.getAllUsers)

// module.exports = router;
