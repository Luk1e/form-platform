import authRouter from "./authRouter.js";
import adminRouter from "./adminRouter.js";
import templateRouter from "./templateRouter.js"

const setupRoutes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/template", templateRouter);
};

export default setupRoutes;
