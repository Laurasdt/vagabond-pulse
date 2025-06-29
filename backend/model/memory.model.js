const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
class Memory extends Model {}
Memory.init(
  {
    photoUrl: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
  },
  { sequelize, modelName: "memory" }
);
Memory.belongsTo(User, { foreignKey: "userId", as: "owner" });
User.hasMany(Memory, { foreignKey: "userId", as: "memories" });
module.exports = Memory;
