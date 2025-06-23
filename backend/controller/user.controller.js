const bcrypt = require("bcrypt");
const User = require("../model/user.model");
exports.listUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "email", "pseudo", "role", "createAt"],
  });
  res.json(users);
};
exports.getUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id, {
    attributes: ["id", "email", "pseudo", "role", "createAt"],
  });
  if (!user) {
    return res.status(404).json({ error: "Utilisateur nonn trouvé" });
  }
  res.json(user);
};
