import authRouter from "./authRouter.js";

const setupRoutes = (app) => {
  app.use("/api/auth", authRouter);
};

export default setupRoutes;
