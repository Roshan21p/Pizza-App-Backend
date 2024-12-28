const { STRIPE_SECRET_KEY, FRONTEND_URL } = require("../config/serverConfig");
const stripe  = require("stripe")(STRIPE_SECRET_KEY);
const { getCartByUserId } = require("../repositories/cartRepository");
const BadRequestError = require("../utils/badRequestError");
const NotFoundError = require("../utils/notFoundError");

async function handleCheckoutSession(req){

    const userId = req.user.id;
    const {paymentMethod, address} = req.body
    console.log("address", address);
    

    if(!address || !address.flat || !address.area || !address.landmark || !address.pincode || !address.city || !address.state){
        throw new BadRequestError("Invalid address. Please provide a complete address.")
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
            name: item.product.productName,
        },
        unit_amount: Math.round(item.product.price * 100),
    },
    quantity: item.quantity,
  }));

  // Calculate total amount
  const totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.product.price, 0);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: lineItems,
    success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    customer_email: req.user.email,
    metadata: {
       userId: userId,
       address: JSON.stringify(address),    }
  });

  console.log("session", session);

  return { session, totalAmount};
  

}

module.exports = handleCheckoutSession;