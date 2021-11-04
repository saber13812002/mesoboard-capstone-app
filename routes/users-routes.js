const controller = require('../controllers/users');

module.exports = function (app) {
    app
        .get('/api', controller.connected)
        .get('/api/users', controller.getAllUsers)
        .get('/api/users/:id', controller.getUser)
}


// const controller = require('../controllers/users');
// const router = require('express').Router();

// router
//     .get('/', controller.hello)
//     .get('/hello', controller.hello)
//     .get('/users', controller.getAllUsers)

// module.exports = router;
