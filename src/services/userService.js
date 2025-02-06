const {
  findUser,
  createUser,
  findUserAndUpdate
} = require('../repositories/userRepository');
const { createCart } = require('../repositories/cartRepository');
const BadRequestError = require('../utils/badRequestError');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs/promises');
const path = require('path');
const InternalServerError = require('../utils/internalServerError');
const NotFoundError = require('../utils/notFoundError');

async function registerUser(userDetails) {
  // it will create a brand new user in the db

  // 1.we need to check if the user with this email and mobile number already exists or not
  const user = await findUser({
    email: userDetails.email,
    mobileNumber: userDetails.mobileNumber
  });

  if (user) {
    // we found a user
    throw {
      reason: 'User with the given email and mobile number already exist',
      statusCode: 400
    };
  }

  // 2.If not then Create the user in the database
  const newUser = await createUser({
    email: userDetails.email,
    password: userDetails.password,
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    mobileNumber: userDetails.mobileNumber,
    avatar: {
      public_id: '',
      secure_url: ''
    }
  });

  console.log('name', userDetails.firstName, userDetails.lastName);

  // here we check whether the newUser is undefined or null
  if (!newUser) {
    throw new InternalServerError('Something went wrong, cannot create user');
  }

  await createCart(newUser._id);

  newUser.password = undefined;
  //3.return the details of created user
  return newUser;
}

async function updateUserProfile(userDetails, userId, image) {
  const user = await findUserAndUpdate(userDetails, userId);

  if (!user) {
    throw new BadRequestError('User does not exist or invalid user id');
  }

  let imagePath = image?.path;
  console.log('Image path in service:', image?.path);

  if (imagePath) {
    try {
      if (user?.avatar?.public_id) {
        await cloudinary.uploader.destroy(user?.avatar?.public_id);
      }
      const cloudinaryResponse = await cloudinary.uploader.upload(imagePath, {
        folder: 'pizza/users',
        width: 250,
        height: 250,
        gravity: 'faces',
        crop: 'fill'
      });

      console.log('cloudinaryResponse', cloudinaryResponse);

      if (cloudinaryResponse) {
        user.avatar = user.avatar || {};
        user.avatar.public_id = cloudinaryResponse.public_id;
        user.avatar.secure_url = cloudinaryResponse.secure_url;
      }

      // Remove the file from server
      await fs.unlink(process.cwd() + '/' + imagePath);
    } catch (error) {
      console.log(error);
      // Empty the uploads directory without deleting the uploads directory
      for (const file of await fs.readdir('uploads/')) {
        await fs.unlink(path.join('uploads/', file));
      }
      throw new InternalServerError();
    }
  }

  await user.save();
  user.password = undefined;

  return user;
}

async function fetchUserProfile(userId) {
  const user = await findUser({
    _id: userId
  });

  if (!user) {
    throw new NotFoundError('Not able to find user profile details');
  }

  user.password = undefined;

  return {
    userData: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      mobileNumber: user.mobileNumber,
      avatar: user?.avatar?.secure_url,
      address: user?.address
    }
  };
}
module.exports = {
  registerUser,
  updateUserProfile,
  fetchUserProfile
};
