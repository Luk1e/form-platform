import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const FormAnswer = sequelize.define(
  "FormAnswer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    string_value: DataTypes.STRING(255),
    text_value: DataTypes.TEXT,
    integer_value: DataTypes.INTEGER,
    boolean_value: DataTypes.BOOLEAN,
    single_choice_value: DataTypes.STRING(255),
  },
  {
    tableName: "form_answers",
    timestamps: false,
  }
);

export default FormAnswer;
