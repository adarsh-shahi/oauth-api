"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const qs_1 = __importDefault(require("qs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.get("/", (req, res, next) => {
    res.send("Welcome to Home");
});
app.get("/done", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    const url = `https://oauth2.googleapis.com/token`;
    const values = {
        code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
    };
    console.log(qs_1.default.stringify(values));
    console.log("SIKE");
    try {
        const response = yield fetch(`${url}?${qs_1.default.stringify(values)}`, {
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoding",
            },
        });
        const data = yield response.json();
        console.log(data);
        const { id_token, access_token } = data;
        console.log(id_token, access_token);
        // get google user
        //1) in id token you will have all the details of google user just decode it
        // const googleUser = jwt.decode(id_token)
        //2) or you can send these ids to client(website) and from there make a http request and then get all google user details
        const googleUserData = yield fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
        });
        const googleUser = yield googleUserData.json();
        console.log("Google User: ");
        console.log(googleUser);
        res.status(200).redirect("http://localhost:3000");
    }
    catch (error) {
        console.log(error);
        res.status(400).send("wrong");
    }
}));
app.listen(5000, () => {
    console.log("Server Running on port: 5000");
});
