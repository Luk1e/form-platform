import { jwtService } from "../services/index.js";
import { CustomError } from "../utils/index.js";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const csrfToken = req.headers["x-csrf-token"];

    if (!token) {
      throw CustomError.unauthorized("Unauthorized: No token");
    }

    if (!csrfToken) {
      throw CustomError.unauthorized("Unauthorized: CSRF token missing");
    }

    const userId = jwtService.verifyToken(token, csrfToken);
    req.userId = userId;

    next();
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res.status(403).json({
      message: "Authentication required",
      errorCode: "UNAUTHORIZED",
    });
  }
};

export default authMiddleware;
