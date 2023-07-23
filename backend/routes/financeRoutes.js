const express = require("express");

const authController = require("./../controllers/authController");
const financeController = require("./../controllers/financeController");

const router = express.Router();

router.use(authController.protect);

router.post("/budget", financeController.appendUserIds, financeController.createBudget);
router.route("/budget/:id")
  .get(financeController.getBudget)
  .patch(financeController.updateBudget)
  .delete(financeController.deleteBudget);

module.exports = router;