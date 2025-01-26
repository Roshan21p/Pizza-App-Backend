const express = require('express');
const {
  getAllOrdersByUser,
  getOrder,
  cancelOrder,
  changeOrderStatus,
  getAllOrders
} = require('../controllers/orderController.js');
const { isLoggedIn, isAdmin } = require('../validation/authValidator.js');

const orderRouter = express.Router();

orderRouter.get('/', isLoggedIn, isAdmin, getAllOrders);
orderRouter.get('/me', isLoggedIn, getAllOrdersByUser);
orderRouter.get('/:orderId', isLoggedIn, getOrder);
orderRouter.put('/:orderId/cancel', isLoggedIn, cancelOrder);
orderRouter.put('/:orderId/status', isLoggedIn, isAdmin, changeOrderStatus);

module.exports = orderRouter;
