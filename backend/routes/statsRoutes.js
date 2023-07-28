const express = require("express");

const authController = require("./../controllers/authController");
const statsController = require("./../controllers/statsController");

const router = express.Router();

router.use(authController.protect);
router.get("/expense-report", statsController.expenseData);
router.get("/income-report", statsController.incomeData);
router.get("/saving-report", statsController.savingData);

router.get("/expense-breakdown", statsController.expenseBreakdown);

module.exports = router;