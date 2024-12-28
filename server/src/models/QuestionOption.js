import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const QuestionOption = sequelize.define(
  "QuestionOption",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    value: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "question_options",
    timestamps: false,
  }
);

export default QuestionOption;
