import { useState } from "react";

const App = () => {
	const [value, setValue] = useState("");
	const [error, setError] = useState("");
	const [chatHistory, setChatHistory] = useState([]);

	const surpriseOptions = [
		"Who won the latest Novel Peace Prize?",
		"Where does Pizza come from?",
		"How do you make a BLT sandwich?",
	];

	const surprise = () => {
		const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];

		setValue(randomValue);
	};

	const getResponse = async () => {
		if (!value) {
			setError("Error! Please ask a question!");
			return;
		}
		try {
			const options = {
				method: "POST",
				body: JSON.stringify({
					history: chatHistory,
					message: value,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			};
			const response = await fetch("https://react-gemini-app-backend.vercel.app/gemini", options);
			const data = await response.text();
			console.log(data);
			setChatHistory((oldChatHistory) => [
				...oldChatHistory,
				{
					role: "user",
					parts: [{ text: value }],
				},
				{
					role: "model",
					parts: [{ text: data }],
				},
			]);
			setValue("");
		} catch (err) {
			console.error(err);
			setError("Something went wrong! Please try again later.");
		}
	};

	const clear = () => {
		setValue("");
		setError("");
		setChatHistory([]);
	};

	return (
		<div className="app">
			<p>
				What do you want to know?
				<button
					className="surprise"
					onClick={surprise}
					disabled={!chatHistory}
				>
					Suprise Me!
				</button>
			</p>
			<div className="input-container">
				<input
					type="text"
					value={value}
					placeholder="When is Christmas...?"
					onChange={(e) => setValue(e.target.value)}
				/>
				{!error && <button onClick={getResponse}>Ask Me</button>}
				{error && <button onClick={clear}>Clear</button>}
			</div>
			{error && <p>{error}</p>}

			<div className="search-result">
				{chatHistory.map((chatItem, index) => (
					<div key={index}>
						<p className="answer">
							{chatItem.role}: {chatItem.parts.map((item) => item.text)}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default App;
