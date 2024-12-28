import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const TemplateTopic = sequelize.define(
  "TemplateTopic",
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
    tableName: "template_topics",
    timestamps: false,
  }
);

export default TemplateTopic;
