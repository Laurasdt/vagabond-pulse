require("dotenv").config();
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");
const User = require("../model/user.model");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection OK");

    const email = process.env.ADMIN_EMAIL || "admin@example.com";
    const password = process.env.ADMIN_PASSWORD || "SuperSecret123!";
    const pseudo = process.env.ADMIN_PSEUDO || "Administrator";

    const [admin, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        pseudo,
        password: await bcrypt.hash(password, 10),
        role: "admin",
      },
    });

    if (created) {
      console.log(`🎉 Admin user created: ${email}`);
    } else {
      console.log(`ℹ️  Admin already exists: ${email}`);

      if (admin.role !== "admin") {
        admin.role = "admin";
        await admin.save();
        console.log("🔧 Role updated to admin");
      }
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
})();
