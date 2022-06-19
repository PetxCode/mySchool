const mongoose = require("mongoose");

const teacherModel = mongoose.Schema(
	{
		schoolName: {
			type: String,
		},
		schoolCode: {
			type: String,
		},
		teacherCode: {
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
		gender: {
			type: String,
		},
		profile: {
			type: String,
		},
		displayName: {
			type: String,
		},
		phoneNumber: {
			type: Number,
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
			default: "teacher",
		},

		admin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "admins",
		},

		class: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "classes",
			},
		],
	},

	{ timestamps: true }
);

module.exports = mongoose.model("teachers", teacherModel);
