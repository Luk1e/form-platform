import authRouter from "./authRouter.js";
import adminRouter from "./adminRouter.js";
import templateRouter from "./templateRouter.js";
import supportRouter from "./supportRouter.js";
import userRouter from "./userRouter.js";

const setupRoutes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/support", supportRouter);
  app.use("/api/templates", templateRouter);
};

export default setupRoutes;
