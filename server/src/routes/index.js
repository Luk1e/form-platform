import authRouter from "./authRouter.js";
import adminRouter from "./adminRouter.js";
import templatePublicRouter from "./templatePublicRouter.js";
import templateProtectedRouter from "./templateProtectedRouter.js";
import supportRouter from "./supportRouter.js";

const setupRoutes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/support", supportRouter);
  app.use("/api/templates", templatePublicRouter);
  app.use("/api/templates", templateProtectedRouter);
};

export default setupRoutes;
