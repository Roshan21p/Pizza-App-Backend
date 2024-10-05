const mongoose = require('mongoose');

const userSchema = new mongoose({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
        minLength: [5,"First name must be atleast 5 characters long"],
        lowercase: true,
        trim: true,
        maxLength: [20,"First name should be less than or equal to 20 characters"]
    },

    lasttName: {
        type: String,
        required: [true, "First Name is required"],
        minLength: [5,"First name must be atleast 5 characters long"],
        lowercase: true,
        trim: true,
        maxLength: [20,"First name should be less than or equal to 20 characters"]
    },

    mobileNumber: {
        type: String,
        trim: true,
        maxLength: [10,"Phone should be of length 10"],
        minLength: [10,"Phone should be of length 10"],
        unique: [true, "Phone number is already use"],
        required: [true, "Phone should be provided"],
    },

    email: {
        type: String,
        trim: true,
        required: [true, "Email should be provided"],
        unique: [true, "Email is already in use"],
        match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },

    password: {
        type: String,
        required: [true,"Password should br provided"],
        minLength: [6, "Password should be minimum 6 character long"],
    },
}, {
    timestamps: true,
});



const User = mongoose.model("User",userSchema);  // collection

module.exports = User;