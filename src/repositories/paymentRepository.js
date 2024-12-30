const Payment = require('../schema/paymentSchema');
const InternalServerError = require('../utils/internalServerError');

async function storePaymentDetails(paymentDetails) {
  try {
    const payment = await Payment.create(paymentDetails);
    return payment;
  } catch (error) {
    throw new InternalServerError();
  }
}

module.exports = storePaymentDetails;
