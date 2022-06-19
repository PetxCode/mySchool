const adminModel = require("../../model/AdminModel");
const expenseModel = require("../../model/expenseModel");
const mongoose = require("mongoose");

const createExpense = async (req, res) => {
	try {
		const {
			totalCost,
			itemName,
			itemQuantity,
			expenseAmount,
			sourcePurchase,
		} = req.body;

		const getAdmin = await adminModel.findById(req.params.id);

		const createExp = await new expenseModel({
			totalCost,
			itemName,
			itemQuantity,
			expenseAmount,
			sourcePurchase,
		});

		createExp.admin = getAdmin;
		createExp.save();

		getAdmin.expense.push(mongoose.Types.ObjectId(createExp._id));
		getAdmin.save();

		res.status(200).json({ message: "Expense Added", data: createExp });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const getExpense = async (req, res) => {
	try {
		const getAdmin = await adminModel
			.findById(req.params.id)
			.populate("expense");

		res.status(200).json({ message: "Expense found", data: getAdmin });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const removeExpense = async (req, res) => {
	try {
		const getAdmin = await adminModel.findById(req.params.id);
		const getExpense = await expenseModel.findByIdAndRemove(req.params.expense);

		getAdmin.expense.pull(getExpense);
		getAdmin.save();

		res.status(200).json({ message: "Expense deleted" });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

module.exports = {
	removeExpense,
	getExpense,
	createExpense,
};
