const express = require('express');

const authController = require("./../controllers/authController");

const router = express.Router();
console.log(authController)
router.post("/signup", authController.signup);
router.post("/login", authController.login);
// router.post("/test", authController.test);
// router.post("/logout", authController.logout);
// router.post("/account", authController.account);
// router.post("/updatePassword", authController.updatePassword);
// router.post("/deleteAccount", authController.deleteAccount);

module.exports = router;