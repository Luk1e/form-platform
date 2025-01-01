import {
  userService,
  templateService,
  adminService,
  supportService,
  formService,
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

  toggleLike: async (req, res) => {
    try {
      await userService.toggleLike(req.params.id, req.userId);
      const engagements = await supportService.getTemplateEngagement(
        req.params.id,
        req.userId
      );
      res.json(engagements);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error toggle like:", error);
      res.status(500).json({
        message: "Error toggle like",
        errorCode: "TOGGLE_LIKE_ERROR",
      });
    }
  },

  addComment: async (req, res) => {
    try {
      const { content } = req.body;
      await userService.addComment(req.params.id, req.userId, content);

      const engagements = await supportService.getTemplateEngagement(
        req.params.id,
        req.userId
      );
      res.json(engagements);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error adding comment:", error);
      res.status(500).json({
        message: "Error adding comment",
        errorCode: "Add_COMMENT_ERROR",
      });
    }
  },

  createFilledForm: async (req, res) => {
    try {
      const userId = req.userId;
      const templateId = req.params.id;
      const hasFilledForm = await formService.hasUserFilledForm(
        userId,
        templateId
      );

      if (hasFilledForm) {
        throw CustomError.conflict(
          "You have already submitted form for this template",
          74
        );
      }

      const templateData = JSON.parse(req.body.data);

      const returnedTemplateId = await formService.createFilledForm(
        userId,
        templateId,
        templateData
      );

      res.status(201).json({ returnedTemplateId });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error creating form:", error);
      res.status(500).json({
        message: "Error creating form",
        errorCode: "CREATING_FORM_ERROR",
      });
    }
  },

  getUserFilledForm: async (req, res) => {
    try {
      const templateId = req.params.id;
      const userId = req.userId;

      const filledForm = await formService.getFilledForm(userId, templateId);

      if (!filledForm) {
        return res.status(404).json({
          success: false,
          message: "No filled form found for this user and template",
        });
      }

      res.json({
        success: true,
        data: filledForm,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error getting user form:", error);
      res.status(500).json({
        message: "Error getting user form",
        errorCode: "GET_USER_FORM_ERROR",
      });
    }
  },

  hasUserFilledForm: async (req, res) => {
    try {
      const userId = req.userId;
      const templateId = req.params.id;
      return formService.hasUserFilledForm(userId, templateId);
    } catch (error) {
      console.error("Error checking user filled form:", error);
      res.status(500).json({
        message: "Error checking user filled form",
        errorCode: "CHECK_USER_FILLED_FORM_ERROR",
      });
    }
  },
};

export default userController;
