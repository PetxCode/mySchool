//dependencies

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// constants

const CLIENT_ID =
	"922981826695-rviuikdrd4rk1kbsake7iusml8qb2ibc.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REFRESH_TOKEN =
	"1//04C7dWmo7YblKCgYIARAAGAQSNwF-L9IrEt7Td5GJtrIEB-g_xad5nm-lvt6tP-RxNPBAoaHu0q1jNXf8c20Bsv89GRyec94Gri4";
const REDIRECT_URL = "https://developers.google.com/oauthplayground";

const oAuth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

oAuth.setCredentials({ refreshToken: REFRESH_TOKEN });

//start

const reVerifiedEmail = async (email, code) => {
	try {
		const getToken = crypto.randomBytes(10).toString("hex");
		const token = jwt.sign({ getToken }, "ThisIsTheCode");

		const access = await oAuth.getAccessToken();
		const transport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refreshToken: CLIENT_TOKEN,
				accessToken: access.token,
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

		transport.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err.message);
			} else {
				console.log(`message sent to your mail ${info.response}`);
			}
		});
	} catch (error) {
		return error;
	}
};

const passwordResetEmail = async (email) => {
	try {
		const getToken = crypto.randomBytes(10).toString("hex");
		const token = jwt.sign({ getToken }, "ThisIsTheCode");

		const access = await oAuth.getAccessToken();
		const transport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refreshToken: CLIENT_TOKEN,
				accessToken: access.token,
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

		transport.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err.message);
			} else {
				console.log(`message sent to your mail ${info.response}`);
			}
		});
	} catch (error) {
		return error;
	}
};

const verifiedEmail = async (email, user) => {
	try {
		const getToken = crypto.randomBytes(10).toString("hex");
		const token = jwt.sign({ getToken }, "ThisIsTheCode");

		const access = await oAuth.getAccessToken();
		const transport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: "skuulkude@gmail.com",
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refreshToken: REFRESH_TOKEN,
				accessToken: access.token,
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

module.exports = { verifiedEmail, reVerifiedEmail, passwordResetEmail };
