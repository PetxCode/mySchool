const mongoose = require("mongoose");

const adminModel = mongoose.Schema(
	{
		schoolName: {
			type: String,
		},
		schoolCode: {
			type: String,
		},
		code: {
			type: String,
		},
		fullName: {
			type: String,
		},
		email: {
			type: String,
			unique: true,
		},
		password: {
			type: String,
		},
		displayName: {
			type: String,
		},
		phoneNumber: {
			type: Number,
		},
		schoolProfile: {
			type: String,
		},
		avatar: {
			type: String,
		},
		avatarID: {
			type: String,
		},
		verifiedToken: {
			type: String,
		},
		verified: {
			type: Boolean,
		},
		status: {
			type: String,
			default: "admin",
		},

		teacher: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "teachers",
			},
		],

		expense: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "expenses",
			},
		],
	},

	{ timestamps: true }
);

module.exports = mongoose.model("admins", adminModel);
