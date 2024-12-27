const AppError = require('./appError');

class UnAuthorisedError extends AppError {
  constructor() {
    super(`User is not authorised properly`, 404);
  }
}

module.exports = UnAuthorisedError;
