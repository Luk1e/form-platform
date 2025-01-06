import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSSequelize from "@adminjs/sequelize";
import sequelize from "./database.js";
import { SESSION_SECRET } from "./environment.js";

AdminJS.registerAdapter(AdminJSSequelize);

const DEFAULT_ADMIN = {
  email: "admin",
  password: "admin",
};

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

const setupAdmin = async (app) => {
  const adminJs = new AdminJS({
    databases: [sequelize],
    rootPath: "/admin",
    branding: {
      companyName: "adminJs",
      logo: false,
      softwareBrothers: false,
    },
  });

  const sessionOptions = {
    secret: SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: true,
  };

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate,
      cookieName: "adminjs",
      cookiePassword: "complex-cookie-password",
    },
    null,
    sessionOptions
  );

  app.use(adminJs.options.rootPath, adminRouter);
};

export default setupAdmin;
