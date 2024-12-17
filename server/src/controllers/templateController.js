import { templateService } from "../services/index.js";
import { CustomError } from "../utils/index.js";

const templateController = {
  createTemplate: async (req, res) => {
    try {
      const userId = req.userId;
      const templateId = await templateService.createTemplate(userId, req.body);

      res.status(201).json({
        message: "Template created successfully",
        templateId
      });
    } catch (error) {
      console.log(error)
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.toJSON());
      } else {
        res.status(500).json({
          message: "Unexpected error occurred",
          errorCode: "UNEXPECTED_ERROR",
        });
      }
    }
  },

  getTemplate: async (req, res) => {
    try {
      const userId = req.userId;
      const templateId = req.params.id;

      const template = await templateService.getTemplateById(templateId, userId);

      res.json(template);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.toJSON());
      } else {
        res.status(500).json({
          message: "Unexpected error occurred",
          errorCode: "UNEXPECTED_ERROR",
        });
      }
    }
  },

  searchTemplates: async (req, res) => {
    try {
      const userId = req.user.id;
      const result = await templateService.searchTemplates(req.query, userId);

      res.json(result);
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.toJSON());
      } else {
        res.status(500).json({
          message: "Unexpected error occurred",
          errorCode: "UNEXPECTED_ERROR",
        });
      }
    }
  }
};

export default templateController;