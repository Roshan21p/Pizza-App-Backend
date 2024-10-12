const express = require('express');
const { getCartByUser } = require('../controllers/cartController.js');

const cartRouter = express.Router();

cartRouter.get('/', getCartByUser);

module.exports = cartRouter;