<<<<<<< HEAD
=======
const { findUser } = require("../repositories/userRepository");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require("../config/serverConfig");

async function loginUser(authDetails){
    const email = authDetails.email;
    const plainPassword = authDetails.password;

    //1. Check if there is a registered user with the given email
    const user = await findUser({ email });

    if(!user){
        throw {message: "No user found with the given email", statusCode: 404};
    }

    //2. If the user is found we need to compare plainIncomingPassword witrh hashedPassword
    const isPasswordValidated = await bcrypt.compare(plainPassword, user.password);

    if(!isPasswordValidated){
        throw {message: "Invalid Password, please try again", statusCode: 401};
    }

    const userRole = user.role? user.role : "USER";

    //3. If the password is validated, create a token and return it
    const token = jwt.sign({email: user.email, id: user._id, role: userRole }, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
    });

    return {token, userRole, userData: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
    }};
}

module.exports = {
    loginUser,
}
>>>>>>> c7aa9e8 (Modified backend)
