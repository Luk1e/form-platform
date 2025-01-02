import express from "express";
import setupMiddleware from "../config/middleware.js";
import setupRoutes from "../src/routes/index.js";
import initializeDatabase from "../config/initializeDatabase.js";
import setupAdmin from "../config/admin.js";

const app = express();

setupAdmin(app);
setupMiddleware(app);
setupRoutes(app);

await initializeDatabase();

export default app;
