const express = require('express');
const createCheckoutSession = require('../controllers/paymentController');
const { isLoggedIn } = require('../validation/authValidator');

const paymentRouter = express.Router();

paymentRouter.post('/create-checkout',isLoggedIn, createCheckoutSession);

module.exports = paymentRouter;