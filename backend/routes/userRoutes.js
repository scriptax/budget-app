const express = require("express");

const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.patch("/updatePassword", authController.protect, authController.updatePassword);

// router.post("/test", authController.test);
// router.post("/account", authController.account);
router.use(authController.protect);
router.delete("/deleteAccount", userController.deleteAccount);

module.exports = router;
