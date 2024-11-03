const serverConfig = require("../config/serverConfig");
const { COOKIE_SECURE } = require("../config/serverConfig");
const { loginUser } = require("../services/authService");


async function login(req, res){

    try {
        const loginPayload = req.body;

        // auth service
        const response = await loginUser(loginPayload);
        
        res.cookie("authToken", response.token, {
            httpOnly: true,
            secure: serverConfig.COOKIE_SECURE,  // Set to true if using HTTPS
             sameSite: "None",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Adjust expiry as needed
            // domain: FRONTEND_URL,
        })        


        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: {
                userRole: response.userRole,
                userData: response.userData
            },
            error: {},
        })
    } catch(error) {
        return res.status(error.statusCode).json({
            success: false,
            data: {},
            message: error.message,
            error: error,
        })
    }

}

async function logout(req, res) {
    console.log("Cookie from frontend", req.cookies);
    
    res.cookie("authToken", "", {
        httpOnly: true,
        secure: serverConfig.COOKIE_SECURE,  // Set to true if using HTTPS
         sameSite: "None",
         expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Adjust expiry as needed
        // domain: FRONTEND_URL,
    });
    return res.status(200).json({
        success: true,
        message: "Log out Successfully",
        error: {},
        data: {},
    })
}


module.exports = {
    login,
    logout,
}
