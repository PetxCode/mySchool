const mongoose = require("mongoose");
const url =
	"mongodb+srv://schoolManagement:schoolManagement@cluster0.lzdw3.mongodb.net/skulManagement?retryWrites=true&w=majority";

const urls = "mongodb://localhost/schoolManagementDB";

mongoose.connect(urls).then(() => {
	console.log("database connected...");
});

module.exports = mongoose;
