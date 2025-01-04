const crypto = require('crypto');
const { findUser } = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  JWT_SECRET,
  JWT_EXPIRY,
  FRONTEND_URL
} = require('../config/serverConfig');
const BadRequestError = require('../utils/badRequestError');
const User = require('../schema/userSchema');
const {
  sendResetPasswordUrl,
  sendPasswordChangeNotification
} = require('../utils/sendMail');
const InternalServerError = require('../utils/internalServerError');
const validateToken = require('../repositories/authRepository');

async function loginUser(authDetails) {
  const email = authDetails.email;
  const plainPassword = authDetails.password;

  //1. Check if there is a registered user with the given email
  const user = await findUser({ email });

  if (!user) {
    throw { message: 'No user found with the given email', statusCode: 404 };
  }

  //2. If the user is found we need to compare plainIncomingPassword with hashedPassword
  const isPasswordValidated = await bcrypt.compare(
    plainPassword,
    user.password
  );

  if (!isPasswordValidated) {
    throw { message: 'Invalid Password, please try again', statusCode: 401 };
  }

  const userRole = user.role ? user.role : 'USER';

  //3. If the password is validated, create a token and return it
  const token = jwt.sign(
    { email: user.email, id: user._id, role: userRole },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY
    }
  );

  user.password = undefined;

  return {
    token,
    userRole,
    userData: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      mobileNumber: user.mobileNumber,
      avatar: user?.avatar?.secure_url,
      address: user?.address
    }
  };
}

async function processForgotPassword(email) {
  if (!email) {
    throw new BadRequestError('email is required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError('email is not registered');
  }

  // Generating the reset token
  const resetToken = await user.generatePasswordResetToken();

  const resetPasswordUrl = `${FRONTEND_URL}/reset_Password/${resetToken}`;

  try {
    await sendResetPasswordUrl(
      email,
      resetPasswordUrl,
      user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
    );
  } catch (error) {
    console.log(error);

    // If some error happened we need to clear the forgotPassword* fields in our DB
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    throw new InternalServerError();
  }
  await user.save();
}

async function setPasswordByToken(resetToken, newPassword) {
  if (!newPassword) {
    throw new BadRequestError('Password is required');
  }

  // We are again hashing the resetToken using sha256 since we have stored our resetToken in DB using the same algorithm
  const forgotPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log('resetToken for', forgotPasswordToken);

  const user = await validateToken(forgotPasswordToken);

  if (!user) {
    throw new BadRequestError('Token is invalid or expired, please try again');
  }

  user.password = newPassword;

  // making forgotPassword* valus undefined in the DB
  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;

  try {
    await sendPasswordChangeNotification(
      user.email,
      user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
    );

    // Saving the updated user values
    await user.save();
  } catch (error) {
    throw new InternalServerError();
  }
}

module.exports = {
  loginUser,
  processForgotPassword,
  setPasswordByToken
};
