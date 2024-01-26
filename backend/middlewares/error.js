const {logger} = require("./logger");

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (err.stack) logger.error(err.stack.toString());
  logger.error(err.message);

  res.status(error.statusCode && error.statusCode !== 200? error.statusCode : 500).json({
    success: false,
    error: error.message || 'Server Error',
    message: error.message || 'Server Error'
  });

};

module.exports = errorHandler;