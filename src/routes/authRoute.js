const express = require('express');
const {
  login,
  logout,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

// We have to initialise a router object to add routes in a new file
// Routers are used for segregating your routes in different modules
const authRouter = express.Router();

authRouter.post('/login', login); // this is a route registration
authRouter.post('/logout', logout);
authRouter.post('/forgot-Password', forgotPassword);
authRouter.post('/reset-password/:resetToken', resetPassword);
module.exports = authRouter; // exporting the router
