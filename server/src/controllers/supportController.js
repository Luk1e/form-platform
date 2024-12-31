import { supportService } from "../services/index.js";
import { CustomError } from "../utils/index.js";

const supportController = {
  getUsers: async (req, res) => {
    try {
      const users = await supportService.getUsers(req.userId);
      res.json(users);
    } catch (error) {
      console.error("Error getting tags:", error);
      res.status(500).json({
        message: "Error getting tags",
        errorCode: "GET_TAGS_ERROR",
      });
    }
  },

  getTags: async (_, res) => {
    try {
      const tags = await supportService.getTags();
      res.json(tags);
    } catch (error) {
      console.error("Error getting tags:", error);
      res.status(500).json({
        message: "Error getting tags",
        errorCode: "GET_TAGS_ERROR",
      });
    }
  },

  getTagCloud: async (_, res) => {
    try {
      const tags = await supportService.getTagCloud();
      res.json(tags);
    } catch (error) {
      console.error("Error getting tags:", error);
      res.status(500).json({
        message: "Error getting tags",
        errorCode: "GET_TAGS_ERROR",
      });
    }
  },

  getTopics: async (_, res) => {
    try {
      const topics = await supportService.getTopics();
      res.json(topics);
    } catch (error) {
      console.error("Error getting topics:", error);
      res.status(500).json({
        message: "Error getting topics",
        errorCode: "GET_TOPICS_ERROR",
      });
    }
  },

  getTemplateEngagement: async (req, res) => {
    try {
      const engagements = await supportService.getTemplateEngagement(
        req.params.id,
        req.query.userId
      );
      res.json(engagements);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error getting template engagements:", error);
      res.status(500).json({
        message: "Error template engagements",
        errorCode: "GET_TEMPLATE_ENGAGEMENTS_ERROR",
      });
    }
  },
};

export default supportController;
