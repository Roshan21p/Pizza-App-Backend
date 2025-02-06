const Order = require('../schema/orderSchema');
const BadRequestError = require('../utils/badRequestError');
const InternalServerError = require('../utils/internalServerError');

async function createNewOrder(orderDetails) {
  try {
    const order = await Order.create(orderDetails);
    return order;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errorMessageList = Object.keys(error.errors).map((property) => {
        return error.errors[property].message;
      });
      throw new BadRequestError(errorMessageList);
    }
    console.log(error);
    throw new InternalServerError();
  }
}

async function getOrdersByUserId(userId) {
  try {
    const orders = await Order.find({
      user: userId
    })
      .populate('items.product')
      .sort({ createdAt: -1 });
    return orders;
  } catch (error) {
    console.log(error);
    throw new InternalServerError();
  }
}

async function getOrderById(orderId) {
  try {
    const order = await Order.findById(orderId).populate('items.product');
    return order;
  } catch (error) {
    console.log(error);
    throw new InternalServerError();
  }
}

async function fetchAllOrders() {
  try {
    const response = await Order.find({}).sort({ createdAt: -1 });
    return response;
  } catch (error) {
    console.log(error);
    throw new InternalServerError();
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );
    return order;
  } catch (error) {
    console.log();
    throw new InternalServerError();
  }
}

module.exports = {
  createNewOrder,
  getOrdersByUserId,
  fetchAllOrders,
  getOrderById,
  updateOrderStatus
};
