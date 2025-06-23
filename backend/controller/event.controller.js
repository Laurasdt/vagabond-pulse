const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification de l'existence de l'utilisateur
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      message: "Inscription réussie",
      user: {
        id: newUser.id,
        email: newUser.email,
        pseudo: newUser.pseudo,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
