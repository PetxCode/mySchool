const express = require("express");
const router = express.Router();
const {
	createExpense,
	removeExpense,
	getExpense,
} = require("./expenseController");

router.route("/:id/").post(createExpense);

router.route("/:id/").get(getExpense);

router.route("/:id/:expense").delete(removeExpense);

module.exports = router;
