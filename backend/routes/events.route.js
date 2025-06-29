const router = require("express").Router();

const { verifyToken } = require("../middleware/auth.middleware");

const eventCtrl = require("../controller/event.controller");

router.get("/", eventCtrl.list);
router.get("/:eventId", eventCtrl.show);

router.post("/", verifyToken, eventCtrl.create);
router.put("/:eventId", verifyToken, eventCtrl.update);
router.delete("/:eventId", verifyToken, eventCtrl.destroy);

module.exports = router;
