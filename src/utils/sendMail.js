const { transporter } = require('../config/mailConfig');
const { SMTP_FROM_EMAIL, FRONTEND_URL } = require('../config/serverConfig');
const {
  Reset_Password_Template,
  Password_Change_Success_Template
} = require('./emailTemplate');
const Order_Confirmation_Template = require('./orderConfirmationTemplate');

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
}

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
}

async function generateContactUsEmail(recipientEmail, emailContent) {
  try {
    // Send the email with the provided content
    await transporter.sendMail({
      from: SMTP_FROM_EMAIL,
      to: recipientEmail,
      subject: 'Contact Us Form',
      html: emailContent
    });
  } catch (error) {
    console.log(error);
    throw new Error('Failed to send email');
  }
}

// async function sendOrderConfirmationEmail({ customerEmail, lineItems, address, orderId, paymentAmount, currency }) {
//   try {
//     // Generate the email content using the dynamic template
//     const emailContent = Order_Confirmation_Template(
//       customerEmail.split('@')[0], // Use the part before @ as the name (optional)
//       orderId,
//       lineItems.map(item => ({
//         price_data: {
//           product_data: { name: item.name },
//           unit_amount: item.price, // Ensure this is in cents
//           currency: currency.toLowerCase(),
//         },
//         quantity: item.quantity,
//       })),
//       paymentAmount.toFixed(2), // Total payment
//       currency.toUpperCase(),
//       {
//         flat: address.flat,
//         area: address.area,
//         landmark: address.landmark,
//         pincode: address.pincode,
//         city: address.city,
//         state: address.state,
//       }
//     );

//     // Send the email
//     await transporter.sendMail({
//       from: process.env.SMTP_FROM_EMAIL,
//       to: customerEmail,
//       subject: 'Order Confirmation - Your Order with Pizzify',
//       html: emailContent,
//     });

//     console.log('Order confirmation email sent successfully!');
//   } catch (error) {
//     console.error('Error sending order confirmation email:', error.message);
//     throw new Error('Failed to send email');
//   }
// }

async function sendOrderConfirmationEmail({
  customerEmail,
  lineItems,
  address,
  orderId,
  paymentAmount,
  currency
}) {
  console.log( customerEmail,
  lineItems,
  address,
  orderId,
  paymentAmount,
  currency);
  
    // Generate the email content using the dynamic template
    const emailContent = Order_Confirmation_Template.replace(
      '{name}',
      customerEmail.split('@')[0]
    ) // Use the part before @ as the name (optional)
      .replace('{orderId}', orderId)
      .replace(
        '{lineItems}',
        lineItems
          .map(
            (item) => `
            <tr>
                <td>${item.price_data.product_data.name}</td> 
                <td>${item.quantity}</td>
                <td>${(item.price_data.unit_amount / 100).toFixed(2)} ${currency.toUpperCase()}</td>
            </tr>
          `
          )
          .join('')
      )
      .replace('{orderTotal}', paymentAmount.toFixed(2)) // Ensure total is in proper format
      .replace('{currency}', currency.toUpperCase())
      .replace(
        '{address}',
        `${address.flat}, ${address.area}, ${address.landmark}, ${address.pincode}, ${address.city}, ${address.state}`
      );

    // Send the email
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: customerEmail,
      subject: 'Order Confirmation - Your Order with Pizzify',
      html: emailContent
    });

    console.log('Order confirmation email sent successfully!');
 
}

module.exports = {
  sendResetPasswordUrl,
  sendPasswordChangeNotification,
  generateContactUsEmail,
  sendOrderConfirmationEmail
};
