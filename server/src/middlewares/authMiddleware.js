import { jwtService } from "../services/index.js";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  const csrfToken = req.headers["x-csrf-token"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token" });
  }

  if (!csrfToken) {
    return res.status(401).json({ error: "Unauthorized: CSRF token missing" });
  }

  try {
    const userId = jwtService.verifyToken(token, csrfToken);
    req.userId = userId;

    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export default authMiddleware;
