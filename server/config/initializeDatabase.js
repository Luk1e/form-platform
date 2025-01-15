import models from "../src/models/index.js";

const initializeDatabase = async () => {
  try {
    await models.sequelize.sync({ alter: true });

    await models.TemplateTopic.bulkCreate(
      [{ name: "Education" }, { name: "Quiz" }, { name: "Other" }],
      { ignoreDuplicates: true }
    );

    await models.QuestionType.bulkCreate(
      [
        { name: "single_line" },
        { name: "multi_line" },
        { name: "integer" },
        { name: "checkbox" },
        { name: "single_choice" },
      ],
      { ignoreDuplicates: true }
    );

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

export default initializeDatabase;
