import express from "express";
import { templateController } from "../controllers/index.js";
import { validate } from "../middlewares/index.js";
import {
  templateSearchSchema,
  latestTemplateSearchSchema,
} from "../validations/index.js";

const router = express.Router();

router.get(
  "/search",
  validate(templateSearchSchema, true),
  templateController.searchTemplates
);

router.get("/popular", templateController.getPopularTemplates);
router.get(
  "/latest",
  validate(latestTemplateSearchSchema, true),
  templateController.getLatestTemplates
);
router.get("/tags", templateController.getTagCloud);
router.get("/:id", templateController.getTemplateById);

export default router;
