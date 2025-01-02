import { authService, jwtService } from "../services/index.js";
import { CustomError } from "../utils/index.js";

import dotenv from "dotenv";
dotenv.config();

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const user = await authService.register(username, email, password);
      const { accessToken, csrfToken } = jwtService.generateToken(user.id);

      console.log(process.env.NODE_ENV);

      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "development" ? "Lax" : "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        user,
        csrfToken,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.toJSON());
      } else {
        res.status(500).json({
          message: "Unexpected error occurred",
          errorCode: "UNEXPECTED_ERROR",
        });
      }
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await authService.login(email, password);
      const { accessToken, csrfToken } = jwtService.generateToken(user.id);

      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "development" ? "Lax" : "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({
        user,
        csrfToken,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.toJSON());
      } else {
        res.status(500).json({
          message: "Unexpected error occurred",
          errorCode: "UNEXPECTED_ERROR",
        });
      }
    }
  },
  googleLogin: async (req, res) => {
    try {
      const { accessToken: GoogleAccessToken } = req.body;

      const user = await authService.googleLogin(GoogleAccessToken);
      const { accessToken, csrfToken } = jwtService.generateToken(user.id);

      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "development" ? "Lax" : "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({
        user,
        csrfToken,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.toJSON());
      } else {
        res.status(500).json({
          message: "Unexpected error occurred",
          errorCode: "UNEXPECTED_ERROR",
        });
      }
    }
  },

  logout: (_, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  },
};

export default authController;
