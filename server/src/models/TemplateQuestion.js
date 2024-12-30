import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const TemplateQuestion = sequelize.define(
  "TemplateQuestion",
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
    display_in_summary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "template_questions",
    timestamps: false,
    indexes: [
      {
        type: "FULLTEXT",
        name: "template_questions_search_idx",
        fields: ["title", "description"],
      },
    ],
  }
);

export default TemplateQuestion;
