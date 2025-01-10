const mongoose = require('mongoose');
const moment = require('moment');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        }
      }
    ],

    totalPrice: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      default: 'ORDERED',
      enum: [
        'ORDERED',
        'CANCELLED',
        'DELIVERED',
        'PROCESSING',
        'OUT_FOR_DELIVERY'
      ]
    },

    address: {
      type: Object,
      required: true
    },

    payment: {
      type: String,
      enum: ['CARD', 'CASH'],
      default: 'CASH'
    },
    // Custom field for storing Indian format date
    createdAtFormatted: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to format and store the date in createdAtFormatted
orderSchema.pre('save', function (next) {
  this.createdAtFormatted = moment(this.createdAt).format('DD-MM-YYYY HH:mm:ss');
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
