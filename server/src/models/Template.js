import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Template = sequelize.define(
  "Template",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image_url: {
      type: DataTypes.STRING(255),
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "templates",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      {
        type: "FULLTEXT",
        name: "templates_search_idx",
        fields: ["title", "description"],
      },
    ],
  }
);

export default Template;
