
const config = require('../../config/config.js');

exports.prepareVerification = function (req, html) {
  console.log('prepareVerification')
  console.log('req.body.content', req.body.content, config.mailServiceCredentials.name)
  const mailInfo = {
    content: req.body.content, //text version of the email
    subject: "Welcome To Mesoboard",
    cc: [req.app.locals.email],
    displayName: config.mailServiceCredentials.name,
    htmlContent: html
  };

  return mailInfo;
};


exports.prepareShout = function (req, emails, html) {
  const mailInfo = {
    content: req.body.content, //text version of the email
    subject: req.body.title,
    cc: [emails],
    displayName: config.mailServiceCredentials.name,
    htmlContent: html
  };

  return mailInfo;
};

exports.prepareResetEmail = function (req, html) {
  const mailInfo = {
    content: "You Need to open the html version of this email", //text version of the email
    subject: "Reset Your Password for Mesoboard",
    cc: [req.body.email],
    displayName: config.mailServiceCredentials.name,
    htmlContent: html
  };

  return mailInfo;

};

exports.prepareInvitationEmail = function (email, html) {
  const mailInfo = {
    subject: "Register To Mesoboard",
    cc: [email],
    displayName: config.mailServiceCredentials.name,
    htmlContent: html
  };

  return mailInfo;
};