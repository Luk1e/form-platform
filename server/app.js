import express from "express";
import setupMiddleware from "./config/middleware.js";
import setupRoutes from "./src/routes/index.js";
import initializeDatabase from "./config/initializeDatabase.js";

const app = express();
const PORT = 5000;

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
