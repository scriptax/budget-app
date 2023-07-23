const express = require("express");

const authController = require("./../controllers/authController");
const financeController = require("./../controllers/financeController");

const router = express.Router();

router.use(authController.protect);
router.use(financeController.appendUserIds);

router.post("/budget", financeController.createBudget);

module.exports = router;