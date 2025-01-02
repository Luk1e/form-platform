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

router.get("/templates/:id", userController.getUserTemplateByID);

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

router.post("/templates/:id/comment", userController.addComment);

router.post("/templates/:id/like", userController.toggleLike);

router.post("/templates/:id/fill", userController.createFilledForm);
router.get("/templates/:id/isFilled", userController.hasUserFilledForm);
router.get("/forms/:id", userController.getUserFilledForm);
router.put("/forms/:id", userController.updateFilledForm);

export default router;
