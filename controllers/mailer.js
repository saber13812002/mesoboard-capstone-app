const nodemailer = require('nodemailer');
const db = require('../config/postgres')();
const config = require('../config/config.js');
const fs = require('fs');
const p = require('path');
const views_dir = p.resolve(__dirname, '..', 'views'); //need to fix this
const preparations = require('../models/Mailer/preparations')
const Mailer = require('../models/Mailer/Mailer');
const utils = require('../lib/utils');


// setTransporter = () => {
//   let transporter = nodemailer.createTransport({
//     pool: true,
//     host: config.mailServiceCredentials.host,
//     port: config.mailServiceCredentials.port,
//     secure: config.mailServiceCredentials.ssl,
//     auth: {
//       user: config.mailServiceCredentials.email,
//       pass: config.mailServiceCredentials.password
//     },
//     tls: {
//       rejectUnauthorized: false
//     }
//   });
//   return transporter;
// };


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
  let htmlContent = readFile(views_dir, html1);
  htmlContent += link;
  htmlContent += readFile(views_dir, html2);

  return htmlContent;
};

setMailOptions = (mailInfo) => {
  let cc = "";
  const dSize = mailInfo.cc.length;

  //converts array to string of recipients
  for (let d = 0; d < dSize; d++) {
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

  const link = utils.getUrlByEnvironment(req, `api/auth/confirmEmail/${email}/${token}`);
  console.log('link', link)
  const html = attachLink("confirm-email/confirm-email1.html", "confirm-email/confirm-email2.html", link);
  const mailInfo = preparations.prepareVerification(req, html);
  const mailer = new Mailer(mailInfo);
  mailer.sendMail(mailOptions);
};


exports.sendResetPasswordEmail = (req, res, next) => {
  const email = req.body.email;
  console.log('\n\nemail', email);

  let link = utils.getUrlByEnvironment(req, 'api/auth/');
  // console.log('link', link);

  return db.task(async t => {
    return t.one("select * from users where email = $1", email).then(data => {
      link += data.user_id + "/reset_password/";
      return t.one("Insert into reset_password (user_id, request_date) VALUES($1, NOW()) Returning reset_id as rid", data.user_id);
    });
  }).then(data => {
    link += data.rid;
    console.log('link', link, '\n\n');
    let html = attachLink("reset-password/reset-password1.html", "reset-password/reset-password2.html", link);
    let mailInfo = preparations.prepareResetEmail(req, html);
    // let transporter = setTransporter();
    // let mailOptions = setMailOptions(mailInfo);
    // return transporter.sendMail(mailOptions).then(data => {
    const mailer = new Mailer(mailInfo);

    mailer.sendMail('Password Reset Email sent');
    // return mailer.sendMail(mailOptions).then(data => {
    //   console.log('-data', data)
    //   res.status(200).json({
    //     data: data,
    //     status: "Success",
    //     message: 'Password Reset Email sent'
    //   });
    //   res.end();
    // }).catch(error => {
    //   next(error);
    // });
  }).catch(error => {
    next(error);
  });
};


exports.sendRegisterInvitationEmail = (req, res, next) => {
  const request_data = req.app.locals.permission_data;
  // console.log('sendRegisterInvitationEmail', request_data)
  let type = request_data.permission_type;
  let email = request_data.email;
  if (type === 'employee')
    type = ' Empleado';
  else if (type === 'manager')
    type = ' Supervisor';
  else if (type === 'admin')
    type = ' Administrador';

  let link = utils.getUrlByEnvironment(req, 'authenticate', 3000);
  const html = attachLink("register-invitation/register-invitation1.html",
    "register-invitation/register-invitation2.html", type) +
    link + readFile(views_dir, "register-invitation/register-invitation3.html");

  console.log('link', link);

  // req.app.locals.permission_type = permission_type;
  req.app.locals.email = email;
  // req.app.locals.restaurant_id = restaurant_id;
  // req.app.locals.is_assistant_manager = is_assistant_manager;

  const mailInfo = preparations.prepareVerification(req, html);
  const mailer = new Mailer(mailInfo);
  mailer.sendMail('Invitation email sent and permission added');
  // Added permission credentials of type ${type} with provisional code ${code} to ${email} successfully
};
