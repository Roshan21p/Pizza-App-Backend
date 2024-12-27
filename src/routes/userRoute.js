const express = require('express');
const {
  createUser,
  updateProfile,
  getProfile
} = require('../controllers/userController');
const { isLoggedIn } = require('../validation/authValidator');
const uploader = require('../middleware/multerMiddleware');

// We have to initialise a router object to add routes in a new file
// Routers are used for segregating your routes in different modules
const userRouter = express.Router();

userRouter.post('/', createUser); // this is a route registration
userRouter.put('/me', isLoggedIn, uploader.single('avatar'), updateProfile);
userRouter.get('/getProfile', isLoggedIn, getProfile);

module.exports = userRouter; // exporting the router
