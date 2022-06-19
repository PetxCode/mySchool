const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const CLIENT_ID =
	"922981826695-rviuikdrd4rk1kbsake7iusml8qb2ibc.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const CLIENT_REDIRECT = "https://developers.google.com/oauthplayground";
const CLIENT_TOKEN =
	"1//04C7dWmo7YblKCgYIARAAGAQSNwF-L9IrEt7Td5GJtrIEB-g_xad5nm-lvt6tP-RxNPBAoaHu0q1jNXf8c20Bsv89GRyec94Gri4";

const oAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	CLIENT_REDIRECT
);
oAuth2Client.setCredentials({ refresh_token: CLIENT_TOKEN });

//Admin
const verifiedMail = async (email, user) => {
	try {
		const getToken = crypto.randomBytes(10).toString("hex");
		const token = jwt.sign({ getToken }, "ThisIsTheCode");

		const accessToken = await oAuth2Client.getAccessToken();

		const transport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: "skuulkude@gmail.com",
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refresh_token: CLIENT_TOKEN,
				accessToken: accessToken.token,
			},
		});

		const mailOptions = {
			from: "Skuul ✉️ <skuulkude@gmail.com>",
			to: email,
			subject: "Account Verification",
			html: `
            <h3>
                This mail, is for account verification... Please use the <a
                href="http://localhost:3000/api/admin/${user}/${token}"
                >Link to Finish</a> up your account creation 
            </h3>
            `,
		};

		const result = transport.sendMail(mailOptions);
		return result;
	} catch (error) {
		return error;
	}
};

const reSendMail = async (email, user, code) => {
	try {
		const getToken = crypto.randomBytes(10).toString("hex");
		const token = jwt.sign({ getToken }, "ThisIsTheCode");

		const accessToken = await oAuth2Client.getAccessToken();

		const transport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: "skuulkude@gmail.com",
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refresh_token: CLIENT_TOKEN,
				accessToken: accessToken.token,
			},
		});

		const mailOptions = {
			from: "Skuul ✉️ <skuulkude@gmail.com>",
			to: email,
			subject: "Account re-Verification",
			html: `
<h3>
    This mail, is for account verification... Please use the <a
    href="http://localhost:3000/api/admin/${user._id}/${code.split(" ")[-1]}"
    >Link to Finish</a> up your account creation 
</h3>
`,
		};

		const result = transport.sendMail(mailOptions);
		return result;
	} catch (error) {
		return error;
	}
};

const resetMail = async (email, user) => {
	try {
		const getToken = crypto.randomBytes(10).toString("hex");
		const token = jwt.sign({ getToken }, "ThisIsTheCode");

		const accessToken = await oAuth2Client.getAccessToken();

		const transport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: "skuulkude@gmail.com",
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refresh_token: CLIENT_TOKEN,
				accessToken: accessToken.token,
			},
		});

		const mailOptions = {
			from: "Skuul ✉️ <skuulkude@gmail.com>",
			to: email,
			subject: "Reset Password Request",
			html: `
    <h3>
        This mail, is sent because you requested for a password reset... Please use the <a
        href="http://localhost:3000/api/admin/reset/${user._id}/${token}"
        >Link to Finish</a> up your password reset request!  
    </h3>
    `,
		};

		const result = transport.sendMail(mailOptions);
		return result;
	} catch (error) {
		return error;
	}
};

//Teachers
const verifiedTeacherMail = async (email, newTeacher, code) => {
	try {
		const getToken = crypto.randomBytes(10).toString("hex");
		const token = jwt.sign({ getToken }, "ThisIsTheCode");

		const accessToken = await oAuth2Client.getAccessToken();

		const transport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: "skuulkude@gmail.com",
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refresh_token: CLIENT_TOKEN,
				accessToken: accessToken.token,
			},
		});

		const mailOptions = {
			from: "Skuul ✉️ <skuulkude@gmail.com>",
			to: email,
			subject: "Teacher Account Verification",
			html: `
            <h3>
                This mail, is for account verification for Teachers on Skuul platform... Please use the <a
                href="http://localhost:3000/api/teacher/${newTeacher}/${code}"
                >Link to Finish</a> up your account creation 
            </h3>
            `,
		};

		const result = transport.sendMail(mailOptions);
		return result;
	} catch (error) {
		return error;
	}
};

const reSendTeacherMail = async (email, user, code) => {
	try {
		const getToken = crypto.randomBytes(10).toString("hex");
		const token = jwt.sign({ getToken }, "ThisIsTheCode");

		const accessToken = await oAuth2Client.getAccessToken();

		const transport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: "skuulkude@gmail.com",
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refresh_token: CLIENT_TOKEN,
				accessToken: accessToken.token,
			},
		});

		const mailOptions = {
			from: "Skuul ✉️ <skuulkude@gmail.com>",
			to: email,
			subject: "Account re-Verification",
			html: `
<h3>
    This mail, is for account verification... Please use the <a
    href="http://localhost:2331/api/teacher/${user._id}/${user.schoolCode}"
    >Link to Finish</a> up your account creation 
</h3>
`,
		};

		const result = transport.sendMail(mailOptions);
		return result;
	} catch (error) {
		return error;
	}
};

const resetTeacherMail = async (email, user) => {
	try {
		const getToken = crypto.randomBytes(10).toString("hex");
		const token = jwt.sign({ getToken }, "ThisIsTheCode");

		const accessToken = await oAuth2Client.getAccessToken();

		const transport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: "skuulkude@gmail.com",
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refresh_token: CLIENT_TOKEN,
				accessToken: accessToken.token,
			},
		});

		const mailOptions = {
			from: "Skuul ✉️ <skuulkude@gmail.com>",
			to: email,
			subject: "Reset Password Request",
			html: `
    <h3>
        This mail, is sent because you requested for a password reset... Please use the <a
        href="http://localhost:3000/api/admin/reset/${user._id}/${token}"
        >Link to Finish</a> up your password reset request!  
    </h3>
    `,
		};

		const result = transport.sendMail(mailOptions);
		return result;
	} catch (error) {
		return error;
	}
};
module.exports = {
	verifiedTeacherMail,
	reSendTeacherMail,
	resetTeacherMail,
	verifiedMail,
	reSendMail,
	resetMail,
};
