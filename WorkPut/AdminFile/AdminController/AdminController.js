const adminModel = require("../../../model/AdminModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const cloudinary = require("../../../utils/cloudinary");

//database
const {
	resetMail,
	verifiedMail,
	reSendMail,
} = require("../../../utils/sendEmail");

const getSchoolTeacher = async (req, res) => {
	try {
		const users = await adminModel
			.findById(req.params.id)
			.populate({ path: "teacher", options: { sort: { createdAt: -1 } } });
		res.status(200).json({ message: "Teachers found", data: users });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const getSchools = async (req, res) => {
	try {
		const users = await adminModel.find().sort({ createdAt: -1 });
		res.status(200).json({ message: "School found", data: users });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const getSchool = async (req, res) => {
	try {
		const users = await adminModel.findById(req.params.id);
		res.status(200).json({ message: "School found", data: users });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const deleteSchool = async (req, res) => {
	try {
		const users = await adminModel.findByIdAndRemove(req.params.id);
		res.status(200).json({ message: "School deleted" });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const updateSchool = async (req, res) => {
	try {
		const {
			schoolProfile,
			fullName,
			schoolName,
			schoolCode,
			phoneNumber,
			displayName,
		} = req.body;

		const image = await cloudinary.uploader.upload(req.file.path);

		const users = await adminModel.findByIdAndUpdate(
			req.params.id,
			{
				fullName,
				schoolName,
				schoolProfile,
				phoneNumber,
				displayName,
				avatar: image.secure_url,
				avatarID: image.public_id,
			},
			{ new: true }
		);
		res.status(200).json({ message: "School updated", data: users });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const createSchool = async (req, res) => {
	try {
		const { fullName, schoolName, phoneNumber, email, password, displayName } =
			req.body;

		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);

		const getToken = crypto.randomBytes(10).toString("hex");
		const token = jwt.sign({ getToken }, "ThisIsTheCode");

		const code = `schoolCode: ${token} ${getToken}`;

		const users = await adminModel.create({
			fullName,
			schoolName,
			schoolCode: code,
			phoneNumber,
			email,
			password: hashed,
			displayName,
			verifiedToken: token,
		});

		verifiedMail(email, users._id);

		res.status(200).json({ message: "Please check your mail to continue" });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const verifiedSchool = async (req, res) => {
	try {
		const user = await adminModel.findById(req.params.id);

		if (user) {
			if (user.verifiedToken !== "") {
				await adminModel.findByIdAndUpdate(
					user._id,
					{
						verifiedToken: "",
						verified: true,

						code: user.schoolCode.split(" ")[2],
					},
					{ new: true }
				);
			}

			res
				.status(200)
				.json({ message: "School's Account Verified, Proceed to Sign In" });
		}
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

const signinSchool = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await adminModel.findOne({ email });

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
					const getToken = crypto.randomBytes(10).toString("hex");
					const token = jwt.sign({ getToken }, "ThisIsTheCode");

					const code = `schoolCode: ${token} ${getToken}`;

					reSendMail(email, user._id, code);

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

const newPasswordRequest = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await adminModel.findOne({ email });

		if (user) {
			if (user.verified && user.verifiedToken === "") {
				const getToken = crypto.randomBytes(10).toString("hex");
				const token = jwt.sign({ getToken }, "ThisIsTheCode");

				const code = `schoolCode: ${token} ${getToken}`;

				await adminModel.findByIdAndUpdate(
					user._id,
					{ verifiedToken: code },
					{ new: true }
				);

				resetMail(email, user._id);

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

		const user = await adminModel.findById(req.params.id);

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
	passwordReset,
	newPasswordRequest,
	signinSchool,
	verifiedSchool,
	createSchool,
	updateSchool,
	deleteSchool,
	getSchool,
	getSchools,
	getSchoolTeacher,
};
