import express from "express";
import dotenv from "dotenv";
import qs from "qs";
import jwt from "jsonwebtoken";
dotenv.config();

const app = express();

app.get("/", (req, res, next) => {
	res.send("Welcome to Home");
});

interface IGoogleAuthToken {
	id_token: string;
	access_token: string;
}
app.get("/done", async (req, res, next) => {
	const code = req.query.code as string;

	const url = `https://oauth2.googleapis.com/token`;

	const values = {
		code,
		client_id: process.env.CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET,
		redirect_uri: process.env.REDIRECT_URI,
		grant_type: "authorization_code",
	};

	console.log(qs.stringify(values));
	console.log("SIKE");
	try {
		const response = await fetch(`${url}?${qs.stringify(values)}`, {
			method: "post",
			headers: {
				"Content-Type": "application/x-www-form-urlencoding",
			},
		});
		const data: any = await response.json();
		const { id_token, access_token } = data;

		// get google user
		//1) in id token you will have all the details of google user just decode it
		// const googleUser = jwt.decode(id_token)

		//2) or you can send these ids to client(website) and from there make a http request and then get all google user details

		const googleUserData = await fetch(
			`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
			{
				headers: {
					Authorization: `Bearer ${id_token}`,
				},
			}
		);

		const googleUser = await googleUserData.json();

		console.log(googleUser);

		res.status(200).redirect("http://localhost:3000")
	} catch (error: any) {
		console.log(error);
		res.status(400).send("wrong");
	}
});

app.listen(5000, () => {
	console.log("Server Running on port: 5000");
});
