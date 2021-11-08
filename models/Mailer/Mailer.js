const nodemailer = require('nodemailer');
const config = require('../../config/config.js');


class Mailer {
  constructor(mailInfo) {
    this.transporter = this.setTransporter();
    this.mailOptions = this.setMailOptions(mailInfo);
  }

  setMailOptions(mailInfo) {
    console.log("Mailer.js - setMailOptions(mailInfo)");
    const cc = "";
    const dSize = mailInfo.cc.length;

    //converts array to string of recipients
    for (let d = 0; d < dSize; d++) {
      cc += mailInfo.cc[d];
      if (d < dSize - 1) {
        cc += ",";
      }
    }

    const mailOptions = {
      from: '"' + mailInfo.displayName + '"' + '<' + config.mailServiceCredentials.email + '>',
      bcc: cc,
      subject: mailInfo.subject,
      text: mailInfo.content,
      html: mailInfo.htmlContent
    };

    return mailOptions;
  };

  setTransporter() {
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

  sendMail() {
    return this.transporter.sendMail(this.mailOptions);
  }
}

module.exports = Mailer;