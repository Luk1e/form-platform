import bcrypt from "bcrypt";
import crypto from "crypto";
import { CustomError } from "../utils/index.js";
import models from "../models/index.js";

const { User } = models;

const authService = {
  register: async (username, email, password) => {
    try {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        throw CustomError.conflict("Email is already registered", 3);
      }

      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        throw CustomError.conflict("Username is already taken", 4);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password_hash: hashedPassword,
      });

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
      console.error("User creation error:", error);

      throw CustomError.internalServerError("Unable to complete registration");
    }
  },

  login: async (email, password) => {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw CustomError.notFound("User not found", 0);
      }

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

      let user = await User.findOne({ where: { email: data.email } });

      if (!user) {
        const hashedPassword = await bcrypt.hash(
          crypto.randomBytes(32).toString("hex"),
          10
        );
        user = await User.create({
          username: data.name,
          email: data.email,
          password_hash: hashedPassword,
        });
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
      console.error("Google authentication error:", error);

      throw CustomError.internalServerError("Google authentication failed");
    }
  },
};

export default authService;
