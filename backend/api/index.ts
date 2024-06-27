import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

const PORT = 3000;
const app: any = express();
app.use(cors());
app.use(express.json());
config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY || "");

app.post("/", (_, res) => {
	res.send("Express");
});

app.post("/gemini", async (req, res) => {
	console.log(req.body);

	const model = genAI.getGenerativeModel({ model: "gemini-pro" });
	const chat = model.startChat({
		history: req.body.history,
	});
	const msg = req.body.message;

	const result = await chat.sendMessage(msg);
	const response = result.response;
	const text = response.text();
	res.send(text);
});

app.listen(PORT, () => {
	console.log(`Listening on Port: ${PORT}`);
});

module.exports = app;
