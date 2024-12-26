import { templateService, supportService } from "../services/index.js";
import { CustomError } from "../utils/index.js";

const templateController = {
  createTemplate: async (req, res, next) => {
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
      next(error);
    }
  },

  getTemplateById: async (req, res, next) => {
    try {
      const userId = req.user?.id; // Optional for public templates
      const template = await templateService.getTemplateById(
        req.params.id,
        userId
      );
      res.json(template);
    } catch (error) {
      next(error);
    }
  },

  updateTemplate: async (req, res, next) => {
    try {
      const template = await templateService.getTemplateById(
        req.params.id,
        req.user.id
      );

      // Check if user is admin or template owner
      if (!req.user.is_admin && template.user_id !== req.user.id) {
        throw CustomError.forbidden("Not authorized to update this template");
      }

      await templateService.updateTemplate(req.params.id, req.body);
      res.status(200).json({ message: "Template updated successfully" });
    } catch (error) {
      next(error);
    }
  },

  deleteTemplate: async (req, res, next) => {
    try {
      const template = await templateService.getTemplateById(
        req.params.id,
        req.user.id
      );

      if (!req.user.is_admin && template.user_id !== req.user.id) {
        throw CustomError.forbidden("Not authorized to delete this template");
      }

      await templateService.deleteTemplate(req.params.id);
      res.status(200).json({ message: "Template deleted successfully" });
    } catch (error) {
      next(error);
    }
  },

  searchTemplates: async (req, res, next) => {
    try {
      const userId = req.user?.id; // Optional for public templates
      const results = await templateService.searchTemplates(req.query, userId);
      res.json(results);
    } catch (error) {
      next(error);
    }
  },

  getPopularTemplates: async (req, res, next) => {
    try {
      const templates = await templateService.getPopularTemplates();
      res.json(templates);
    } catch (error) {
      next(error);
    }
  },

  getLatestTemplates: async (req, res, next) => {
    try {
      const templates = await templateService.getLatestTemplates();
      res.json(templates);
    } catch (error) {
      next(error);
    }
  },

  toggleLike: async (req, res, next) => {
    try {
      const result = await templateService.toggleLike(
        req.params.id,
        req.user.id
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  addComment: async (req, res, next) => {
    try {
      const comment = await templateService.addComment(
        req.params.id,
        req.user.id,
        req.body.content
      );
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  },

  getComments: async (req, res, next) => {
    try {
      const comments = await templateService.getComments(req.params.id);
      res.json(comments);
    } catch (error) {
      next(error);
    }
  },

  getUserTemplates: async (req, res, next) => {
    try {
      // Check if user is admin or requesting their own templates
      if (!req.user.is_admin && req.params.userId !== req.user.id) {
        throw CustomError.forbidden("Not authorized to view these templates");
      }

      const templates = await templateService.getUserTemplates(
        req.params.userId
      );
      res.json(templates);
    } catch (error) {
      next(error);
    }
  },

  getTagCloud: async (req, res, next) => {
    try {
      const tags = await templateService.getTagCloud();
      res.json(tags);
    } catch (error) {
      next(error);
    }
  },
};

export default templateController;
