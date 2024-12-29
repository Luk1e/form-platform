import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const QuestionType = sequelize.define(
  "QuestionType",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.ENUM(
        "single_line",
        "multi_line",
        "integer",
        "checkbox",
        "single_choice"
      ),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "question_types",
    timestamps: false,
  }
);

export default QuestionType;
