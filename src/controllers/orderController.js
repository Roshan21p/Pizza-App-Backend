const {
  getAllOrdersCreateByUser,
  getOrderDetailsById,
  updateOrder,
  getOrders
} = require('../services/orderService');
const AppError = require('../utils/appError');

async function getAllOrdersByUser(req, res) {
  try {
    const order = await getAllOrdersCreateByUser(req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Successfully fetched the orders',
      error: {},
      data: order
    });
  } catch (error) {
    console.log(error);
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

async function getOrder(req, res) {
  try {
    const order = await getOrderDetailsById(req.params.orderId);
    return res.status(200).json({
      success: true,
      message: 'Successfully fetched the order',
      error: {},
      data: order
    });
  } catch (error) {
    console.log(error);
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

async function getAllOrders(req, res) {
  try {
    const order = await getOrders();
    return res.status(200).json({
      success: true,
      message: 'Successfully fetched all the orders',
      error: {},
      data: order
    });
  } catch (error) {
    console.log(error);
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

async function cancelOrder(req, res) {
  try {
    const order = await updateOrder(req.params.orderId, 'CANCELLED');
    return res.status(200).json({
      success: true,
      message: 'Successfully updated the order',
      error: {},
      data: order
    });
  } catch (error) {
    console.log(error);
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

async function changeOrderStatus(req, res) {
  try {
    const order = await updateOrder(req.params.orderId, req.body.status);
    return res.status(200).json({
      success: true,
      message: 'Successfully updated the order status',
      error: {},
      data: order
    });
  } catch (error) {
    console.log(error);
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

module.exports = {
  getAllOrdersByUser,
  getOrder,
  getAllOrders,
  cancelOrder,
  changeOrderStatus
};
