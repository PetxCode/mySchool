const mongoose = require("mongoose");

const classModel = mongoose.Schema(
	{
		schoolName: {
			type: String,
		},
		className: {
			type: String,
		},
		teacherCode: {
			type: String,
		},
		classCode: {
			type: String,
		},
		admin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "admins",
		},

		teacher: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "teachers",
		},

		student: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "students",
			},
		],
	},

	{ timestamps: true }
);

module.exports = mongoose.model("classes", classModel);
