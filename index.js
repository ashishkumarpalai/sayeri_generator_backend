const express = require('express');
const cors = require('cors')
const { OpenAIApi, Configuration } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors())
app.use(express.json());

// Set up OpenAI configuration
const openaiConfig = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(openaiConfig);
const history = []
// Endpoint to generate a joke based on the provided keyword
app.get("/",(req,res)=>{
    res.send("wellcome to sayeri app")
})
app.get('/sayeri', async (req, res) => {
    const user_input = `write a sayeri about ${req.query.keyword} ,in the word range between 20 to 50`
    const messages = [];
    for (const [input_text, completion_text] of history) {
        messages.push({ role: "user", content: input_text });
        messages.push({ role: "assistant", content: completion_text });
    }

    messages.push({ role: "user", content: user_input });

    try {
        // Customize this based on your desired prompt and completion settings
        // console.log(messages);
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
        });

        const completion_text = completion.data.choices[0].message.content;
        // console.log(completion_text);
        history.push([user_input, completion_text]);
        res.json({ sayeri: completion_text });
    } catch (error) {
        console.error('OpenAI API request failed:', error);
        res.status(500).json({ error: 'Failed to generate sayeri' });
    }
});

// Start the server
const port = process.env.PORT ;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});