import { Op } from "sequelize";
import models from "../models/index.js";
import { CustomError } from "../utils/index.js";

const { User, Like, Template, FilledForm } = models;

const userService = {
  getUserTemplatesWithFilters: async (userId, filters) => {
    const { title, order = "desc", page, limit } = filters;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;
    const offset = (parsedPage - 1) * parsedLimit;

    const templates = await Template.findAll({
      attributes: [
        "id",
        "title",
        "is_public",
        "created_at",
        [
          models.sequelize.fn(
            "COUNT",
            models.sequelize.fn(
              "DISTINCT",
              models.sequelize.col("FilledForms.id")
            )
          ),
          "form_count",
        ],
      ],
      include: [
        {
          model: FilledForm,
          attributes: [],
          required: false,
        },
      ],
      where: {
        user_id: userId,
        ...(title && {
          title: {
            [Op.like]: `%${title}%`,
          },
        }),
      },
      group: ["Template.id"],
      order: [["created_at", order.toUpperCase()]],
      limit: parsedLimit,
      offset: offset,
      subQuery: false,
    });

    const totalCount = await Template.count({
      where: {
        user_id: userId,
        ...(title && {
          title: {
            [Op.like]: `%${title}%`,
          },
        }),
      },
    });

    return {
      templates,
      pagination: {
        currentPage: parsedPage,
        totalPages: Math.ceil(totalCount / parsedLimit),
        total: totalCount,
      },
    };
  },

  getUserFormsWithFilters: async (userId, filters) => {
    const { template_title, order = "desc", page, limit } = filters;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;
    const offset = (parsedPage - 1) * parsedLimit;

    const forms = await FilledForm.findAll({
      attributes: [
        "id",
        "created_at",
        [models.sequelize.col("Template.id"), "template_id"],
        [models.sequelize.col("Template.title"), "template_title"],
        [models.sequelize.col("Template.description"), "template_description"],
      ],
      include: [
        {
          model: Template,
          attributes: [],
          required: true,
          where: template_title
            ? {
                title: {
                  [Op.like]: `%${template_title}%`,
                },
              }
            : {},
        },
      ],
      where: {
        user_id: userId,
      },
      order: [["created_at", order.toUpperCase()]],
      limit: parsedLimit,
      offset: offset,
    });

    const total = await FilledForm.count({
      include: [
        {
          model: Template,
          where: template_title
            ? {
                title: {
                  [Op.like]: `%${template_title}%`,
                },
              }
            : {},
        },
      ],
      where: {
        user_id: userId,
      },
      distinct: true,
    });

    return {
      forms,
      pagination: {
        currentPage: parsedPage,
        totalPages: Math.ceil(total / parsedLimit),
        total,
      },
    };
  },

  getUserTheme: async (userId) => {
    const user = await User.findByPk(userId);
    return user.preferred_theme;
  },

  toggleTheme: async (userId) => {
    const user = await User.findByPk(userId);
    const newTheme = user.preferred_theme === "light" ? "dark" : "light";
    await user.update({ preferred_theme: newTheme });
    return newTheme;
  },

  toggleLike: async (templateId, userId) => {
    const template = await Template.findByPk(templateId);

    if (!template) {
      throw CustomError.notFound("Template not found", 11);
    }

    const existingLike = await Like.findOne({
      where: {
        template_id: templateId,
        user_id: userId,
      },
    });

    if (existingLike) {
      await existingLike.destroy();
      return { liked: false };
    } else {
      await Like.create({
        template_id: templateId,
        user_id: userId,
      });
    }
  },

  addComment: async (templateId, userId, content) => {
    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      throw CustomError.badRequest("Comment content cannot be empty", 37);
    }

    const template = await models.Template.findByPk(templateId);
    if (!template) {
      throw CustomError.notFound("Template not found", 11);
    }

    const comment = await models.Comment.create({
      content: content.trim(),
      template_id: templateId,
      user_id: userId,
    });

    return comment;
  },
};

export default userService;
