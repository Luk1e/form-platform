import express from "express";
import { templateController } from "../controllers/index.js";
import { authMiddleware, validate } from "../middlewares/index.js";
import { createTemplateSchema } from "../validations/index.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  validate(createTemplateSchema, false, true),
  templateController.createTemplate
);
router.put(
  "/:id",
  validate(createTemplateSchema),
  templateController.updateTemplate
);
router.delete("/:id", templateController.deleteTemplate);
router.post("/:id/like", templateController.toggleLike);
router.post("/:id/comment", templateController.addComment);
router.get("/:id/comments", templateController.getComments);
router.get("/user/:userId", templateController.getUserTemplates);

export default router;
