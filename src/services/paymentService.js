const { STRIPE_SECRET_KEY, FRONTEND_URL } = require('../config/serverConfig');
const stripe = require('stripe')(STRIPE_SECRET_KEY);
const { getCartByUserId } = require('../repositories/cartRepository');
const storePaymentDetails = require('../repositories/paymentRepository');
const BadRequestError = require('../utils/badRequestError');
const InternalServerError = require('../utils/internalServerError');
const NotFoundError = require('../utils/notFoundError');
const { createOrder } = require('./orderService');

async function handleCheckoutSession(req) {
  const userId = req.user.id;
  const { paymentMethod, address } = req.body;
  console.log('address', address);

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
        name: item.product.productName
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
    success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    customer_email: req.user.email,
    metadata: {
      userId: userId,
      address: JSON.stringify(address)
    }
  });

  console.log('session', session);

  return { session, totalAmount };
}

async function handlePaymentConfirmation({sessionId}){
  console.log("Session", sessionId);
  
  if(!sessionId){
    throw new BadRequestError("Session ID is required");
  }

  // Step 1: Retrieve the Stripe session
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  console.log("session", session);
  
   // Step 2: Verify payment status
   if(session.payment_status !== 'paid'){
    throw new BadRequestError("Payment not verified")
   }

   // Step 3: Create the order
   const userId = session.metadata.userId;
   const address = JSON.parse(session.metadata.address);

   const order = await createOrder(userId, 'ONLINE', address);

   //  Step 4: Store payment details
   const paymentDetails = {
      orderId: order._id,
      paymentIntentId: session.payment_intent,
      paymentMethod: session.payment_method_types[0],
      paymentStatus: session.payment_status,
      paymentAmount: session.amount_total / 100,    // convert paise to INR
      currency: session.currency,
   }

   const payment = await storePaymentDetails(paymentDetails);

   if(!payment){
    throw new InternalServerError();
   };

   return order;

}

module.exports = {
  handleCheckoutSession, 
  handlePaymentConfirmation
};
