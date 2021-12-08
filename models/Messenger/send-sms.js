require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages.create({
  to: process.env.MY_PHONE_NUMBER,
  from: '+12513130514',
  body: 'SMS from Node.js.'
})
  .then(msg => console.log({
    to: msg.to,
    from: msg.from,
    body: msg.body
  }))
  .catch(err => console.log(error))