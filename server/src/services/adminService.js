import { Op } from "sequelize";
import { CustomError } from "../utils/index.js";
import models from "../models/index.js";

const { User, Template, FilledForm } = models;

const adminService = {
  isAdmin: async (userId) => {
    const user = await User.findByPk(userId, {
      attributes: ["is_admin", "is_blocked"],
    });

    if (!user) {
      throw CustomError.notFound("User not found", 0);
    }

    if (user.is_blocked) {
      throw CustomError.forbidden("User is blocked", 2);
    }

    return user.is_admin;
  },

  bulkBlockUsers: async (userIds) => {
    const adminCount = await User.count({
      where: { is_admin: true },
    });

    const adminToBlock = await User.count({
      where: {
        id: { [Op.in]: userIds },
        is_admin: true,
      },
    });

    if (adminToBlock >= adminCount) {
      throw CustomError.forbidden("Cannot block the last admin", 3);
    }

    const [numberOfAffectedRows] = await User.update(
      { is_blocked: true },
      {
        where: { id: { [Op.in]: userIds } },
      }
    );

    return numberOfAffectedRows;
  },

  bulkUnblockUsers: async (userIds) => {
    const [numberOfAffectedRows] = await User.update(
      { is_blocked: false },
      {
        where: { id: { [Op.in]: userIds } },
      }
    );

    return numberOfAffectedRows;
  },

  bulkAddAdminPrivileges: async (userIds) => {
    const [numberOfAffectedRows] = await User.update(
      { is_admin: true },
      {
        where: { id: { [Op.in]: userIds } },
      }
    );

    return numberOfAffectedRows;
  },

  bulkRemoveAdminPrivileges: async (userIds) => {
    const adminCount = await User.count({
      where: { is_admin: true },
    });

    const adminToRemove = await User.count({
      where: {
        id: { [Op.in]: userIds },
        is_admin: true,
      },
    });

    if (adminToRemove >= adminCount) {
      throw CustomError.forbidden("Cannot remove all admins", 4);
    }

    const [numberOfAffectedRows] = await User.update(
      { is_admin: false },
      {
        where: { id: { [Op.in]: userIds } },
      }
    );

    return numberOfAffectedRows;
  },

  bulkDeleteUsers: async (userIds) => {
    const adminCount = await User.count({
      where: { is_admin: true },
    });

    const adminToDelete = await User.count({
      where: {
        id: { [Op.in]: userIds },
        is_admin: true,
      },
    });

    if (adminToDelete >= adminCount) {
      throw CustomError.forbidden("Cannot delete the last admin", 5);
    }

    const numberOfAffectedRows = await User.destroy({
      where: { id: { [Op.in]: userIds } },
    });

    return numberOfAffectedRows;
  },

  searchUsers: async (searchParams) => {
    const {
      search = "",
      is_admin,
      is_blocked,
      page = 1,
      limit = 10,
    } = searchParams;

    const searchConditions = {
      ...(search && {
        [Op.or]: [
          { username: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      }),
      ...(is_admin !== undefined && { is_admin: is_admin === "true" }),
      ...(is_blocked !== undefined && { is_blocked: is_blocked === "true" }),
    };

    const queryOptions = {
      where: searchConditions,
      attributes: [
        "id",
        "username",
        "email",
        "is_admin",
        "is_blocked",
        "created_at",
      ],
      limit: Number(limit),
      offset: (page - 1) * limit,
      order: [["created_at", "DESC"]],
    };

    const { count: totalUsers, rows: users } = await User.findAndCountAll(
      queryOptions
    );

    return {
      users,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    };
  },

  getTemplatesWithFilters: async (filters) => {
    const { search, order = "DESC", page = 1, limit = 10 } = filters;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const searchCondition = search
      ? {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { "$User.username$": { [Op.like]: `%${search}%` } },
            { "$User.email$": { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const queryOptions = {
      attributes: ["id", "title", "created_at"],
      include: [
        {
          model: User,
          attributes: ["username", "email"],
          required: true,
        },
      ],
      where: searchCondition,
      order: [["created_at", order.toUpperCase()]],
      limit: parseInt(limit),
      offset: offset,
    };

    const templates = await Template.findAll(queryOptions);
    const totalCount = await Template.count({
      include: [
        {
          model: User,
          attributes: [],
          required: true,
        },
      ],
      where: searchCondition,
    });

    return {
      templates: templates.map((template) => ({
        id: template.id,
        title: template.title,
        created_at: template.created_at,
        author: {
          username: template.User.username,
          email: template.User.email,
        },
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        total: totalCount,
        limit: parseInt(limit),
      },
    };
  },

  getFormsWithFilters: async (filters) => {
    const { search, order = "DESC", page = 1, limit = 10 } = filters;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const searchCondition = search
      ? {
          [Op.or]: [
            { "$User.username$": { [Op.like]: `%${search}%` } },
            { "$User.email$": { [Op.like]: `%${search}%` } },
            { "$Template.title$": { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const queryOptions = {
      attributes: ["id", "created_at"],
      include: [
        {
          model: User,
          attributes: ["username", "email"],
          required: true,
        },
        {
          model: Template,
          attributes: ["id", "title"],
          required: true,
        },
      ],
      where: searchCondition,
      order: [["created_at", order.toUpperCase()]],
      limit: parseInt(limit),
      offset: offset,
    };

    const filledForms = await FilledForm.findAll(queryOptions);
    const totalCount = await FilledForm.count({
      include: [
        {
          model: User,
          attributes: [],
          required: true,
        },
        {
          model: Template,
          attributes: [],
          required: true,
        },
      ],
      where: searchCondition,
    });

    return {
      forms: filledForms.map((form) => ({
        id: form.id,
        created_at: form.created_at,
        user: {
          username: form.User.username,
          email: form.User.email,
        },
        template: {
          id: form.Template.id,
          title: form.Template.title,
        },
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        total: totalCount,
        limit: parseInt(limit),
      },
    };
  },
};

export default adminService;
