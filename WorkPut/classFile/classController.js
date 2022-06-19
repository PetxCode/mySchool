const adminModel = require("../../model/AdminModel");
const teacherModel = require("../../model/TeacherModel");
const classModel = require("../../model/classModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../../utils/cloudinary");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const createClass = async (req, res) => {
	try {
		const { className } = req.body;

		const getToken = crypto.randomBytes(3).toString("hex");

		const getSchool = await adminModel.findById(req.params.id);

		const getTeacher = await teacherModel.findById(req.params.id);

		const createClass = await new classModel({
			className,
			schoolName: getTeacher.schoolName,
			teacherCode: getTeacher.teacherCode,
			classCode: getToken,
		});

		createClass.teacher = getTeacher;
		createClass.save();

		getTeacher.class.push(mongoose.Types.ObjectId(createClass._id));
		getTeacher.save();

		res.status(200).json({ message: "class created", data: createClass });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const viewSingleClass = async (req, res) => {
	try {
		const user = await classModel.findOne({ teacher: req.params.id });

		if (user) {
			const data = await classModel
				.find()
				.populate({ path: "student", createdAt: -1 });
			res.status(200).json({ data: data });
		}
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const viewClass = async (req, res) => {
	try {
		const getTeacher = await teacherModel
			.findById(req.params.id)
			.populate("class");
		res.status(200).json({ message: "classes found", data: getTeacher });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const deleteClass = async (req, res) => {
	try {
		const getTeacher = await teacherModel.findById(req.params.id);
		const remove = await classModel.findByIdAndRemove(req.params.class);

		getTeacher.class.pull(remove);
		getTeacher.save();

		res.status(200).json({ message: "class deleted" });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

module.exports = {
	deleteClass,
	createClass,
	viewClass,
	viewSingleClass,
};
