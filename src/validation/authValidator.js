const jwt = require('jsonwebtoken');
const { JWT_SECRET, COOKIE_SECURE, FRONTEND_URL } = require('../config/serverConfig');
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
        console.log("Decoded", decoded, decoded.exp, ( Date.now() / 1000));
        

        if(!decoded){
            throw new UnAuthorisedError();
        }

        //if reached here, then user is authenticated allow then to access the api
            req.user = {
                email: decoded.email,
                id: decoded.id,
                role: decoded.role,
            }
    
            next();
        } catch (error) {
            console.log(error.name);
            if(error.name === "TokenExpiredError"){
                res.cookie("authToken", "", {
                    httpOnly: true,
                    secure: COOKIE_SECURE,
                    sameSite: "lax",
                    domain: FRONTEND_URL,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                return res.status(200).json({
                    success: true,
                    message: "Log out Successfull",
                    error: {},
                    data: {},
                })
            }
            
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
