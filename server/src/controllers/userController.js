import { userService } from "../services/index.js";
import { CustomError } from "../utils/index.js";

const templateController = {
  getUserTemplatesWithFilters: async (req, res, next) => {
    try {
      const result = await userService.getUserTemplatesWithFilters(
        req.userId,
        req.query
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  getUserFormsWithFilters: async (req, res, next) => {
    try {
      const result = await userService.getUserFormsWithFilters(
        req.userId,
        req.query
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};

export default templateController;
