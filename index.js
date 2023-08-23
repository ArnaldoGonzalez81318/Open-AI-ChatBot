const OpenAI = require('openai');

require('dotenv').config({ path: './.env' })

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.EXPRESS_PORT;

app.use(bodyParser.json());
app.use(cors());

app.post('/', async (req, res) => {
  const { message } = req.body;
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }]
  });
  if (chatCompletion.data.choices[0].message.content) {
    res.send(JSON.stringify({
      message: chatCompletion.data.choices[0].message.content
    }));
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port} 🚀`);
});