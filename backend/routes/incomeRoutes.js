const express = require("express");

const authController = require("./../controllers/authController");
const incomeController = require("./../controllers/incomeController");

const router = express.Router();

router.use(authController.protect);
router.use(incomeController.appendUserIds);

router.post("/", incomeController.createIncome);
router.get("/", incomeController.getIncomes);
router.delete("/:id", incomeController.deleteIncome);

module.exports = router;