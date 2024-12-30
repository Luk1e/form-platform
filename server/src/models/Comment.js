import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "comments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      {
        type: "FULLTEXT",
        name: "comments_search_idx",
        fields: ["content"],
      },
    ],
  }
);

export default Comment;
