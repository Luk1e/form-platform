
import express from "express";
import authController from "../controllers/authController.js";
import validate from "../middlewares/validateMiddleware.js";
import { registerSchema, loginSchema } from "../utils/validationSchemas.js";

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);

export default router;
