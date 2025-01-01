import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const ChosenOption = sequelize.define(
  "ChosenOption",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    tableName: "chosen_options",
    timestamps: false,
  }
);

export default ChosenOption;
