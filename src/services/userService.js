const { findUser, createUser } = require("../repositories/userRepository");
const { createCart } = require('../repositories/cartRepository')

async function registerUser(userDetails){
        
        // it will create a brand new user in the db

        // 1.we need to check if the user with this email and mobile number already exists or not
        const user = await findUser({
            email: userDetails.email,
            mobileNumber: userDetails.mobileNumber,
        })

        if(user){
            // we found a user
            throw {reason: 'User with the given email and mobile number already exist', statusCode: 400}
        }

        // 2.If not then Create the user in the database
        const newUser = await createUser({
            email: userDetails.email,
            password: userDetails.password,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            mobileNumber: userDetails.mobileNumber,
            address: userDetails.address,
        })

        // here we check whether the newUser is undefined or null
        if(!newUser){
            throw {reason: 'Something wenr wrong, cannot create user', statusCode: 500};
        }

    
        await createCart(newUser._id);

        //3.return the details of created user
        return newUser;

}

module.exports = {
    registerUser,
}