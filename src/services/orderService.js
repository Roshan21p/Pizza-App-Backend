const {
  getCartByUserId,
  clearCart
} = require('../repositories/cartRepository');
const {
  createNewOrder,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
  fetchAllOrders
} = require('../repositories/orderRepository');
const { findUser } = require('../repositories/userRepository');
const BadRequestError = require('../utils/badRequestError');
const InternalServerError = require('../utils/internalServerError');
const NotFoundError = require('../utils/notFoundError');

async function createOrder(userId, paymentMethod, newAddress) {
  const cart = await getCartByUserId(userId);

  if (!cart) {
    throw new NotFoundError('Not able to find Cart');
  }

  if (cart.items.length === 0) {
    throw new BadRequestError([
      'Cart is empty, please add some items to the cart'
    ]);
  }

  const user = await findUser({ _id: cart.user });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (!user.address || !compareAddresses(user.address, newAddress)) {
    // If the address is new, update the user's address
    user.address = newAddress;

    await user.save(); // Save the updated user address
  }

  const orderObject = {
    user: cart.user,
    items: cart.items.map((cartItem) => {
      return {
        product: cartItem.product._id,
        quantity: cartItem.quantity
      };
    }),
    status: 'ORDERED',
    totalPrice: cart.items.reduce((total, cartItem) => {
      return total + cartItem.quantity * cartItem.product.price;
    }, 0),
    address: newAddress,
    payment: paymentMethod
  };

  const order = await createNewOrder(orderObject);

  if (!order) {
    throw new InternalServerError();
  }

  await clearCart(userId);

  return order;
}

async function getAllOrdersCreateByUser(userId) {
  const orders = await getOrdersByUserId(userId);
  if (!orders) {
    throw new NotFoundError('Orders not found');
  }
  return orders;
}

async function getOrders() {
  const orders = await fetchAllOrders();

  if (!orders) {
    throw new NotFoundError('Orders not found');
  }
  return orders;
}

async function getOrderDetailsById(orderId) {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new NotFoundError('Order not found');
  }
  return order;
}

async function updateOrder(orderId, status) {
  const order = await updateOrderStatus(orderId, status);
  if (!order) {
    throw new NotFoundError('Order not found');
  }
  return order;
}

function compareAddresses(address1, address2) {
  if (!address1 || !address2) return false;

  return (
    address1.flat === address2.flat &&
    address1.area === address2.area &&
    address1.landmark === address2.landmark &&
    address1.pincode === address2.pincode &&
    address1.city === address2.city &&
    address1.state === address2.state
  );
}

module.exports = {
  createOrder,
  getAllOrdersCreateByUser,
  getOrders,
  getOrderDetailsById,
  updateOrder
};
