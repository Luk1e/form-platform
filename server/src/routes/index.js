import authRouter from "./authRouter.js";
import adminRouter from "./adminRoutes.js";

const setupRoutes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);
};

export default setupRoutes;
