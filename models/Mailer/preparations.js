
const config = require('../../config/config.js');

exports.prepareVerification = (req, html) => {
  console.log('prepareVerification')
  console.log('req.body.content', req.body.content, config.mailServiceCredentials.name)
  const mailInfo = {
    content: req.body.content, //text version of the email
    subject: 'Bienvenido a Mesoboard',
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
    content: 'Necesita abrir la versión html de este correo electrónico', //text version of the email
    subject: 'Restablecer su contraseña para Mesoboard',
    cc: [req.body.email],
    displayName: config.mailServiceCredentials.name,
    htmlContent: html
  };

  return mailInfo;

};

exports.prepareInvitationEmail = (email, html) => {
  const mailInfo = {
    subject: 'Registrarse en Mesoboard',
    cc: [email],
    displayName: config.mailServiceCredentials.name,
    htmlContent: html
  };

  return mailInfo;
};