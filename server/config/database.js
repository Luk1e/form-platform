import mysql from "mysql2/promise";
import executeSqlFile from "../src/utils/databaseSetup.js";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const initializeDatabase = async () => {
  try {
    const sqlFilePath = "../database-schema.sql";
    await executeSqlFile(sqlFilePath);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

export default pool;
export { initializeDatabase };
