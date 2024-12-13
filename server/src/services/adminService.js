import database from "../../config/database.js";
import { CustomError } from "../utils/index.js";

const adminService = {
  isAdmin: async (userId) => {
    const [rows] = await database.query(
      "SELECT is_admin, is_blocked FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      throw CustomError.notFound("User not found");
    }

    const user = rows[0];
    if (user.is_blocked) {
      throw CustomError.forbidden("User is blocked");
    }

    return user.is_admin;
  },

  bulkBlockUsers: async (userIds) => {
    const [adminCount] = await database.query(
      "SELECT COUNT(*) as count FROM users WHERE is_admin = TRUE"
    );

    const [adminToBlock] = await database.query(
      `SELECT COUNT(*) as count FROM users 
         WHERE id IN (?) AND is_admin = TRUE`,
      [userIds]
    );

    if (adminToBlock[0].count >= adminCount[0].count) {
      throw CustomError.forbidden("Cannot block the last admin");
    }

    const [result] = await database.query(
      "UPDATE users SET is_blocked = TRUE WHERE id IN (?)",
      [userIds]
    );

    return result.affectedRows;
  },

  bulkUnblockUsers: async (userIds) => {
    const [result] = await database.query(
      "UPDATE users SET is_blocked = FALSE WHERE id IN (?)",
      [userIds]
    );

    return result.affectedRows;
  },

  bulkAddAdminPrivileges: async (userIds) => {
    const [result] = await database.query(
      "UPDATE users SET is_admin = TRUE WHERE id IN (?)",
      [userIds]
    );

    return result.affectedRows;
  },

  bulkRemoveAdminPrivileges: async (userIds) => {
    const [adminCount] = await database.query(
      "SELECT COUNT(*) as count FROM users WHERE is_admin = TRUE"
    );

    const [adminToRemove] = await database.query(
      `SELECT COUNT(*) as count FROM users 
         WHERE is_admin = TRUE AND id IN (?)`,
      [userIds]
    );

    if (adminToRemove[0].count >= adminCount[0].count) {
      throw CustomError.forbidden("Cannot remove all admins");
    }

    const [result] = await database.query(
      "UPDATE users SET is_admin = FALSE WHERE id IN (?)",
      [userIds]
    );

    return result.affectedRows;
  },

  bulkDeleteUsers: async (userIds) => {
    const [adminCount] = await database.query(
      "SELECT COUNT(*) as count FROM users WHERE is_admin = TRUE"
    );

    const [adminToDelete] = await database.query(
      `SELECT COUNT(*) as count FROM users 
         WHERE id IN (?) AND is_admin = TRUE`,
      [userIds]
    );

    if (adminToDelete[0].count >= adminCount[0].count) {
      throw CustomError.forbidden("Cannot delete the last admin");
    }

    const [result] = await database.query("DELETE FROM users WHERE id IN (?)", [
      userIds,
    ]);

    return result.affectedRows;
  },

  searchUsers: async (searchParams) => {
    const {
      search = "",
      is_admin,
      is_blocked,
      page = 1,
      limit = 10,
    } = searchParams;

    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];

    if (search) {
      conditions.push("(username LIKE ? OR email LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    if (is_admin !== undefined) {
      conditions.push("is_admin = ?");
      params.push(is_admin === "true");
    }

    if (is_blocked !== undefined) {
      conditions.push("is_blocked = ?");
      params.push(is_blocked === "true");
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [countRows] = await database.query(
      `
        SELECT COUNT(*) as total 
        FROM users 
        ${whereClause}
    `,
      params
    );

    const [rows] = await database.query(
      `
        SELECT 
            id, 
            username, 
            email, 
            is_admin, 
            is_blocked, 
            created_at 
        FROM users 
        ${whereClause}
        LIMIT ? OFFSET ?
    `,
      [...params, Number(limit), offset]
    );

    const totalUsers = countRows[0].total;
    const totalPages = Math.ceil(totalUsers / limit);

    return {
      users: rows,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalUsers,
        totalPages,
      },
    };
  },
};

export default adminService;
