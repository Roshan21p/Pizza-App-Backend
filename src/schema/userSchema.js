const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First Name is required'],
      minlength: [5, 'First name must be atleast 5 character long'],
      lowercase: true,
      trim: true, // if the user gives extra spaces then it will automatically remove it
      maxlength: [
        20,
        'First name should be less than or equal to 20 characters'
      ]
    },

    lastName: {
      type: String,
      minlength: [5, 'Last name must be atleast 5 character long'],
      lowercase: true,
      trim: true, // if the user gives extra spaces then it will automatically remove it
      maxlength: [20, 'Last name should be less than or equal to 20 characters']
    },

    mobileNumber: {
      type: String,
      trim: true,
      maxlength: [10, 'Phone number should be of length 10'],
      minlength: [10, 'Phone number should be of length 10'],
      unique: [true, 'Phone number is already in use'],
      required: [true, 'Phone number should be provided']
    },

    email: {
      type: String,
      trim: true,
      required: [true, 'Email should be provoided'],
      unique: [true, 'Email is already in use'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address'
      ]
    },

    password: {
      type: String,
      required: [true, 'Password should be provided'],
      minlength: [6, 'Password should be minimum 6 character long']
    },

    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER'
    },

    avatar: {
      public_id: {
        type: String
      },
      secure_url: {
        type: String
      }
    },

    address: 
      {
        flat: {
          type: String,
          trim: true
        },
        area: {
          type: String,
          trim: true
        },
        landmark: {
          type: String,
          trim: true
        },
        pincode: {
          type: String,
          match: [/^\d{6}$/, 'Pincode must be a valid 6-digit number']
        },
        city: {
          type: String,
          trim: true
        },
        state: {
          type: String,
          trim: true
        }
      },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function () {
  //here u can modify your user before it is saved in mongodb
  const hashPassword = await bcrypt.hash(this.password, 10);
  this.password = hashPassword;
});

userSchema.methods = {
  // This will generate a token for password reset
  generatePasswordResetToken: async function () {
    // creating a random token using node's built-in crypto module
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Again using crypto module to hash the generated resetToken with sha256 algorithm and storing it in database
    this.forgotPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Adding forgot password expiry to 10 minutes
    this.forgotPasswordExpiry = Date.now() + 10 * 60 * 1000;

    return resetToken;
  }
};

const User = mongoose.model('User', userSchema); // collection

module.exports = User;
