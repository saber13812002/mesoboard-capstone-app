require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

class Messenger {
  constructor() {

    this.to = process.env.MY_PHONE_NUMBER
    this.from = '+12513130514',
      this.body = 'SMS from Node.js.'

    this.msgObj = {
      to: this.to,
      from: this.from,
      body: this.body
    }
  }

  createMessage() {
    client.messages.create(this.msgObj)
    // .then(msg => console.log({
    //   to: msg.to,
    //   from: msg.from,
    //   body: msg.body
    // }))
    // .catch(err => console.log(error))
  }
}

module.exports = Messenger;