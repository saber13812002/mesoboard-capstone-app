const nodemailer = require('nodemailer');
const db = require('../config/postgres')();
const config = require('../config/config.js');
const fs = require('fs');
const p = require('path');
const views_dir = p.resolve(__dirname, '..', 'views'); //need to fix this
const preparations = require('../models/Mailer/preparations')
const Mailer = require('../models/Mailer/Mailer');
const utils = require('../lib/utils');


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


exports.sendVerificationEmail = async (req, res, next) => {
  console.log('\nsendVerificationEmail', req.app.locals)
  // const email = req.app.locals.email;
  // const token = req.app.locals.token;
  const { email, token } = req.app.locals;

  console.log('email', email);
  // console.log('token', token);

  if (!email) {
    return db.any("select email from users natural inner join tokens where token_str = $1", token).then(data => {
      email = data.email;
    });
  }

  const link = utils.getUrlByEnvironment(req, `api/auth/confirmEmail/${email}/${token}`);
  console.log('link', link);
  const html = attachLink("confirm-email/confirm-email1.html", "confirm-email/confirm-email2.html", link);
  const mailInfo = preparations.prepareVerification(req, html);
  const mailer = new Mailer(mailInfo);
  mailer.sendMail('Register confirmation email sent');
};


exports.sendResetPasswordEmail = async (req, res, next) => {
  const email = req.body.email;
  console.log('\n\nemail', email);

  let link = utils.getUrlByEnvironment(req, 'api/auth/');

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
    const mailer = new Mailer(mailInfo);
    mailer.sendMail('Password reset email sent');
  }).catch(error => {
    next(error);
  });
};


exports.sendRegisterInvitationEmail = (req, res, next) => {
  const request_data = req.app.locals.permission_data;
  // console.log('sendRegisterInvitationEmail', request_data)
  const email = request_data.email;
  const code = request_data.code;
  const userType = utils.getUserTypeInSpanish(request_data.permission_type);
  const toAdd = ` ${userType}. Su codigo temporero es ${code}`;

  const link = utils.getUrlByEnvironment(req, 'authenticate', 3000);
  const html = attachLink("register-invitation/register-invitation1.html",
    "register-invitation/register-invitation2.html", toAdd) +
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
