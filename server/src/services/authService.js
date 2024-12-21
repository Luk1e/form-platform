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
        throw CustomError.conflict("Email is already registered", 3);
      }

      const [existingUsernames] = await database.query(
        "SELECT id FROM users WHERE username = ?",
        [username]
      );

      if (existingUsernames.length > 0) {
        throw CustomError.conflict("Username is already taken", 4);
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
        throw CustomError.notFound("User not found", 0);
      }

      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isPasswordValid) {
        throw CustomError.unauthorized("Invalid credentials", 1);
      }

      if (user.is_blocked) {
        throw CustomError.forbidden("User is blocked", 2);
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

  googleLogin: async (GoogleAccessToken) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${GoogleAccessToken}`,
          },
        }
      );

      const data = await response.json();

      const [existingUser] = await database.query(
        "SELECT * FROM users WHERE email = ?",
        [data.email]
      );

      let userId;

      if (existingUser.length === 0) {
        const hashedPassword = await bcrypt.hash(data.email, 10);

        const [result] = await database.query(
          "INSERT INTO users (username, email, password_hash) VALUES (?, ?,?)",
          [data.name, data.email, hashedPassword]
        );
        userId = result.insertId;
      } else {
        userId = existingUser[0].id;
      }

      const [rows] = await database.query(
        "SELECT id, username, email, is_admin FROM users WHERE id = ?",
        [userId]
      );

      const user = rows[0];

      if (user.is_blocked) {
        throw CustomError.forbidden("User is blocked", 2);
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
      console.error("Google authentication error:", error);

      throw CustomError.internalServerError("Google authentication failed");
    }
  },
};

export default authService;
