import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Like = sequelize.define(
  "Like",
  {},
  {
    tableName: "likes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default Like;
