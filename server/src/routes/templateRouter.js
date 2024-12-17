import express from "express";
import { templateController } from "../controllers/index.js";
import { authMiddleware, validate } from "../middlewares/index.js";
import {
  createTemplateSchema,
  templateSearchSchema,
} from "../validations/index.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  validate(createTemplateSchema),
  templateController.createTemplate
);

router.get("/:id", templateController.getTemplate);

router.get(
  "/",
  validate(templateSearchSchema, true),
  templateController.searchTemplates
);

export default router;
