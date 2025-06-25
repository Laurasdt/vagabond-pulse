const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const eventController = require("../controller/event.controller");
router.get("/", eventController.list);
router.get("/:eventId", eventController.show);
router.post("/", authMiddleware.verifyToken, eventController.create);
router.put("/:eventId", authMiddleware.verifyToken, eventController.udpdate);
router.delete("/:eventId", authMiddleware.verifyToken, eventController.destory);
module.exports = router;
