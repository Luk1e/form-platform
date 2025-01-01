import {
  templateService,
  supportService,
  adminService,
} from "../services/index.js";
import { CustomError } from "../utils/index.js";

const templateController = {
  createTemplate: async (req, res) => {
    try {
      let templateData = JSON.parse(req.body.data);

      if (req.files && req.files.image) {
        try {
          const uploadResult = await supportService.uploadImage(
            req.files.image
          );
          templateData.image_url = uploadResult.secure_url;
        } catch (error) {
          throw new CustomError("Image upload failed", 400);
        }
      }

      const templateId = await templateService.createTemplate(
        req.userId,
        templateData
      );

      res.status(201).json({ templateId });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error creating template:", error);
      res.status(500).json({
        message: "Error creating template",
        errorCode: "CREATE_TEMPLATE_ERROR",
      });
    }
  },

  getTemplateById: async (req, res) => {
    try {
      const template = await templateService.getTemplateById(req.params.id);
      res.json(template);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error getting template by id:", error);
      res.status(500).json({
        message: "Error getting template by id",
        errorCode: "GET_TEMPLATE_BY_ID_ERROR",
      });
    }
  },

  updateTemplate: async (req, res) => {
    try {
      const template = await templateService.getTemplateByPk(req.params.id);
      const isAdmin = await adminService.isAdmin(req.userId);
      if (!template) {
        throw CustomError.notFound("Template not found", 11);
      }

      if (!isAdmin && template.user_id !== req.userId) {
        throw CustomError.forbidden(
          "Not authorized to update this template",
          12
        );
      }

      let templateData = JSON.parse(req.body.data);

      if (req.files && req.files.image) {
        try {
          const uploadResult = await supportService.uploadImage(
            req.files.image
          );
          templateData.image_url = uploadResult.secure_url;
        } catch (error) {
          throw new CustomError("Image upload failed", 400);
        }
      }

      const templateId = await templateService.updateTemplate(
        req.params.id,
        templateData
      );

      res.status(200).json({ templateId });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error updating template:", error);
      res.status(500).json({
        message: "Error updating template",
        errorCode: "UPDATE_TEMPLATE_ERROR",
      });
    }
  },

  deleteTemplate: async (req, res) => {
    try {
      const template = await templateService.getTemplateByPk(req.params.id);

      if (!template) {
        throw CustomError.notFound("Template not found", 11);
      }

      if (
        !adminService.isAdmin(req.userId) &&
        template.user_id !== req.userId
      ) {
        throw CustomError.forbidden(
          "Not authorized to delete this template",
          12
        );
      }

      await templateService.deleteTemplate(req.params.id);
      res.status(200).json({ message: "Template deleted successfully" });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error deleting template:", error);
      res.status(500).json({
        message: "Error deleting template",
        errorCode: "DELETE_TEMPLATE_ERROR",
      });
    }
  },

  searchTemplates: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const query = req.query.query || "";
      const tagId = req.query.tag;

      const templates = await templateService.searchTemplates(
        query,
        page,
        limit,
        tagId
      );
      res.json(templates);
    } catch (error) {
      console.error("Error searching templates:", error);
      res.status(500).json({
        message: "Error searching templates",
        errorCode: "SEARCH_TEMPLATES_ERROR",
      });
    }
  },

  getPopularTemplates: async (_, res) => {
    try {
      const templates = await templateService.getPopularTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error getting popular templates:", error);
      res.status(500).json({
        message: "Error getting popular templates",
        errorCode: "GET_POPULAR_TEMPLATES_ERROR",
      });
    }
  },

  getLatestTemplates: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const templates = await templateService.getLatestTemplates(page, limit);
      res.json(templates);
    } catch (error) {
      console.error("Error getting latest templates:", error);
      res.status(500).json({
        message: "Error getting latest templates",
        errorCode: "GET_LATEST_TEMPLATES_ERROR",
      });
    }
  },

};

export default templateController;
