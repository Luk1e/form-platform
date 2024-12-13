import { adminService } from "../services/index.js";
import { CustomError } from "../utils/index.js";

const adminController = {
  searchUsers: async (req, res) => {
    try {
      const result = await adminService.searchUsers(req.query);

      res.json(result);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({
        message: "Error searching users",
        errorCode: "SEARCH_USERS_ERROR",
      });
    }
  },

  bulkBlockUsers: async (req, res) => {
    try {
      const { userIds } = req.body;
      const blockedCount = await adminService.bulkBlockUsers(userIds);

      res.json({
        message: "Users blocked successfully",
        blockedCount,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error blocking users:", error);
      res.status(500).json({
        message: "Error blocking users",
        errorCode: "BLOCK_USERS_ERROR",
      });
    }
  },

  bulkUnblockUsers: async (req, res) => {
    try {
      const { userIds } = req.body;
      const unBlockedCount = await adminService.bulkUnblockUsers(userIds);

      res.json({
        message: "Users unblocked successfully",
        unBlockedCount,
      });
    } catch (error) {
      console.error("Error unblocking users:", error);
      res.status(500).json({
        message: "Error unblocking users",
        errorCode: "UNBLOCK_USERS_ERROR",
      });
    }
  },

  bulkAddAdminPrivileges: async (req, res) => {
    try {
      const { userIds } = req.body;

      const privilegesAddedCount = await adminService.bulkAddAdminPrivileges(
        userIds
      );

      res.json({
        message: "Admin privileges added successfully",
        privilegesAddedCount,
      });
    } catch (error) {
      console.error("Error adding admin privileges:", error);
      res.status(500).json({
        message: "Error adding admin privileges",
        errorCode: "ADD_ADMIN_PRIVILEGES_ERROR",
      });
    }
  },

  bulkRemoveAdminPrivileges: async (req, res) => {
    try {
      const { userIds } = req.body;

      const privilegesRemovedCount =
        await adminService.bulkRemoveAdminPrivileges(userIds);

      res.json({
        message: "Admin privileges removed successfully",
        privilegesRemovedCount,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error removing admin privileges:", error);
      res.status(500).json({
        message: "Error removing admin privileges",
        errorCode: "REMOVE_ADMIN_PRIVILEGES_ERROR",
      });
    }
  },

  bulkDeleteUsers: async (req, res) => {
    try {
      const { userIds } = req.body;

      const deletedCount = await adminService.bulkDeleteUsers(userIds);

      res.json({
        message: "Users deleted successfully",
        deletedCount,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error deleting users:", error);
      res.status(500).json({
        message: "Error deleting users",
        errorCode: "DELETE_USERS_ERROR",
      });
    }
  },
};

export default adminController;
