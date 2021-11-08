
const config = require('../../config/config.js');

exports.prepareVerification = (req, html) => {
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


exports.prepareShout = (req, emails, html) => {
  const mailInfo = {
    content: req.body.content, //text version of the email
    subject: req.body.title,
    cc: [emails],
    displayName: config.mailServiceCredentials.name,
    htmlContent: html
  };

  return mailInfo;
};

exports.prepareResetEmail = (req, html) => {
  const mailInfo = {
    content: "You Need to open the html version of this email", //text version of the email
    subject: "Reset Your Password for Mesoboard",
    cc: [req.body.email],
    displayName: config.mailServiceCredentials.name,
    htmlContent: html
  };

  return mailInfo;

};

exports.prepareInvitationEmail = (email, html) => {
  const mailInfo = {
    subject: "Register To Mesoboard",
    cc: [email],
    displayName: config.mailServiceCredentials.name,
    htmlContent: html
  };

  return mailInfo;
};