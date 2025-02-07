const { STRIPE_SECRET_KEY, FRONTEND_URL } = require('../config/serverConfig');
const stripe = require('stripe')(STRIPE_SECRET_KEY);
const { getCartByUserId } = require('../repositories/cartRepository');
const storePaymentDetails = require('../repositories/paymentRepository');
const BadRequestError = require('../utils/badRequestError');
const InternalServerError = require('../utils/internalServerError');
const NotFoundError = require('../utils/notFoundError');
const { sendOrderConfirmationEmail } = require('../utils/sendMail');
const { createOrder } = require('./orderService');

async function handleCheckoutSession(req) {
  const userId = req.user.id;
  const { paymentMethod, address } = req.body;

  if (
    !address ||
    !address.flat ||
    !address.area ||
    !address.landmark ||
    !address.pincode ||
    !address.city ||
    !address.state
  ) {
    throw new BadRequestError(
      'Invalid address. Please provide a complete address.'
    );
  }
  const cart = await getCartByUserId(userId);

  if (!cart) {
    throw new NotFoundError('Not able to find Cart');
  }

  if (cart.items.length === 0) {
    throw new BadRequestError([
      'Cart is empty, please add some items to the cart'
    ]);
  }

  // Convert cart items to Stripe's line_items format
  const lineItems = cart.items.map((item) => ({
    price_data: {
      currency: 'inr',
      product_data: {
        name: item?.product?.productName
      },
      unit_amount: Math.round(item.product.price * 100)
    },
    quantity: item.quantity
  }));

  // Calculate total amount
  const totalAmount = cart.items.reduce(
    (total, item) => total + item.quantity * item.product.price,
    0
  );

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: lineItems,
    success_url: `${FRONTEND_URL}/payment-verification?session_id={CHECKOUT_SESSION_ID}`,
    customer_email: req.user.email,
    metadata: {
      userId: userId,
      address: JSON.stringify(address),
      lineItems: JSON.stringify(lineItems)
    }
  });

  return { session, totalAmount };
}

async function handlePaymentConfirmation({ session_id }) {

  if (!session_id) {
    throw new BadRequestError('Session ID is required');
  }

  // Step 1: Retrieve the Stripe session
  const session = await stripe.checkout.sessions.retrieve(session_id);


  // Step 2: Verify payment status
  if (session.payment_status !== 'paid') {
    throw new BadRequestError('Payment not verified');
  }

  // Step 3: Create the order
  const userId = session.metadata.userId;
  const address = JSON.parse(session.metadata.address);
  const lineItems = JSON.parse(session.metadata.lineItems);
  console.log('lineItems', lineItems);

  const order = await createOrder(userId, 'CARD', address);

  //  Step 4: Store payment details
  const paymentDetails = {
    orderId: order._id,
    paymentIntentId: session.payment_intent,
    paymentMethod: session.payment_method_types[0],
    paymentStatus: session.payment_status,
    paymentAmount: session.amount_total / 100, // convert paise to INR
    currency: session.currency
  };

  const payment = await storePaymentDetails(paymentDetails);

  if (!payment) {
    throw new InternalServerError();
  }

  await sendOrderConfirmationEmail({
    customerEmail: session.customer_email,
    lineItems,
    address,
    orderId: order._id,
    paymentAmount: paymentDetails.paymentAmount,
    currency: paymentDetails.currency
  });

  return {
    orderId: order._id,
    totalPrice: order.totalPrice,
    items: lineItems,
    address: order.address
  };
}

async function fetchAllPayments(req) {
  try {
    const {startDate, endDate} = req.query;    
    
    // Initialize an array with all months in order
    let monthlyCounts = Array.from({ length: 12 }, (_, index) => ({
      monthInNumber: index,
      count: 0,
      amount: 0
    }));
    let totalAmount = 0;

    // convert input dates to timestamps (seconds in UNIX)
    const startTimeStamp = new Date(startDate).getTime() / 1000;
    const endTimeStamp = new Date(endDate).getTime() / 1000;

    const allPayments = await stripe.paymentIntents.list({
      limit: 100
    });

    allPayments.data.forEach((payment) => {
      const paymentDate = new Date(payment.created * 1000); // Convert UNIX timestamp to Date
      const monthInNumber = paymentDate.getMonth();
      const paymentTimeStamp = payment.created;

      if(paymentTimeStamp >= startTimeStamp && paymentTimeStamp <= endTimeStamp){
        if (payment.status === 'succeeded') {
          totalAmount += payment.amount_received / 100;
  
          monthlyCounts[monthInNumber].count += 1;
          monthlyCounts[monthInNumber].amount += payment.amount_received / 100;
        }
      }
    });
     
    // Convert month numbers to month names (optional)
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    let monthlyPayments = {};
    monthlyCounts.forEach((item) => {
      monthlyPayments[monthNames[item.monthInNumber]] = {
        count: item.count,
        amount: item.amount
      };
    });

    return {
      monthlyPayments,
      totalAmount
    };
  } catch (error) {
    console.log(error);
    throw new InternalServerError();
  }
}

module.exports = {
  handleCheckoutSession,
  handlePaymentConfirmation,
  fetchAllPayments
};
