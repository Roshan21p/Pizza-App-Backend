const {
  registerUser,
  updateUserProfile,
  fetchUserProfile
} = require('../services/userService');
const AppError = require('../utils/appError');

async function createUser(req, res) {
  try {
    const response = await registerUser(req.body);
    return res.status(201).json({
      message: 'Successfully registered the user',
      success: true,
      data: response,
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

async function updateProfile(req, res) {
  try {
    const response = await updateUserProfile(req.body, req.user.id, req.file);
    return res.status(200).json({
      success: true,
      message: 'Profile details updated Successfully',
      data: response,
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

async function getProfile(req, res) {
  try {
    const response = await fetchUserProfile(req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Profile details fetched Successfully',
      data: response,
      error: {}
    });
  } catch (error) {
    console.log('con', error);

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
  createUser,
  updateProfile,
  getProfile
};
