const express = require('express');
const { getCartByUser, addProductToCart } = require('../controllers/cartController.js');
const { isLoggedIn } = require('../validation/authValidator.js');

const cartRouter = express.Router();

cartRouter.get('/', isLoggedIn, getCartByUser);
cartRouter.post('/add/:productId', isLoggedIn, addProductToCart);

module.exports = cartRouter;