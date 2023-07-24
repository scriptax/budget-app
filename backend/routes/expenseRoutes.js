const express = require("express");

const authController = require("../controllers/authController");
const expenseController = require("../controllers/expenseController");

const router = express.Router();

router.use(authController.protect);
router.use(expenseController.appendUserIds);

router.post("/", expenseController.createExpense);
router.get("/", expenseController.getExpenses);
router.delete("/:id", expenseController.deleteExpense);

module.exports = router;