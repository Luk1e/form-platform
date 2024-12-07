import userService from "../services/userService.js";
import jwtService from "../services/jwtService.js";
import CustomError from "../utils/customError.js";

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const user = await userService.createUser(username, email, password);
      const { accessToken, csrfToken } = jwtService.generateToken(user.id);

      res.cookie("token", accessToken, {
        httpOnly: true,
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

      const user = await userService.login(email, password);
      const { accessToken, csrfToken } = jwtService.generateToken(user.id);

      res.cookie("token", accessToken, {
        httpOnly: true,
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
