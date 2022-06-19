const mongoose = require("mongoose");
const expenseModel = mongoose.Schema(
	{
		itemName: {
			type: String,
		},
		itemQuantity: {
			type: Number,
		},
		expenseAmount: {
			type: Number,
		},
		sourcePurchase: {
			type: String,
		},
		totalCost: {
			type: Number,
		},

		admin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "admins",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("expenses", expenseModel);
