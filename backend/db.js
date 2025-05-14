const mysql = require("mysql2"); // mysql2 est une bibliothèque pour se connecter à MySQL
const dotenv = require("dotenv");

dotenv.config();

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // Port pour Mamp
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Connexion BDD MySQL réussie !!");
  }
});

module.exports = db;
