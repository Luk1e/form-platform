import jwt from "jsonwebtoken";
import crypto from "crypto";

const jwtService = {
  generateToken: (userId) => {
    const csrfToken = crypto.randomBytes(32).toString("hex");

    const payload = {
      userId,
      csrfToken,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return {
      accessToken: token,
      csrfToken: csrfToken,
    };
  },

  verifyToken: (token, csrfToken) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.csrfToken !== csrfToken) {
        throw new Error("CSRF token mismatch");
      }

      return decoded.userId;
    } catch (error) {
      throw new Error("Invalid token");
    }
  },
};

export default jwtService;
