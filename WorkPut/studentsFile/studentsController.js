const adminModel = require("../../model/AdminModel");
const teacherModel = require("../../model/TeacherModel");
const classModel = require("../../model/classModel");
const studentModel = require("../../model/studentModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../../utils/cloudinary");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const transport = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "Gideonekeke64@gmail.com",
		pass: "sgczftichnkcqksx",
	},
});

const createStudent = async (req, res) => {
	try {
		const { fullName, teacherCode, classCode } = req.body;

		const getURL = await classModel.findOne({ classCode });

		if (getURL) {
			const getToken = crypto.randomBytes(2).toString("hex");

			const getSchool = await classModel.findById(getURL._id);

			const salt = await bcrypt.genSalt(10);
			const hashed = await bcrypt.hash(fullName, salt);

			const emailData = getSchool.schoolName.split(" ")[0];
			const emailData1 = fullName.replace(/[" "]/g, "");

			if (
				getSchool.teacherCode === teacherCode &&
				getSchool.classCode === classCode
			) {
				const newTeacher = new studentModel({
					fullName,
					schoolName: getSchool.schoolName,
					email: `${emailData1}@${emailData}.com`,
					password: hashed,
					verifiedToken: getSchool.schoolCode,
					studentCode: getToken,
					teachCode: getSchool.teachCode,
					classCode: getSchool.classCode,
				});

				newTeacher.class = getSchool;
				newTeacher.save();

				getSchool.student.push(mongoose.Types.ObjectId(newTeacher._id));
				getSchool.save();

				res
					.status(200)
					.json({ message: "You can now sign in", data: newTeacher });
			} else {
				res.status(404).json({
					message: "Data fields are incorrect: School Name or School Code",
				});
			}
		} else {
			res.status(404).json({
				message:
					"something is wrong with the CODE... Please check and CORRECT!",
			});
		}
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const signinStudent = async (req, res) => {
	try {
		const { email, password, classCode, schoolName } = req.body;

		const findSchool = await adminModel.findOne({ schoolName });
		const findCode = await classModel.findOne({ classCode });
		const user = await studentModel.findOne({ email });

		if (user && findCode && findSchool) {
			const check = await bcrypt.compare(password, user.password);
			if (check) {
				const { password, ...info } = user._doc;

				const token = jwt.sign(
					{
						_id: user._id,
						verified: user.verified,
						status: user.status,
					},
					"ThisIsTheCode",
					{ expiresIn: "2d" }
				);

				res.status(200).json({
					message: `Welcome back ${user.fullName}`,
					data: { token, ...info },
				});
			} else {
				res.status(404).json({ message: "Password isn't correct" });
			}
		} else {
			res.status(404).json({ message: "user isn't present" });
		}
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const getTeacherSchool = async (req, res) => {
	try {
		// const users = await teacherModel.findById(req.params.id);

		const users = await teacherModel.findById(req.params.id).populate("admin");
		res.status(200).json({ message: "Teacher found", data: users });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const getStudents = async (req, res) => {
	try {
		const users = await studentModel.find().sort({ createdAt: -1 });
		res.status(200).json({ message: "Student found", data: users });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const getStudent = async (req, res) => {
	try {
		const users = await classModel.findById(req.params.id).populate("student");
		res.status(200).json({ message: "Student found", data: users });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const deleteStudent = async (req, res) => {
	try {
		const getTeacher = await classModel.findById(req.params.id);
		const remove = await studentModel.findByIdAndRemove(req.params.student);

		getTeacher.student.pull(remove);
		getTeacher.save();

		res.status(200).json({ message: "STudent deleted" });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const updateStudent = async (req, res) => {
	try {
		const { gender, profile, phoneNumber, displayName } = req.body;

		const image = await cloudinary.uploader.upload(req.file.path);

		const users = await studentModel.findByIdAndUpdate(
			req.params.id,
			{
				gender,
				profile,
				phoneNumber,
				displayName,
				avatar: image.secure_url,
				avatarID: image.public_id,
			},
			{ new: true }
		);
		res.status(200).json({ message: "Student's profile updated", data: users });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const newPasswordRequest = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await teacherModel.findOne({ email });

		if (user) {
			if (user.verified && user.verifiedToken === "") {
				const getToken = crypto.randomBytes(10).toString("hex");
				const token = jwt.sign({ getToken }, "ThisIsTheCode");

				const code = `schoolCode: ${token} ${getToken}`;

				await teacherModel.findByIdAndUpdate(
					user._id,
					{ verifiedToken: code },
					{ new: true }
				);
				res.status(201).json({ message: "now you can proceed" });
			} else {
				res
					.status(404)
					.json({ message: "Please try to verify your account first" });
			}
		}
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const passwordReset = async (req, res) => {
	try {
		const { password } = req.body;

		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);

		const user = await teacherModel.findById(req.params.id);

		if (user) {
			if (user.verified && user.verifiedToken !== "") {
				await adminModel.findByIdAndUpdate(
					user._id,
					{
						password: hashed,
						verifiedToken: "",
					},
					{ new: true }
				);
			}
		}

		res.status(200).json({ message: "School's password has been changed" });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

module.exports = {
	createStudent,
	signinStudent,
	deleteStudent,
	getStudents,
	updateStudent,
	getStudent,
	passwordReset,
	newPasswordRequest,
};
