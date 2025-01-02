import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";

const allowedOrigins = [
  "http://localhost:5173",
  "https://form-platform-client.onrender.com/",
];

const setupMiddleware = (app) => {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    })
  );
};

export default setupMiddleware;
