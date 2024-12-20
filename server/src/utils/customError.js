class CustomError extends Error {
  constructor(message, statusCode = 500, errorCode = "INTERNAL_SERVER_ERROR") {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad Request", errorCode = "BAD_REQUEST") {
    return new CustomError(message, 400, errorCode);
  }

  static unauthorized(message = "Unauthorized", errorCode = "UNAUTHORIZED") {
    return new CustomError(message, 401, errorCode);
  }

  static forbidden(message = "Forbidden", errorCode = "FORBIDDEN") {
    return new CustomError(message, 403, errorCode);
  }

  static notFound(message = "Not Found", errorCode = "NOT_FOUND") {
    return new CustomError(message, 404, errorCode);
  }

  static conflict(message = "Conflict", errorCode = "CONFLICT") {
    return new CustomError(message, 409, errorCode);
  }

  static unprocessableEntity(
    message = "Unprocessable Entity",
    errorCode = "UNPROCESSABLE_ENTITY"
  ) {
    return new CustomError(message, 422, errorCode);
  }

  static internalServerError(
    message = "Internal Server Error",
    errorCode = "INTERNAL_SERVER_ERROR"
  ) {
    return new CustomError(message, 500, errorCode);
  }

  toJSON() {
    return {
      message: this.message,
      errorCode: this.errorCode,
    };
  }
}

export default CustomError;
