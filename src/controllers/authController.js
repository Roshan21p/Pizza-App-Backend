const { COOKIE_SECURE } = require('../config/serverConfig');
const {
  loginUser,
  processForgotPassword,
  setPasswordByToken
} = require('../services/authService');
const AppError = require('../utils/appError');

async function login(req, res) {
  try {
    const loginPayload = req.body;

    // auth service
    const response = await loginUser(loginPayload);

    res.cookie('authToken', response.token, {
      httpOnly: true,
      secure: COOKIE_SECURE, // Set to true if using HTTPS
      sameSite: 'None',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // Adjust expiry as needed
      // domain: FRONTEND_URL,
    });

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        userRole: response.userRole,
        userData: response.userData
      },
      error: {}
    });
  } catch (error) {
    return res.status(error.statusCode).json({
      success: false,
      data: {},
      message: error.message,
      error: error
    });
  }
}

async function logout(req, res) {
  console.log('Cookie from frontend', req.cookies);

  res.cookie('authToken', '', {
    httpOnly: true,
    secure: COOKIE_SECURE, // Set to true if using HTTPS
    sameSite: 'None',
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // Adjust expiry as needed
  });
  return res.status(200).json({
    success: true,
    message: 'Log out Successfully',
    error: {},
    data: {}
  });
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    await processForgotPassword(email);
    return res.status(200).json({
      success: true,
      message: `Reset password token has been sent to ${email} successfully`,
      error: {}
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        data: {},
        error: error
      });
    }
    return res.status(500).json({
      success: false,
      message: error.reason,
      data: {},
      error: error
    });
  }
}

async function resetPassword(req, res) {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;
    await setPasswordByToken(resetToken, password);

    return res.status(200).json({
      success: true,
      message: `Password changed successfully`
    });
  } catch (error) {
    console.log('contr', error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        data: {},
        error: error
      });
    }
    return res.status(500).json({
      success: false,
      message: error.reason,
      data: {},
      error: error
    });
  }
}

module.exports = {
  login,
  logout,
  forgotPassword,
  resetPassword
};
