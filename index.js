const express = require("express");
require("./utils/db");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 2331;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json({ message: "We are ready...!" });
});

app.use("/api/admin", require("./WorkPut/AdminFile/AdminRouter/AdminRouter"));
app.use("/api/teacher", require("./WorkPut/TeacherFile/TeacherRouter"));
app.use("/api/class", require("./WorkPut/classFile/classRouter"));
app.use("/api/student", require("./WorkPut/studentsFile/studentRouter"));
app.use("/api/expense", require("./WorkPut/Expense/ExpensesRoute"));

app.listen(port, () => {
	console.log("server is now connected");
});
