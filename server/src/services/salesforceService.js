import jsforce from "jsforce";
import models from "../models/index.js";
import { CustomError } from "../utils/index.js";
import { SALESFORCE } from "../../config/environment.js";
const { User, sequelize } = models;

const salesforceService = {
  createSalesforceAccount: async (userId, userData) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      accountType,
      company,
      companyPhone,
      companyWebsite,
    } = userData;

    const conn = new jsforce.Connection({
      loginUrl: SALESFORCE.SF_LOGIN_URL,
    });

    const transaction = await sequelize.transaction();

    try {
      await conn.login(
        SALESFORCE.SF_USERNAME,
        SALESFORCE.SF_PASSWORD + SALESFORCE.SF_SECURITY_TOKEN
      );

      const user = await User.findByPk(userId, { transaction });

      if (user.salesforce_contact_id) {
        await transaction.rollback();
        throw CustomError.conflict(
          "User already has a Salesforce account",
          104
        );
      }

      let accountResult;
      if (accountType === "business") {
        accountResult = await conn.sobject("Account").create({
          Name: company,
          Phone: companyPhone,
          Website: companyWebsite,
          Type: "Customer - Direct",
        });
      } else {
        accountResult = await conn.sobject("Account").create({
          Name: `${firstName} ${lastName}`,
          Type: "Customer - Consumer",
        });
      }

      if (!accountResult.success) {
        await transaction.rollback();
        throw CustomError.internal("Failed to create Salesforce account", 105);
      }

      const contactData = {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Phone: phone,
        AccountId: accountResult.id,
      };

      if (accountType === "business") {
        Object.assign(contactData, {
          Title: "Primary Contact",
          Department: "Management",
        });
      }

      const contactResult = await conn.sobject("Contact").create(contactData);

      if (!contactResult.success) {
        await transaction.rollback();
        throw CustomError.internal("Failed to create Salesforce contact", 106);
      }

      if (accountType === "business") {
        const opportunityResult = await conn.sobject("Opportunity").create({
          Name: `${company} - Initial Opportunity`,
          AccountId: accountResult.id,
          StageName: "Prospecting",
          CloseDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          Amount: 0,
        });

        if (!opportunityResult.success) {
          await transaction.rollback();
          throw CustomError.internal(
            "Failed to create Salesforce opportunity",
            108
          );
        }
      }

      await user.update(
        {
          salesforce_account_id: accountResult.id,
          salesforce_contact_id: contactResult.id,
          account_type: accountType,
        },
        { transaction }
      );

      await transaction.commit();

      return {
        message: "Salesforce account created successfully",
        data: {
          accountId: accountResult.id,
          contactId: contactResult.id,
          accountType,
        },
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  getSalesforceDetails: async (userId) => {
    const user = await User.findByPk(userId);

    return {
      salesforce_account_id: user.salesforce_account_id,
      salesforce_contact_id: user.salesforce_contact_id,
    };
  },
};

export default salesforceService;
