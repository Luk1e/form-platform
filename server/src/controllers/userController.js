import {
  userService,
  templateService,
  adminService,
  supportService,
  formService,
} from "../services/index.js";
import { CustomError } from "../utils/index.js";

const userController = {
  getUserTemplateById: async (req, res) => {
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

  getUserTheme: async (req, res) => {
    try {
      const theme = await userService.getUserTheme(req.userId);

      res.json({ theme });
    } catch (error) {
      console.error("Error getting user theme:", error);
      res.status(500).json({
        message: "Error getting user theme",
        errorCode: "GET_USER_THEME_ERROR",
      });
    }
  },

  toggleTheme: async (req, res) => {
    try {
      const theme = await userService.toggleTheme(req.userId);

      res.json({ theme });
    } catch (error) {
      console.error("Error toggle user theme:", error);
      res.status(500).json({
        message: "Error toggle user theme",
        errorCode: "TOGGLE_USER_THEME_ERROR",
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

  createForm: async (req, res) => {
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

      const returnedTemplateId = await formService.createForm(
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

  updateFilledForm: async (req, res) => {
    try {
      const userId = req.userId;
      const formId = req.params.id;

      const formData = JSON.parse(req.body.data);

      const returnedTemplateId = await formService.updateFilledForm(
        userId,
        formId,
        formData
      );

      res.status(201).json({ returnedTemplateId });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error updating form:", error);
      res.status(500).json({
        message: "Error updating form",
        errorCode: "UPDATE_FORM_ERROR",
      });
    }
  },

  getUserFilledForm: async (req, res) => {
    try {
      const formId = req.params.id;
      const userId = req.userId;

      const filledForm = await formService.getFilledForm(formId, userId);

      res.json(filledForm);
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

      const hasFilled = await formService.hasUserFilledForm(userId, templateId);
      let form;

      if (hasFilled) {
        form = await formService.getUserForm(userId, templateId);
      }

      res.json({ hasFilled, formId: form?.id || -1 });
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
