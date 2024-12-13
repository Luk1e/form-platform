import database from "../../config/database.js";
import { CustomError } from "../utils/index.js";

const userService = {
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
