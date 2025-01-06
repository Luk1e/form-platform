import jwt from "jsonwebtoken";
import crypto from "crypto";
import { CustomError } from "../utils/index.js";
import { JWT_SECRET } from "../../config/environment.js";

const jwtService = {
  generateToken: (userId) => {
    const csrfToken = crypto.randomBytes(32).toString("hex");

    const payload = {
      userId,
      csrfToken,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1d",
    });

    return {
      accessToken: token,
      csrfToken: csrfToken,
    };
  },

  verifyToken: (token, csrfToken) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (decoded.csrfToken !== csrfToken) {
        throw CustomError.unauthorized("CSRF token mismatch");
      }

      return decoded.userId;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw CustomError.unauthorized("Invalid token");
      }
    }
  },
};

export default jwtService;
