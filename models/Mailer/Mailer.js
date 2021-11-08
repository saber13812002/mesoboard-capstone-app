var nodemailer = require('nodemailer');
var config = require('../../config/config.js');


class Mailer {
  constructor(mailInfo) {
    this.transporter = this.setTransporter();
    this.mailOptions = this.setMailOptions(mailInfo);
  }

  setMailOptions(mailInfo) {
    console.log("Mailer.js - setMailOptions(mailInfo)");
    var cc = "";
    var dSize = mailInfo.cc.length;

    //converts array to string of recipients
    for (var d = 0; d < dSize; d++) {
      cc += mailInfo.cc[d];
      if (d < dSize - 1) {
        cc += ",";
      }
    }

    var mailOptions = {
      from: '"' + mailInfo.displayName + '"' + '<' + config.mailServiceCredentials.email + '>',
      bcc: cc,
      subject: mailInfo.subject,
      text: mailInfo.content,
      html: mailInfo.htmlContent
    };

    return mailOptions;
  };

  setTransporter() {
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

  sendMail() {
    return this.transporter.sendMail(this.mailOptions);
  }
}

module.exports = Mailer;