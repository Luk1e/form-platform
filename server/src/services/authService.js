import bcrypt from "bcrypt";
import database from "../../config/database.js";
import { CustomError } from "../utils/index.js";

const authService = {
  register: async (username, email, password) => {
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

      return { id: result.insertId, username, email, isAdmin: false };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("User creation error:", error);

      throw CustomError.internalServerError("Unable to complete registration");
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

      if (user.is_blocked) {
        throw CustomError.forbidden("User is blocked");
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.is_admin,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error("Login error:", error);

      throw CustomError.internalServerError("Login failed");
    }
  },
};

export default authService;
