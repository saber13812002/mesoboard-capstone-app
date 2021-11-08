const nodemailer = require('nodemailer');
const db = require('../config/postgres')();
const config = require('../config/config.js');
const fs = require('fs');
const p = require('path');
const views_dir = p.resolve(__dirname, '..', 'views'); //need to fix this
const preparations = require('../models/Mailer/preparations')
// const Mailer = require('../models/Mailer/Mailer');

setTransporter = () => {
  console.log('setTransporter', setTransporter)
  const transporter = nodemailer.createTransport({
    pool: true,
    host: config.mailServiceCredentials.host,
    port: config.mailServiceCredentials.port,
    secure: config.mailServiceCredentials.ssl,
    auth: {
      user: config.mailServiceCredentials.email,
      pass: config.mailServiceCredentials.password
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  return transporter;
};

readFile = (dir, file) => {
  const content = fs.readFileSync(dir + "/" + file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    }
    return data;
  });
  return content;
};

attachLink = (html1, html2, link) => {
  const htmlContent = readFile(views_dir, html1);
  htmlContent += link;
  htmlContent += readFile(views_dir, html2);

  return htmlContent;
};

setMailOptions = (mailInfo) => {
  const cc = "";
  const dSize = mailInfo.cc.length;

  //converts array to string of recipients
  for (const d = 0; d < dSize; d++) {
    cc += mailInfo.cc[d];
    if (d < dSize - 1) {
      cc += ",";
    }
  }

  console.log("mailer.js - setMailOptions(mailInfo)");

  const mailOptions = {
    from: '"' + mailInfo.displayName + '"' + '<' + config.mailServiceCredentials.email + '>',
    bcc: cc,
    subject: mailInfo.subject,
    text: mailInfo.content,
    html: mailInfo.htmlContent
  };

  console.log('mailOptions', mailOptions.from)

  return mailOptions;
};

exports.sendVerificationEmail = (req, res, next) => {
  console.log('sendVerificationEmail')
  const { token, email } = req.app.locals

  if (!email) {
    return db.any("select email from users natural inner join tokens where token_str = $1", [token]).then(data => {
      email = data.email;
    });
  }

  console.log('req', req.post)
  let protocol = 'http';
  if (!req.hostname.includes('localhost'))
    protocol += 's';
  const link = `${protocol}://${req.host}/api/auth/confirmEmail/${email}/${token}`;
  const html = attachLink("confirm-email/confirm-email1.html", "confirm-email/confirm-email2.html", link);
  const mailInfo = preparations.prepareVerification(req, html);
  const transporter = setTransporter();
  const mailOptions = setMailOptions(mailInfo);

  //rror [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
  return transporter.sendMail(mailOptions).then(() => {
    console.log('send email to ' + email)
    res.end();
  }).catch(error => {
    console.log('error', error)
    next(error);
  });
};

// exports.sendResetPasswordEmail = (req, res, next) => {
//   const email = req.body.email;
//   const link = "https://" + req.hostname + "/api/auth/";
//   return db.task(t => {
//     return t.any("select * from users where email = $1", [email]).then(data => {
//       link += data[0].user_id + "/reset_password/";
//       return t.any("Insert into reset_password (user_id, request_date) VALUES($1, NOW()) Returning reset_id as rid", [data[0].user_id]);
//     });
//   }).then(data => {
//     link += data[0].rid;
//     const html = attachLink("reset-password/reset-password1.html", "reset-password/reset-password2.html", link);
//     const mailInfo = preparations.prepareResetEmail(req, html);
//     const transporter = setTransporter();
//     const mailOptions = setMailOptions(mailInfo);
//     return transporter.sendMail(mailOptions).then(data => {
//       res.status(200).json({
//         data: data,
//         status: "Success",
//         message: 'Password Reset Email sent'
//       });
//       res.end();
//     }).catch(error => {
//       next(error);
//     });
//   }).catch(error => {
//     next(error);
//   });
// };

exports.sendRegisterInvitationEmail = (req, res, next) => {
  const request_data = req.app.locals.permission_data;
  const email = req.app.locals.email;
  const type = req.app.locals.permission_type;

  const link = "https://" + req.hostname + "/authenticate";
  const html = attachLink("register-invitation/register-invitation1.html",
    "register-invitation/register-invitation2.html", type) +
    link + readFile(views_dir, "register-invitation/register-invitation3.html");
  const mailInfo = preparations.prepareInvitationEmail(email, html);
  const transporter = setTransporter();
  const mailOptions = setMailOptions(mailInfo);
  return transporter.sendMail(mailOptions).then(() => {
    res.status(200).json({
      message: "Invitation email sent and permission added",
      status: "success",
      data: request_data
    });
    // res.end();
  }).catch(error => {
    console.error("Something failed", error);
    res.end();
  });
};
