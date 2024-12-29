import { adminService } from "../services/index.js";
import { CustomError } from "../utils/index.js";

const adminMiddleware = async (req, res, next) => {
  try {
    const isAdmin = await adminService.isAdmin(req.userId);

    if (!isAdmin) {
      throw CustomError.forbidden("Admin access required");
    }

    next();
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(error.toJSON());
    }

    return res.status(403).json({
      message: "Access denied",
      errorCode: "ADMIN_ACCESS_DENIED",
    });
  }
};

export default adminMiddleware;
