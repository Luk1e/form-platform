import express from "express";
import { templateController } from "../controllers/index.js";
import { authMiddleware, validate } from "../middlewares/index.js";
import {
  createTemplateSchema,
  updateTemplateSchema,
} from "../validations/index.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  validate(createTemplateSchema, false, true),
  templateController.createTemplate
);
router.delete("/:id", templateController.deleteTemplate);

router.put(
  "/:id",
  validate(updateTemplateSchema, false, true),
  templateController.updateTemplate
);


export default router;
