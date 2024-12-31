import models from "../models/index.js";
import { v2 as cloudinary } from "cloudinary";
import { CustomError } from "../utils/index.js";
import dotenv from "dotenv";
import { Op } from "sequelize";
const { User, Template, TemplateTopic, TemplateTag, sequelize } = models;

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

  getTemplateEngagement: async (templateId, userId) => {
    const parsedUserid = parseInt(userId) ? parseInt(userId) : null;
    const engagement = await models.Template.findOne({
      where: { id: templateId },
      attributes: [
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM comments WHERE comments.template_id = Template.id)"
          ),
          "comment_count",
        ],
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM likes WHERE likes.template_id = Template.id)"
          ),
          "like_count",
        ],
        [
          sequelize.literal(
            `CASE
                WHEN ${parsedUserid} IS NULL THEN FALSE
                ELSE (SELECT COUNT(*) > 0 FROM likes WHERE likes.template_id = Template.id AND likes.user_id = ${parsedUserid})
               END`
          ),
          "has_liked",
        ],
      ],
      include: [
        {
          model: models.Comment,
          attributes: ["id", "content", "created_at"],
          include: [
            {
              model: models.User,
              attributes: ["id", "username"],
            },
          ],
          order: [["created_at", "DESC"]],
        },
      ],
    });

    if (!engagement) {
      throw CustomError.notFound("Template not found", 11);
    }

    return engagement.get({ plain: true });
  },
};

export default supportService;
