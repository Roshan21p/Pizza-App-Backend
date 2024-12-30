const { transporter } = require('../config/mailConfig');
const { SMTP_FROM_EMAIL, FRONTEND_URL } = require('../config/serverConfig');
const {
  Reset_Password_Template,
  Password_Change_Success_Template
} = require('./emailTemplate');

async function sendResetPasswordUrl(email, resetPasswordUrl, name) {
  try {
    const emailContent = Reset_Password_Template.replaceAll(
      '{resetPasswordUrl}',
      resetPasswordUrl
    ).replace('{name}', name);

    await transporter.sendMail({
      from: SMTP_FROM_EMAIL,
      to: email,
      subject: 'Reset Password',
      html: emailContent
    });
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to send email');
  }
};

async function sendPasswordChangeNotification(email, name) {
  try {
    const emailContent = Password_Change_Success_Template.replace(
      '{name}',
      name
    ).replace('{homepageUrl}', FRONTEND_URL);

    await transporter.sendMail({
      from: SMTP_FROM_EMAIL,
      to: email,
      subject: 'Password Changed Successfully',
      html: emailContent
    });
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to send email');
  }
};

async function generateContactUsEmail(recipientEmail, emailContent) {
  try {
    // Send the email with the provided content
    await transporter.sendMail({
      from: SMTP_FROM_EMAIL,
      to: recipientEmail,
      subject: 'Contact Us Form',
      html: emailContent,
    });
  } catch (error) {
    console.log(error);
    throw new Error('Failed to send email');
  }
};

module.exports = {
  sendResetPasswordUrl,
  sendPasswordChangeNotification,
  generateContactUsEmail
};
