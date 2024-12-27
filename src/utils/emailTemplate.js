const Reset_Password_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background: linear-gradient(to right, #FFFAF0, #FDBA74); /* Amber to Orange Gradient */
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 20px auto;
              background: linear-gradient(to right, #FFFAF0, #FDBA74); /* Amber to Orange Gradient */
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #FF7E00;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 24px;
              font-weight: bold;
          }
          .content {
              padding: 20px;
              line-height: 1.6;
          }
          .button-container {
              text-align: center; /* Center the button */
              margin: 20px 0;
          }
          .reset-button {
              display: inline-block;
              text-decoration: none;
              font-size: 1.125rem; /* text-lg */
              color: white; /* text-white */
              background-color: #F59E0B; /* bg-yellow-500 */
              border: 0; /* border-0 */
              border-radius: 5px; /* rounded */
              padding: 12px 25px;
              transition: background-color 0.3s;
              outline: none; /* focus:outline-none */
          }
          .reset-button:hover {
              background-color: #D97706; /* hover:bg-yellow-600 */
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 10px;
          }
          a {
              color: #FF7E00;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Reset Your Password</div>
          <div class="content">
              <p>Dear {name},</p>
              <p>We received a request to reset your password. You can reset your password by clicking the button below:</p>
              <div class="button-container">
                  <a href="{resetPasswordUrl}" class="reset-button" target="_blank">Reset Your Password</a>
              </div>
              <p>If the above button does not work, you can copy and paste the following link into your browser:</p>
              <p><a href="{resetPasswordUrl}" target="_blank">{resetPasswordUrl}</a></p>
              <p><strong>Note:</strong> This link is valid for 10 minutes. After that, you'll need to request a new password reset.</p>
              <p>If you did not request this password reset, please ignore this email. Your account remains secure.</p>
              <p>If you have any questions, feel free to contact our support team.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Pizzify. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

const Password_Change_Success_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Changed Successfully</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background: linear-gradient(to right, #FFFAF0, #FDBA74); /* Amber to Orange Gradient */
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 20px auto;
              background: linear-gradient(to right, #FFFAF0, #FDBA74); /* Amber to Orange Gradient */
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #FF7E00;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 24px;
              font-weight: bold;
          }
          .content {
              padding: 20px;
              line-height: 1.6;
          }
          .button-container {
              text-align: center;
              margin: 20px 0;
          }
          .home-button {
              display: inline-block;
              text-decoration: none;
              font-size: 1.125rem; /* text-lg */
              color: white; /* text-white */
              background-color: #F59E0B; /* bg-yellow-500 */
              border: 0; /* border-0 */
              border-radius: 5px; /* rounded */
              padding: 12px 25px;
              transition: background-color 0.3s;
              outline: none; /* focus:outline-none */
          }
          .home-button:hover {
              background-color: #D97706; /* hover:bg-yellow-600 */
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 10px;
          }
          a {
              color: #FF7E00;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Password Changed Successfully</div>
          <div class="content">
              <p>Dear {name},</p>
              <p>Your password has been changed successfully. If this change was made by you, no further action is required.</p>
              <p>If you did not request this change, please contact our support team immediately as your account may be compromised.</p>
              <div class="button-container">
                  <a href="{homepageUrl}" class="home-button" target="_blank">Go to Homepage</a>
              </div>
              <p>If you have any questions or need assistance, feel free to contact our support team.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Pizzify. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

module.exports = {
  Reset_Password_Template,
  Password_Change_Success_Template
};
