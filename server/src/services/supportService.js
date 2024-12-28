import models from "../models/index.js";
import { v2 as cloudinary } from "cloudinary";
import { CustomError } from "../utils/index.js";
import dotenv from "dotenv";
import { Op } from "sequelize";
const { User, Template, TemplateTopic, TemplateTag } = models;

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
      throw CustomError.internalServerError(
        "Error uploading image",
        "UPLOAD_IMAGE_ERROR"
      );
    }
  },

  getTags: async () => {
    const tags = await TemplateTag.findAll({
      attributes: ["name"],
      group: ["name"],
      order: [["name", "ASC"]],
    });
    return tags;
  },

  getTagCloud: async () => {
    const tagCloud = await models.TemplateTag.findAll({
      attributes: [
        "id",
        "name",
        [
          models.sequelize.fn("COUNT", models.sequelize.col("Templates.id")),
          "count",
        ],
      ],
      include: [
        {
          model: models.Template,
          attributes: [],
          through: { attributes: [] },
        },
      ],
      group: ["TemplateTag.id", "TemplateTag.name"],
      having: models.sequelize.where(
        models.sequelize.fn("COUNT", models.sequelize.col("Templates.id")),
        Op.gt,
        0
      ),
      order: [
        [
          models.sequelize.fn("COUNT", models.sequelize.col("Templates.id")),
          "DESC",
        ],
      ],
      limit: 50,
      subQuery: false,
    });
    return tagCloud;
  },

  getTagsByTemplateId: async (templateId) => {
    const template = await Template.findByPk(templateId, {
      include: [
        {
          model: TemplateTag,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!template) {
      throw CustomError.notFound("Template not found");
    }

    return template;
  },

  getTopics: async () => {
    const topics = await TemplateTopic.findAll({
      order: [["name", "ASC"]],
    });

    return topics;
  },

  getUsers: async (userId) => {
    const users = await User.findAll({
      where: {
        id: {
          [Op.ne]: userId,
        },
      },
      attributes: ["id", "username", "email"],
    });

    return users;
  },
};

export default supportService;
