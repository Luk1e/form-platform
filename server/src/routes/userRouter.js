import express from "express";
import { userController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/index.js";
import {
  userFormsSearchSchema,
  userTemplatesSearchSchema,
} from "../validations/userValidationSchemas.js";
import { validate } from "../middlewares/index.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/my-templates",
  validate(userTemplatesSearchSchema),
  userController.getUserTemplatesWithFilters
);

router.get(
  "/my-forms",
  validate(userFormsSearchSchema),
  userController.getUserFormsWithFilters
);

export default router;
