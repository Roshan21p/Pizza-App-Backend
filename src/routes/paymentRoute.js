const express = require('express');
const {
  createCheckoutSession,
  verifyPayment,
  allPayments
} = require('../controllers/paymentController');
const { isLoggedIn, isAdmin } = require('../validation/authValidator');

const paymentRouter = express.Router();

paymentRouter.post('/create-checkout', isLoggedIn, createCheckoutSession);
paymentRouter.post('/verify-payment', verifyPayment);
paymentRouter.get('/all-payments', isLoggedIn, isAdmin, allPayments);

module.exports = paymentRouter;
