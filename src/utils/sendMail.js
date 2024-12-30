const { transporter } = require('../config/mailConfig');
const { SMTP_FROM_EMAIL, FRONTEND_URL } = require('../config/serverConfig');
const {
  Reset_Password_Template,
  Password_Change_Success_Template
} = require('./emailTemplate');

const sendResetPasswordUrl = async function (email, resetPasswordUrl, name) {
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
    throw new Error('Failed to send email'); // Rethrow or handle as needed
  }
};

const sendPasswordChangeNotification = async function (email, name) {
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
    throw new Error('Failed to send email'); // Rethrow or handle as needed
  }
};

module.exports = {
  sendResetPasswordUrl,
  sendPasswordChangeNotification
};
