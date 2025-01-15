import express from "express";
import { salesforceController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/index.js";
import { validate } from "../middlewares/index.js";
import { salesforceAccountSchema } from "../validations/salesforceValidationSchema.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", salesforceController.getSalesforceDetails);

router.post(
  "/",
  validate(salesforceAccountSchema),
  salesforceController.createSalesforceAccount
);

export default router;
