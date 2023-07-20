const express = require("express");

const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
// router.post("/test", authController.test);
// router.post("/account", authController.account);
// router.post("/updatePassword", authController.updatePassword);
// router.post("/deleteAccount", authController.deleteAccount);

module.exports = router;
