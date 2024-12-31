import {
  userService,
  templateService,
  adminService,
} from "../services/index.js";
import { CustomError } from "../utils/index.js";

const userController = {
  getUserTemplateByID: async (req, res) => {
    try {
      const template = await templateService.getTemplateById(req.params.id);
      const isAdmin = await adminService.isAdmin(req.userId);

      if (!isAdmin && template.user_id !== req.userId) {
        throw CustomError.forbidden("Not authorized to get this template", 23);
      }

      res.json(template);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error getting user's template by id:", error);
      res.status(500).json({
        message: "Error getting user's template by id",
        errorCode: "GET_USER'S_TEMPLATE_BY_ID_ERROR",
      });
    }
  },

  getUserTemplatesWithFilters: async (req, res) => {
    try {
      const result = await userService.getUserTemplatesWithFilters(
        req.userId,
        req.query
      );
      res.json(result);
    } catch (error) {
      console.error("Error getting user templates:", error);
      res.status(500).json({
        message: "Error getting user templates",
        errorCode: "GET_USER_TEMPLATES_ERROR",
      });
    }
  },

  getUserFormsWithFilters: async (req, res) => {
    try {
      const result = await userService.getUserFormsWithFilters(
        req.userId,
        req.query
      );
      res.json(result);
    } catch (error) {
      console.error("Error getting user forms:", error);
      res.status(500).json({
        message: "Error getting user forms",
        errorCode: "GET_USER_FORMS_ERROR",
      });
    }
  },
};

export default userController;
