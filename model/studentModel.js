const mongoose = require("mongoose");

const studentModel = mongoose.Schema(
	{
		schoolName: {
			type: String,
		},

		schoolCode: {
			type: String,
		},

		studentCode: {
			type: String,
		},

		teachCode: {
			type: String,
		},

		classCode: {
			type: String,
		},

		fullName: {
			type: String,
		},

		email: {
			type: String,
			unique: true,
			trim: true,
			lowercase: true,
		},

		password: {
			type: String,
		},

		displayName: {
			type: String,
		},

		avatar: {
			type: String,
		},
		avatarID: {
			type: String,
		},

		verified: {
			type: Boolean,
			default: true,
		},

		admin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "admins",
		},

		profile: {
			type: String,
		},

		gender: {
			type: String,
		},

		teacher: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "teachers",
		},

		status: {
			type: String,
			default: "student",
		},

		class: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "classes",
		},
	},

	{ timestamps: true }
);

module.exports = mongoose.model("students", studentModel);
