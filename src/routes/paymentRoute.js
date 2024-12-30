const express = require('express');
const {
  createCheckoutSession,
  verifyPayment
} = require('../controllers/paymentController');
const { isLoggedIn } = require('../validation/authValidator');

const paymentRouter = express.Router();

paymentRouter.post('/create-checkout', isLoggedIn, createCheckoutSession);
paymentRouter.post('/verify-payment', isLoggedIn, verifyPayment);

module.exports = paymentRouter;
