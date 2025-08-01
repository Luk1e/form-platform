import dotenv from "dotenv";
dotenv.config();

export const isDevelopment = process.env.NODE_ENV === "development";

export const allowedOrigins = isDevelopment
  ? ["http://localhost:5173"]
  : ["https://form-platform-client.onrender.com"];

export const DB = {
  NAME: isDevelopment ? process.env.DEV_DB_NAME : process.env.PROD_DB_NAME,
  USER: isDevelopment ? process.env.DEV_DB_USER : process.env.PROD_DB_USER,
  PASSWORD: isDevelopment
    ? process.env.DEV_DB_PASSWORD
    : process.env.PROD_DB_PASSWORD,
  HOST: isDevelopment ? process.env.DEV_DB_HOST : process.env.PROD_DB_HOST,
};

export const CLOUDINARY = {
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
};

export const SALESFORCE = {
  SF_LOGIN_URL: process.env.SF_LOGIN_URL,
  SF_USERNAME: process.env.SF_USERNAME,
  SF_PASSWORD: process.env.SF_PASSWORD,
  SF_SECURITY_TOKEN: process.env.SF_SECURITY_TOKEN,
};

export const JWT_SECRET = process.env.JWT_SECRET;
export const SESSION_SECRET = process.env.SESSION_SECRET;
