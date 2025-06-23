const { DataTypes, Model } = require("sequelize");
const connexion = require("../config/db");
const User = require("./user.model");
class Event extends Model {}
Event.init(
  {
    title: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT },
  },
  { connexion, modelName: "events" }
);

Event.belongsTo(User, { foreignKey: "userId", as: "owner" });
User.hasMany(Event, { foreignKey: "userId", as: "events" });
module.exports = Event;
