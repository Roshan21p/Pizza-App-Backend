const express = require('express');
const { createNewOrder } = require('../controllers/orderController.js');
const { isLoggedIn } = require('../validation/authValidator.js');

const orderRouter = express.Router();

orderRouter.post('/', isLoggedIn, createNewOrder);

module.exports = orderRouter;