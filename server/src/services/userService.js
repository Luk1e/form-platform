import bcrypt from "bcrypt";
import database from "../../config/database.js";
import CustomError from "../utils/customError.js";

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

  createUser: async (username, email, password) => {
    try {
      const [existingUsers] = await database.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      if (existingUsers.length > 0) {
        throw CustomError.conflict("Email is already registered");
      }

      const [existingUsernames] = await database.query(
        "SELECT id FROM users WHERE username = ?",
        [username]
      );

      if (existingUsernames.length > 0) {
        throw CustomError.conflict("Username is already taken");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await database.query(
        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
        [username, email, hashedPassword]
      );

      return { id: result.insertId, username, email };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("User creation error:", error);

      throw CustomError.internalServerError("Unable to complete registration");
    }
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

  login: async (email, password) => {
    try {
      const [rows] = await database.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (rows.length === 0) {
        throw CustomError.notFound("User not found");
      }

      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isPasswordValid) {
        throw CustomError.unauthorized("Invalid credentials");
      }

      return { id: user.id, username: user.username, email: user.email };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error("Login error:", error);

      throw CustomError.internalServerError("Login failed");
    }
  },
};

export default userService;
