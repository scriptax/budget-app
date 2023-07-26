const express = require("express");

const authController = require("../controllers/authController");
const budgetController = require("../controllers/budgetController");

const router = express.Router();

router.use(authController.protect);
router.use(budgetController.appendUserIds);

router.post("/", budgetController.createBudget);
router
  .route("/:id")
  .get(budgetController.getBudget)
  .patch(budgetController.updateBudget, budgetController.closeBudget)
  .delete(budgetController.deleteBudget);

module.exports = router;
