const nodemailer = require('nodemailer');
const config = require('../../config/config.js');


class Mailer {
  constructor(mailInfo) {
    this.transporter = this.setTransporter();
    this.mailOptions = this.setMailOptions(mailInfo);
  }

  setMailOptions(mailInfo) {
    console.log("Mailer.js - setMailOptions(mailInfo)");
    let cc = "";
    const dSize = mailInfo.cc.length;

    //converts array to string of recipients
    for (let d = 0; d < dSize; d++) {
      cc += mailInfo.cc[d];
      if (d < dSize - 1) {
        cc += ",";
      }
    }

    // mailOptions
    return {
      from: '"' + mailInfo.displayName + '"' + '<' + config.mailServiceCredentials.email + '>',
      bcc: cc,
      subject: mailInfo.subject,
      text: mailInfo.content,
      html: mailInfo.htmlContent
    };
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

  /**
   * 
   * @param {string} msg message of the 200 response
   * @returns 
   */
  sendMail(msg) {
    // return this.transporter.sendMail(this.mailOptions);
    this.transporter.sendMail(this.mailOptions, (error, data) => {
      // console.log('-data', data)
      res.status(200).json({
        data: data,
        status: "Success",
        message: 'Password Reset Email sent'
      });
      res.end();
    });
  }
}

module.exports = Mailer;