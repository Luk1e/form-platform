import express from "express";
import { supportController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/index.js";

const router = express.Router();

router.get("/tags", supportController.getTags);
router.get("/topics", supportController.getTopics);

router.use(authMiddleware);
router.get("/users", supportController.getUsers);

export default router;
