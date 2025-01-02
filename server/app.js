import express from "express";
import setupMiddleware from "./config/middleware.js";
import setupRoutes from "./src/routes/index.js";
import initializeDatabase from "./config/initializeDatabase.js";
import setupAdmin from "./config/admin.js";

const app = express();
const PORT = 5000;

setupAdmin(app);
setupMiddleware(app);
setupRoutes(app);

(async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
})();
