import { Op } from "sequelize";
import models from "../models/index.js";
import { CustomError } from "../utils/index.js";

const { User, Template, FilledForm } = models;

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
        [models.sequelize.col("Template.title"), "template_title"],
      ],
      include: [
        {
          model: Template,
          attributes: [],
          required: true,
          where: template_title
            ? {
                title: {
                  [models.sequelize.Op.like]: `%${template_title}%`,
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

  getAllUsers: async () => {
    const users = await User.findAll();
    return users;
  },

  getUserById: async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
      throw CustomError.notFound("User not found");
    }
    return user;
  },

  updateUser: async (id, username, email) => {
    const user = await User.findByPk(id);
    if (!user) {
      throw CustomError.notFound("User not found");
    }

    await user.update({ username, email });
    return user;
  },

  deleteUser: async (id) => {
    const result = await User.destroy({
      where: { id },
    });

    if (result === 0) {
      throw CustomError.notFound("User not found");
    }
  },
};

export default userService;
