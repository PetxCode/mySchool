const {
	createTeacher,
	verifiedTeacher,
	signinTeacher,

	getTeachers,
	getTeacher,
	deleteTeacher,
	updateTeacher,
	passwordReset,
	newPasswordRequest,
	getTeacherSchool,
} = require("../TeacherFile/TeacherController");

const upload = require("../../utils/multer");
const express = require("express");
const router = express.Router();

router.route("/").get(getTeachers);

router.route("/register").post(createTeacher);

router.route("/signin").post(signinTeacher);

router.route("/:id/:token").get(verifiedTeacher);

router.route("/reset").post(newPasswordRequest);
router.route("/reset/:id/:token").post(passwordReset);

// router.route("/:id/school").get(getTeacherSchool);
router.route("/:id").get(getTeacher);

router
	.route("/:id")
	// .get(getTeacher)
	.patch(upload, updateTeacher)
	.delete(deleteTeacher);

module.exports = router;
