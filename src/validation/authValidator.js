const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/serverConfig');
const UnAuthorisedError = require('../utils/unauthorisedError');


async function isLoggedIn(req, res, next) {
    const token = req.cookies["authToken"];
    if(!token){
        return res.status(401).json({
            success: false,
            data: {},
            error: "Not authenticated",
            message: "No auth Token provided"
        })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if(!decoded){
            throw new UnAuthorisedError();
        }

       // if(decoded.role === "ADMIN") throw new UnAuthorisedError();
        //if reached here, then user is authenticated allow then to access the api
            req.user = {
                email: decoded.email,
                id: decoded.id,
                role: decoded.role,
            }
    
            next();
        } catch (error) {
        return res.status(401).json({
            success: false,
            data: {},
            error: error,
            message: "Invalid Token provided"
        });
    }
}

/*
* This fuction checks if the authenticated user is an admin or not
* Because we will call isAdmin after isloggedIn thats why we will receive user details
*/
function isAdmin(req, res, next){
    const loggedInUser = req.user;
    console.log(loggedInUser);
    
    if(loggedInUser.role === "ADMIN"){
        next();
    } else {
        return res.status(401).json({
            success: false,
            data: {},
            message: "You are not authorised for this action",
            error: {
                statusCode: 401,
                reason: "Unauthorised user for this action"
    
            },
        })
    }
}
module.exports = {
    isLoggedIn,
    isAdmin,
}
