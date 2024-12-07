import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

const setupMiddleware = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors());
};

export default setupMiddleware;
