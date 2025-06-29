require("dotenv").config();
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");
const User = require("../model/user.model");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connexion BDD OK");

    const [admin, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        pseudo,
        password: await bcrypt.hash(password, 10),
        role: "admin",
      },
    });

    if (created) {
      console.log(`User admin crée: ${email}`);
    } else {
      console.log(`Un admin existe déjà: ${email}`);

      if (admin.role !== "admin") {
        admin.role = "admin";
        await admin.save();
        console.log("Rôle mis à jour à Admin");
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
