import database from "../../config/database.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const supportService = {
  uploadImage: async (image) => {
    try {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "templates",
        resource_type: "auto",
      });

      return {
        secure_url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({
        message: "Error uploading image",
        errorCode: "UPLOAD_IMAGE_ERROR",
      });
    }
  },

  getTags: async () => {
    const [rows] = await database.query(
      `SELECT DISTINCT name 
         FROM template_tags 
         ORDER BY name`
    );
    return rows;
  },

  getTagCloud: async () => {
    const [rows] = await database.query(`
      SELECT tt.name, COUNT(DISTINCT ttm.template_id) as template_count
      FROM template_tags tt
      JOIN template_tag_mapping ttm ON tt.id = ttm.tag_id
      JOIN templates t ON ttm.template_id = t.id
      WHERE t.is_public = TRUE
      GROUP BY tt.id
      ORDER BY template_count DESC
      LIMIT 50
    `);
    return rows;
  },

  getTagsByTemplateId: async (templateId) => {
    const [rows] = await database.query(
      `SELECT tt.name
         FROM template_tags tt
         JOIN template_tag_mapping ttm ON tt.id = ttm.tag_id
         WHERE ttm.template_id = ?`,
      [templateId]
    );
    return rows.map((row) => row.name);
  },

  getTopics: async () => {
    const [rows] = await database.query(
      "SELECT * FROM template_topics ORDER BY name"
    );
    return rows;
  },

  getUsers: async (userId) => {
    const [rows] = await database.query(
      "SELECT  id, username, email  FROM users WHERE id != ?",
      [userId]
    );
    return rows;
  },
};

export default supportService;
