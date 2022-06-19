const {
	deleteClass,
	createClass,
	viewClass,
	viewSingleClass,
} = require("./classController");
const express = require("express");
const router = express.Router();

router.route("/:id/student").get(viewSingleClass);
router.route("/:id/").get(viewClass);
router.route("/:id/").post(createClass);
router.route("/:id/:class/").delete(deleteClass);

module.exports = router;
