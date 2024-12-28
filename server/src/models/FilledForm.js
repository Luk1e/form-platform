import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const FilledForm = sequelize.define(
  "FilledForm",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    tableName: "filled_forms",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default FilledForm;
