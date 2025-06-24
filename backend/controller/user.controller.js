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
    return res.status(404).json({ error: "Utilisateur non trouvé" });
  }
  res.json(user);
};
exports.updateUser = async (req, res) => {
  const { email, pseudo, role, password } = req.body;
  const targetId = req.params.id;
  const data = { email, pseudo, role };
  if (password) {
    data.password = await bcrypt.hash(password, 9);
  }
  const [updated] = await User.updated(data, {
    where: { id: targetId },
  });
  if (!updated) {
    return res.status(404).json({ error: "Utilisateur introuvable" });
  }
  res.json({ message: "Utilisateur mis à jour" });
};
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.destroy({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return res.status(404).json({ error: "Suppression érronée" });
  }
  res.json({ message: "Utilisateur supprimé" });
};
