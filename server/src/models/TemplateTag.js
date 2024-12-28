import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const TemplateTag = sequelize.define(
  "TemplateTag",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: "template_tags",
    timestamps: false,
  }
);

export default TemplateTag;
