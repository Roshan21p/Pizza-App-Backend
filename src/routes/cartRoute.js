const express = require('express');
const {
  getCartByUser,
  modifyProductToCart,
  clearCartById
} = require('../controllers/cartController.js');
const { isLoggedIn } = require('../validation/authValidator.js');

const cartRouter = express.Router();

cartRouter.get('/', isLoggedIn, getCartByUser);
cartRouter.post('/:operation/:productId', isLoggedIn, modifyProductToCart);
cartRouter.delete('/item/:itemId', isLoggedIn, clearCartById);

module.exports = cartRouter;
