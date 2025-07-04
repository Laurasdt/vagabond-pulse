const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Memory = require("../model/memory.model");
const User = require("../model/user.model");

// création du dossier uploads (si pas existant)
const MemoryFolder = path.join(__dirname, "..", "uploads", "memories");
if (!fs.existsSync(MemoryFolder)) {
  fs.mkdirSync(MemoryFolder, { recursive: true });
}

// config stockage fichiers avec Multer + renommage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, MemoryFolder),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `mem_${Date.now()}${extension}`);
  },
});

// config de multer + de la sécurité
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLocaleLowerCase();
    if (extension === ".php") {
      return cb(new Error("Les fichiers php ne sont pas autorisés"), false);
    }
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Seules les images sont autorisées"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5mb
});
exports.upload = upload.single("file");

// après upload, création de memory
exports.createMemory = async (req, res) => {
  try {
    const { userId, description } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Identifiant manquant" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Fichier manquant" });
    }
    const urlPhoto = `/uploads/memories/${req.file.filename}`;
    // sauvegardes de memory dans BDD
    const memory = await Memory.create({
      userId,
      photoUrl: urlPhoto,
      description,
    });
    return res.status(201).json({
      id: memory.id,
      userId: memory.userId,
      photoUrl: memory.photoUrl,
      description: memory.description,
    });
  } catch (error) {
    console.log("Erreur de création", error);
    if (
      error.message.includes("non autorisé") ||
      error.message.includes("autorisé")
    ) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erreur du serveur" });
  }
};

exports.getAllMemories = async (req, res) => {
  try {
    const memoriesData = await Memory.findAll({
      include: [{ model: User, as: "owner", attributes: ["pseudo"] }],
      order: [["createdAt", "DESC"]],
    });
    const resultats = memoriesData.map((m) => ({
      id: m.id,
      photoUrl: m.photoUrl,
      description: m.description,
      createdAt: m.createdAt,
      owner: m.owner ? m.owner.pseudo : "Utilisateur inconnu",
    }));
    return res.json(resultats);
  } catch (error) {
    return res.status(500).json({ error: "Erreur du serveur" });
  }
};

exports.getUserMemoryData = async (req, res) => {
  try {
    const { userId } = req.params;
    const memories = await Memory.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    const userMemoryData = memories.map((m) => ({
      id: m.id,
      photoUrl: m.photoUrl,
      description: m.description,
      createdAt: m.createdAt,
    }));
    return res.json(userMemoryData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erreur internale" });
  }
};

exports.deleteMemory = async (req, res) => {
  try {
    const id = req.params.id;
    const memory = await Memory.findByPk(id);
    if (!memory) {
      return res.status(404).json({ error: "Memory introuvable" });
    }
    const filename = path.basename(memory.photoUrl);
    const filePath = path.join(MemoryFolder, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await memory.destroy();
    res.json({ message: "memory supprimée avec succés" });
  } catch (error) {
    console.log("erreur de la suppression de la memory", error);
    res.status(500).json({ error: "erreur internale" });
  }
};
