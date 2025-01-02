import express from "express";
import { templateController } from "../controllers/index.js";
import { authMiddleware, validate } from "../middlewares/index.js";
import {
  createTemplateSchema,
  updateTemplateSchema,
  latestTemplateSearchSchema,
} from "../validations/index.js";

const router = express.Router();

router.get("/search", templateController.searchTemplates);
router.get("/popular", templateController.getPopularTemplates);

router.get(
  "/latest",
  validate(latestTemplateSearchSchema, true),
  templateController.getLatestTemplates
);

router.get("/:id", templateController.getTemplateById);

router.use(authMiddleware);

router.post(
  "/",
  validate(createTemplateSchema, false, true),
  templateController.createTemplate
);

router.put(
  "/:id",
  validate(updateTemplateSchema, false, true),
  templateController.updateTemplate
);

router.delete("/:id", templateController.deleteTemplate);

export default router;
