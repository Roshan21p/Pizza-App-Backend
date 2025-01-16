const getContactInfo = require('../services/contactService');
const AppError = require('../utils/appError');

async function contactUs(req, res) {
  try {
    await getContactInfo(req.body);
    return res.status(200).json({
      success: true,
      message: 'Your request has been submitted successfully'
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        error: error,
        data: {}
      });
    }

    return res.status(500).json({
      success: false,
      message: error.reason,
      error: error,
      data: {}
    });
  }
}

module.exports = contactUs;
