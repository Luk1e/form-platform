import fs from "fs/promises";
import path from "path";
import db from "../../config/database.js";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function executeSqlFile(filename) {
  try {

    const sqlPath = path.resolve(__dirname, "..", filename);

    console.log("Attempting to read SQL file from:", sqlPath);

    const sqlContent = await fs.readFile(sqlPath, "utf-8");


    const statements = sqlContent
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0);

    for (const statement of statements) {
      await db.execute(statement);
    }

    console.log("Database schema created successfully");
  } catch (error) {
    console.error("Error setting up database:", error);
    throw error;
  }
}

export default executeSqlFile;
