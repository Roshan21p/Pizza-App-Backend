const User = require('../schema/userSchema');
const InternalServerError = require('../utils/internalServerError');

async function validateToken(forgotPasswordToken) {
  try {
    const response = await User.findOne({
      forgotPasswordToken,
      forgotPasswordExpiry: { $gt: Date.now() }
    });
    return response;
  } catch (error) {
    throw new InternalServerError();
  }
}

module.exports = validateToken;
