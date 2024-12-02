require("dotenv").config();

module.exports = {
  mongoURI: process.env.DB_URL,
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    serviceSid: process.env.TWILIO_SERVICE_SID,
  },
};
