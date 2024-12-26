const AppError = require("./appError");

class InternalServerError extends AppError {
    constructor(error){
        const message = error || "It's not you it's our server where something went wrong";
        super(message, 500);
    }
}

module.exports = InternalServerError;