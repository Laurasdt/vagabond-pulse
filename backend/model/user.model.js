const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class User extends Model {}

User.init(
  {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    pseudo: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
  },
  { sequelize: sequelize, modelName: "user" }
);

module.exports = User;
