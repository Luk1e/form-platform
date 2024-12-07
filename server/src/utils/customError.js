class CustomError extends Error {
  constructor(message, statusCode = 500, errorCode = "INTERNAL_SERVER_ERROR") {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad Request") {
    return new CustomError(message, 400, "BAD_REQUEST");
  }

  static unauthorized(message = "Unauthorized") {
    return new CustomError(message, 401, "UNAUTHORIZED");
  }

  static forbidden(message = "Forbidden") {
    return new CustomError(message, 403, "FORBIDDEN");
  }

  static notFound(message = "Not Found") {
    return new CustomError(message, 404, "NOT_FOUND");
  }

  static conflict(message = "Conflict") {
    return new CustomError(message, 409, "CONFLICT");
  }

  static unprocessableEntity(message = "Unprocessable Entity") {
    return new CustomError(message, 422, "UNPROCESSABLE_ENTITY");
  }

  static internalServerError(message = "Internal Server Error") {
    return new CustomError(message, 500, "INTERNAL_SERVER_ERROR");
  }

  toJSON() {
    return {
      message: this.message,
      errorCode: this.errorCode,
    };
  }
}

export default CustomError;
