import express from "express";
import { adminController } from "../controllers/index.js";
import {
  adminMiddleware,
  authMiddleware,
  validate,
} from "../middlewares/index.js";

import {
  userSearchSchema,
  templateSearchSchema,
  bulkUserOperationSchema,
  formSearchSchema,
} from "../validations/index.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get(
  "/users",
  validate(userSearchSchema, true),
  adminController.searchUsers
);

router.get(
  "/templates",
  validate(templateSearchSchema, true),
  adminController.getTemplates
);

router.get(
  "/forms",
  validate(formSearchSchema, true),
  adminController.getForms
);

router.patch(
  "/users/block",
  validate(bulkUserOperationSchema),
  adminController.bulkBlockUsers
);

router.patch(
  "/users/unblock",
  validate(bulkUserOperationSchema),
  adminController.bulkUnblockUsers
);

router.patch(
  "/users/add-admin",
  validate(bulkUserOperationSchema),
  adminController.bulkAddAdminPrivileges
);

router.patch(
  "/users/remove-admin",
  validate(bulkUserOperationSchema),
  adminController.bulkRemoveAdminPrivileges
);

router.delete(
  "/users",
  validate(bulkUserOperationSchema),
  adminController.bulkDeleteUsers
);

export default router;
