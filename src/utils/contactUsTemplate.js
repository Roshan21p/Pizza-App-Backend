const Contact_Us_Template = (name, email, message) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Us Submission</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background: linear-gradient(to right, #FFFBEB, #FDBA74); /* Amber 50 to Orange 300 */
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: linear-gradient(to right, #FFFAF0, #FDBA74); /* Amber to Orange Gradient */
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #FF7E00; /* Orange */
        color: white;
        padding: 10px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
      }
      .content {
        padding: 20px;
        line-height: 1.6;
        background-color: linear-gradient(to right, #FFFAF0, #FDBA74); /* Amber to Orange Gradient */
      }
      .footer {
        background-color: #f4f4f4;
        text-align: center;
        padding: 10px;
        color: #777;
        font-size: 12px;
        margin-top: 20px;
      }
      .footer a {
        color: #FF7E00;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        New Contact Us Message
      </div>
      <div class="content">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Pizzify. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;

module.exports = { Contact_Us_Template };
