import database from "../../config/database.js";
import { CustomError } from "../utils/index.js";

const userService = {
  getUserTemplatesWithFilters: async (userId, filters) => {
    const { title, order = "desc", page, limit } = filters;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;
    const offset = (parsedPage - 1) * parsedLimit;

    let query = `
      SELECT t.*, tt.name as topic_name,
             COUNT(DISTINCT f.id) as form_count,
             COUNT(DISTINCT l.user_id) as like_count
      FROM templates t
      LEFT JOIN template_topics tt ON t.topic_id = tt.id
      LEFT JOIN filled_forms f ON t.id = f.template_id
      LEFT JOIN likes l ON t.id = l.template_id
      WHERE t.user_id = ?
    `;

    const params = [userId];

    if (title) {
      query += ` AND t.title LIKE ?`;
      params.push(`%${title}%`);
    }

    query += ` GROUP BY t.id
              ORDER BY t.created_at ${order}
              LIMIT ? OFFSET ?`;
    params.push(parsedLimit, offset);

    const [[rows], [countResult]] = await Promise.all([
      database.query(query, params),
      database.query(
        `SELECT COUNT(DISTINCT t.id) as total 
         FROM templates t 
         WHERE t.user_id = ?
         ${title ? "AND t.title LIKE ?" : ""}`,
        params.slice(0, -2)
      ),
    ]);

    return {
      templates: rows,
      pagination: {
        currentPage: parsedPage,
        totalPages: Math.ceil(countResult[0].total / parsedLimit),
        total: countResult[0].total,
      },
    };
  },

  getUserFormsWithFilters: async (userId, filters) => {
    const { template_title, order = "desc", page, limit } = filters;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;

    const offset = (parsedPage - 1) * parsedLimit;

    let query = `
        SELECT f.*, t.title as template_title
        FROM filled_forms f
        JOIN templates t ON f.template_id = t.id
        WHERE f.user_id = ?
      `;

    const params = [userId];

    if (template_title) {
      query += ` AND t.title LIKE ?`;
      params.push(`%${template_title}%`);
    }

    query += ` ORDER BY f.created_at ${order}
                 LIMIT ? OFFSET ?`;
    params.push(parsedLimit, offset);

    const [[rows], [countResult]] = await Promise.all([
      database.query(query, params),
      database.query(
        `SELECT COUNT(DISTINCT f.id) as total 
           FROM filled_forms f 
           JOIN templates t ON f.template_id = t.id
           WHERE f.user_id = ?
           ${template_title ? "AND t.title LIKE ?" : ""}`,
        params.slice(0, -2)
      ),
    ]);

    return {
      forms: rows,
      pagination: {
        currentPage: parsedPage,
        totalPages: Math.ceil(countResult[0].total / parsedLimit),
        total: countResult[0].total,
      },
    };
  },

  getAllUsers: async () => {
    const [rows] = await database.query("SELECT * FROM users");
    return rows;
  },

  getUserById: async (id) => {
    const [rows] = await database.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      throw new Error("User not found");
    }
    return rows[0];
  },

  updateUser: async (id, username, email) => {
    await database.query(
      "UPDATE users SET username = ?, email = ? WHERE id = ?",
      [username, email, id]
    );
    return { id, username, email };
  },

  deleteUser: async (id) => {
    const [result] = await database.query("DELETE FROM users WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      throw new Error("User not found");
    }
  },
};

export default userService;
