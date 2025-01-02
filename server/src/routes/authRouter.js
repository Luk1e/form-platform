import express from "express";
import { authController } from "../controllers/index.js";
import { validate } from "../middlewares/index.js";
import { registerSchema, loginSchema } from "../validations/index.js";

const router = express.Router();

router.delete("/logout", authController.logout);
router.post("/google", authController.googleLogin);
router.post("/login", validate(loginSchema), authController.login);
router.post("/register", validate(registerSchema), authController.register);

export default router;
