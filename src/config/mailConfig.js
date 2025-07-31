const nodemailer = require('nodemailer');
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_PASSWORD,
  SMTP_USERNAME
} = require('./serverConfig');

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD
  }
});

transporter.verify((error) => {
  if (error) {
    console.log('SMTP error:', error);
  } else {
    console.log('SMTP connection is working ');
  }
});

module.exports = { transporter };
