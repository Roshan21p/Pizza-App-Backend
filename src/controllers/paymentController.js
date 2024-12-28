const handleCheckoutSession = require("../services/paymentService");
const AppError = require("../utils/appError");

async function createCheckoutSession(req, res){
    try {
        const response = await handleCheckoutSession(req);
        return res.status(200).json({
            success: true,
            message: 'Successfully created the session id',
            sessionId: response.session.id,
            totalAmount: response.totalAmount,
            error: {},
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

module.exports = createCheckoutSession