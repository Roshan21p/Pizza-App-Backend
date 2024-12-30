const { CONTACT_US_EMAIL } = require("../config/serverConfig");
const { Contact_Us_Template } = require("../utils/contactUsTemplate");
const { generateContactUsEmail } = require("../utils/sendMail");

async function getContactInfo(contactDetails){
    const { name, email, message } = contactDetails;

      // Checking if values are valid
  if (!name || !email || !message) {
    throw new BadRequestError('Name, Email, Message are required');
  }

  try {
    // Generate the email content using the Contact Us Template
    const emailContent = Contact_Us_Template(name, email, message);

    // Send the email using the generated content
    await generateContactUsEmail(CONTACT_US_EMAIL, emailContent);
  } catch (error) {
    throw new InternalServerError();
  }
}

module.exports = getContactInfo;