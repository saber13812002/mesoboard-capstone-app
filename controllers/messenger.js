// var db = require('../config/postgres')();
// const Messenger = require('../models/Messenger/Messenger')

exports.sendVerificationCode = (req, res, next) => {
  console.log('sendVerificationCode')
  // res.status(200).json({
  //   message: "Ending endpoint?"
  // });
  res.end()
  // next()
  // new Messenger().createMessage().then(msg => {
  //   console.log('msg', msg)
  //   res.status(200).json({
  //     msgInfo: msg,
  //     message: "Message Sent"
  //   });
  //   res.end()
  // })
  //   .catch(err => {
  //     res.status(error.httpStatusCode ? error.httpStatusCode : 500).json({
  //       message: error.message ? error.message : "Something went wrong"
  //     });
  //   })
  // // .catch(err => console.log(error))
}