import bcrypt from "bcryptjs";
import crypto from "crypto";
import { CustomError } from "../utils/index.js";
import models from "../models/index.js";

const { User } = models;

const authService = {
  register: async (username, email, password) => {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      throw CustomError.conflict("Email is already registered", 13);
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      throw CustomError.conflict("Username is already taken", 14);
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
  },

  login: async (email, password) => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw CustomError.notFound("User not found", 0);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

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
  },

  googleLogin: async (GoogleAccessToken) => {
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
  },
};

export default authService;
