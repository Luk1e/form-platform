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
};

export default supportController;
