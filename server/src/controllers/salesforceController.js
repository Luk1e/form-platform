import { salesforceService } from "../services/index.js";
import { CustomError } from "../utils/index.js";

const salesforceController = {
  getSalesforceDetails: async (req, res) => {
    try {
      const userId = req.userId;

      const result = await salesforceService.getSalesforceDetails(userId);

      res.status(200).json(result);
    } catch (error) {
      console.error("Error getting Salesforce details:", error);
      res.status(500).json({
        message: "Error getting Salesforce details",
        errorCode: "GET_USERS_SALESFORCE_DETAILS_ERROR",
      });
    }
  },
  createSalesforceAccount: async (req, res) => {
    try {
      const userId = req.userId;

      const result = await salesforceService.createSalesforceAccount(
        userId,
        req.body
      );

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.toJSON());
      }

      console.error("Error creating Salesforce account:", error);
      res.status(500).json({
        message: "Error creating Salesforce account",
        errorCode: "CREATE_USERS_SALESFORCE_ACCOUNT_ERROR",
      });
    }
  },
};

export default salesforceController;
