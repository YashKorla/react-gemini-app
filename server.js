import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PORT = 8000;
const app = express();
config();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

app.post("/gemini", async (req, res) => {
	console.log(req.body);

	const model = genAI.getGenerativeModel({ model: "gemini-pro" });
	const chat = model.startChat({
		history: req.body.history,
	});
	const msg = req.body.message;

	const result = await chat.sendMessage(msg);
	const response = await result.response;
	const text = response.text();
	res.send(text);
});

app.listen(PORT, () => {
	console.log(`Listening on Port: ${PORT}`);
});
