import express from "express";
import { authController } from "../controllers/index.js";
import { validate } from "../middlewares/index.js";
import { registerSchema, loginSchema } from "../utils/validationSchemas.js";

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.delete("/logout", authController.logout);

export default router;
