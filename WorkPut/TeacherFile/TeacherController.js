const adminModel = require("../../model/AdminModel");
const teacherModel = require("../../model/TeacherModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../../utils/cloudinary");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const {
	verifiedTeacherMail,
	reSendTeacherMail,
	resetTeacherMail,
} = require("../../utils/sendEmail");

const createTeacher = async (req, res) => {
	try {
		const {
			fullName,
			schoolName,
			code,
			phoneNumber,
			email,
			password,
			displayName,
		} = req.body;

		const getURL = await adminModel.findOne({ code });

		if (getURL) {
			const getSchool = await adminModel.findById(getURL._id);

			const salt = await bcrypt.genSalt(10);
			const hashed = await bcrypt.hash(password, salt);

			if (getSchool.schoolName === schoolName && getSchool.code === code) {
				const newTeacher = new teacherModel({
					fullName,
					schoolName,
					schoolCode: code,
					phoneNumber,
					email,
					password: hashed,
					displayName,
					verifiedToken: getSchool.schoolCode,
				});

				newTeacher.admin = getSchool;
				newTeacher.save();

				getSchool.teacher.push(mongoose.Types.ObjectId(newTeacher._id));
				getSchool.save();

				verifiedTeacherMail(email, newTeacher._id, code);

				res.status(200).json({ message: "Please check your mail to continue" });
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

const verifiedTeacher = async (req, res) => {
	try {
		const user = await teacherModel.findById(req.params.id);

		const getToken = crypto.randomBytes(5).toString("hex");
		if (user) {
			if (user.verifiedToken !== "") {
				await teacherModel.findByIdAndUpdate(
					user._id,
					{
						teacherCode: getToken,
						verifiedToken: "",
						verified: true,
					},
					{ new: true }
				);

				res
					.status(200)
					.json({ message: "Teacher's Account Verified, Proceed to Sign In" });
			}
		}
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const signinTeacher = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await teacherModel.findOne({ email });

		if (user) {
			const check = await bcrypt.compare(password, user.password);
			if (check) {
				if (user.verified && user.verifiedToken === "") {
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
					const getToken = crypto.randomBytes(5).toString("hex");
					const token = jwt.sign({ getToken }, "ThisIsTheCode");

					reSendTeacherMail(email, user._id, user.schoolCode);

					res.status(200).json({
						message:
							"Please goto your mail to verify your account before you can sign in",
					});
				}
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

const getTeachers = async (req, res) => {
	try {
		const users = await teacherModel.find().sort({ createdAt: -1 });
		res.status(200).json({ message: "Teachers found", data: users });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const getTeacher = async (req, res) => {
	try {
		const users = await teacherModel.findById(req.params.id).populate("admin");
		res.status(200).json({ message: "Teacher found", data: users });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const deleteTeacher = async (req, res) => {
	try {
		const getTeacher = await adminModel.findById(req.params.id);
		const remove = await teacherModel.findByIdAndRemove(req.params.teacher);

		getTeacher.teacher.pull(remove);
		getTeacher.save();

		res.status(200).json({ message: "School deleted" });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const updateTeacher = async (req, res) => {
	try {
		const { gender, profile, fullName, phoneNumber, displayName } = req.body;

		const image = await cloudinary.uploader.upload(req.file.path);

		const users = await teacherModel.findByIdAndUpdate(
			req.params.id,
			{
				gender,
				profile,
				fullName,
				phoneNumber,
				displayName,
				avatar: image.secure_url,
				avatarID: image.public_id,
			},
			{ new: true }
		);
		res.status(200).json({ message: "teacher profile updated", data: users });
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

				resetTeacherMail(email, user);

				res.status(200).json({
					message:
						"Please goto your mail to verify your account before you can sign in",
				});
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
	createTeacher,
	verifiedTeacher,
	signinTeacher,
	getTeacher,
	deleteTeacher,
	updateTeacher,
	passwordReset,
	newPasswordRequest,
	getTeachers,
	getTeacherSchool,
};
