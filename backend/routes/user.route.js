const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/role.middleware");
const userController = require("../controller/user.controller");

router.use(auth.verifyToken, isAdmin);
router.get("/", userController.listUsers);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
