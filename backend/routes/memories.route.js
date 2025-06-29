const router = require("express").Router();
const memoryController = require("../controller/memory.controller");
router.post("/", memoryController.upload, memoryController.createMemory);
router.get("/", memoryController.getAllMemories);
router.get("/:userId", memoryController.getUserMemoryData);

module.exports = router;
