// const mongoose = require('mongoose');
// const router = require('express').Router();
// const Users = mongoose.model('Users');
// const Permissions = mongoose.model('Permissions');
// const Tokens = mongoose.model('Tokens');
// const utils = require('../lib/utils');

// router.get('/protected', utils.authMiddleware, (req, res, next) => {
//     // console.log('req.jwt', req.jwt)
//     res.status(200).json({ success: true, message: "You are successfully authenticated to this route!" });
// });

// // Validate an existing user and issue a JWT
// router.post('/login', (req, res, next) => {
//     const toFind = {}
//     if (req.body.code)
//         toFind['code'] = req.body.code
//     else if (req.body.email)
//         toFind['email'] = req.body.email
//     else if (req.body.phone)
//         toFind['phone'] = req.body.phone

//     Users.findOne(toFind).then(user => {
//         if (!user)
//             return res.status(401).json({ message: "could not find user", status: 'failed' });

//         Tokens.findOne({ user_id: user._id }).then(token => {
//             const isValid = utils.validPassword(req.body.password, user.password, token.salt);
//             if (isValid) {
//                 const jwt = utils.issueJWT(user);
//                 res.status(200).json({
//                     token: jwt.token,
//                     expiresIn: jwt.expires,
//                     message: 'Retrieved User',
//                     status: 'success'
//                 });
//             } else {
//                 res.status(401).json({ message: "you entered the wrong password", status: 'failed' });
//             }
//         })
//     })
//         .catch((err) => {
//             next(err);
//         });
// });

// // Register a new user
// router.post('/register', utils.verifyPermissionMiddleware, (req, res, next) => {
//     const saltHash = utils.genPassword(req.body.password);
//     console.log('saltHash', saltHash)

//     const salt = saltHash.salt;
//     const hash = saltHash.hash;

//     const obj = {
//         code: req.body.code,
//         user_type: req.body.user_type,
//         password: hash,
//     }
//     if (req.body.email) {
//         obj['email'] = req.body.email
//     }
//     if (req.body.phone) {
//         obj['phone'] = req.body.phone
//     }
//     if (req.body.restaurant) {
//         obj['restaurant'] = req.body.restaurant
//     }

//     const newUser = new Users(obj);

//     try {
//         newUser.save().then(user => {
//             let _id = user._id
//             let jwt = utils.issueJWT(user);

//             const newToken = new Tokens({
//                 user_id: _id,
//                 token_str: jwt.token,
//                 salt: salt,
//                 expiration_date: jwt.expires
//             })
//             newToken.save().then(_ => {
//                 console.log('commmon')
//                 res.status(200).json({
//                     token: jwt.token,
//                     user_type: user.user_type,
//                     expiresIn: jwt.expires,
//                     message: 'User registered successfully',
//                     status: 'success'
//                 });
//             })
//         });
//     } catch (err) {
//         res.json({ message: err, status: 'failed' });
//     }
// });

// router.post('/permissions/add', (req, res, next) => {
//     const newPermission = new Permissions({
//         email: req.body.email,
//         phone: req.body.phone,
//         code: req.body.code,
//         restaurant: req.body.restaurant,
//         permission_type: req.body.permission_type,
//         last_update: Date.now()
//     });

//     try {
//         newPermission.save().then(permission => {
//             console.log('permission', permission)
//             const data = {
//                 permission_type: permission.permission_type,
//                 code: req.body.code,
//                 restaurant: permission.restaurant
//             }
//             if (permission.email) {
//                 data['email'] = permission.email
//             }
//             if (permission.phone) {
//                 data['phone'] = permission.phone
//             }

//             console.log('data', data)
//             // console.log('permission', permission)
//             res.status(200).json({
//                 data,
//                 message: 'Added Permission',
//                 status: 'success'
//             });
//         });
//     } catch (err) {
//         res.status(400).json({
//             message: 'Unable to add permission',
//             status: 'failed'
//         });
//     }
// })

// router.get('/permissions/verify', utils.verifyPermissionMiddleware);

// module.exports = router;




const controller = require('../controllers/users');
const router = require('express').Router();

router
    .get('/hello', controller.hello)
    .get('/users', controller.getAllUsers)

module.exports = router;
