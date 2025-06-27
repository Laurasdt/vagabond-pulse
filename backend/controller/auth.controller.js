const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
exports.register = async (req, res) => {
  try {
    const { email, password, pseudo } = req.body;
    const isUserExist = await User.findOne({ where: { email } });
    if (isUserExist) {
      return res.status(400).json({ error: "Account existe déjà" });
    }
    const salt = 10;
    const passwordCrypted = await bcrypt.hash(password, salt);
    const createdUser = await User.create({
      email,
      pseudo,
      password: passwordCrypted,
    });
    return res.status(201).json({
      message: "Inscription réussie",
      user: {
        id: createdUser.id,
        email: createdUser.email,
        pseudo: createdUser.pseudo,
      },
    });
  } catch (error) {
    console.log("register error", error);
    return res.status(500).json({ error: "Erreur internale" });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "email account not found" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Mot de passe incorrect" });
    }
    const generatedToken = jwt.sign(
      {
        id: user.id,
        pseudo: user.pseudo,
        role: user.role,
      },
      process.env.JWT_SECRET.replace(/"/g, ""),
      { expiresIn: "1h" }
    );
    return res.json({
      message: "connexion réussie",
      token: generatedToken,
      user: { id: user.id, pseudo: user.pseudo, role: user.role },
    });
  } catch (error) {
    console.log("loging erreur", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};
