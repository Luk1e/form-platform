import { authService, jwtService } from "../services/index.js";
import { CustomError } from "../utils/index.js";

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const user = await authService.register(username, email, password);
      const { accessToken, csrfToken } = jwtService.generateToken(user.id);

      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        user,
        csrfToken,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error registering user:", error);
      res.status(500).json({
        message: "Error registering user",
        errorCode: "AUTH_REGISTER_ERROR",
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await authService.login(email, password);
      const { accessToken, csrfToken } = jwtService.generateToken(user.id);

      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({
        user,
        csrfToken,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error login user:", error);
      res.status(500).json({
        message: "Error login user",
        errorCode: "AUTH_LOGIN_ERROR",
      });
    }
  },

  googleLogin: async (req, res) => {
    try {
      const { accessToken: GoogleAccessToken } = req.body;

      const user = await authService.googleLogin(GoogleAccessToken);
      const { accessToken, csrfToken } = jwtService.generateToken(user.id);

      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({
        user,
        csrfToken,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error google authorization:", error);
      res.status(500).json({
        message: "Error google authorization",
        errorCode: "AUTH_GOOGLE_ERROR",
      });
    }
  },

  logout: (_, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  },
};

export default authController;
