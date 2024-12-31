import express from "express";
import { supportController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/index.js";

const router = express.Router();

router.get("/tags", supportController.getTags);
router.get("/tagCloud", supportController.getTagCloud);
router.get("/topics", supportController.getTopics);
router.get("/engagements/:id", supportController.getTemplateEngagement);

router.use(authMiddleware);
router.get("/users", supportController.getUsers);

export default router;
