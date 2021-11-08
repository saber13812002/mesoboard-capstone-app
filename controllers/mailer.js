var nodemailer = require('nodemailer');
var db = require('../config/postgres')();
var config = require('../config/config.js');
var fs = require('fs');
var p = require('path');
var views_dir = p.resolve(__dirname, '..', 'views'); //need to fix this
var preparations = require('../models/Mailer/preparations')
// var Mailer = require('../models/Mailer/Mailer');

setTransporter = () => {
  console.log('setTransporter', setTransporter)
  var transporter = nodemailer.createTransport({
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
  var content = fs.readFileSync(dir + "/" + file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    }
    return data;
  });
  return content;
};

attachLink = (html1, html2, link) => {
  var htmlContent = readFile(views_dir, html1);
  htmlContent += link;
  htmlContent += readFile(views_dir, html2);

  return htmlContent;
};

setMailOptions = (mailInfo) => {
  var cc = "";
  var dSize = mailInfo.cc.length;

  //converts array to string of recipients
  for (var d = 0; d < dSize; d++) {
    cc += mailInfo.cc[d];
    if (d < dSize - 1) {
      cc += ",";
    }
  }

  console.log("mailer.js - setMailOptions(mailInfo)");

  var mailOptions = {
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
  var token = req.app.locals.token;
  var email = req.app.locals.email;
  if (!email) {
    return db.any("select email from users natural inner join tokens where token_str = $1", [token]).then(data => {
      email = data.email;
    });
  }

  console.log('req', req.post)
  let protocol = 'http';
  if (!req.hostname.includes('localhost'))
    protocol += 's';
  var link = `${protocol}://${req.host}/api/auth/confirmEmail/${email}/${token}`;
  var html = attachLink("confirm-email/confirm-email1.html", "confirm-email/confirm-email2.html", link);
  var mailInfo = preparations.prepareVerification(req, html);
  var transporter = setTransporter();
  var mailOptions = setMailOptions(mailInfo);

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
//   var email = req.body.email;
//   var link = "https://" + req.hostname + "/api/auth/";
//   return db.task(t => {
//     return t.any("select * from users where email = $1", [email]).then(data => {
//       link += data[0].user_id + "/reset_password/";
//       return t.any("Insert into reset_password (user_id, request_date) VALUES($1, NOW()) Returning reset_id as rid", [data[0].user_id]);
//     });
//   }).then(data => {
//     link += data[0].rid;
//     var html = attachLink("reset-password/reset-password1.html", "reset-password/reset-password2.html", link);
//     var mailInfo = preparations.prepareResetEmail(req, html);
//     var transporter = setTransporter();
//     var mailOptions = setMailOptions(mailInfo);
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
  var request_data = req.app.locals.permission_data;
  var email = req.app.locals.email;
  var type = req.app.locals.permission_type;
  var link = "https://" + req.hostname + "/authenticate";
  var html = attachLink("register-invitation/register-invitation1.html",
    "register-invitation/register-invitation2.html", type) +
    link + readFile(views_dir, "register-invitation/register-invitation3.html");
  var mailInfo = preparations.prepareInvitationEmail(email, html);
  var transporter = setTransporter();
  var mailOptions = setMailOptions(mailInfo);
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
