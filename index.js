import OpenAI from 'openai';
import cors from 'cors';
import express from 'express';
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
const port = Number(process.env.EXPRESS_PORT ?? 3001);

app.use(cors());
app.use(express.json({ limit: '16mb' }));

app.post('/', async (req, res) => {
  const { message, history } = req.body ?? {};

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'A user message is required.' });
  }

  const normalizedHistory = Array.isArray(history)
    ? history
      .filter((entry) => typeof entry?.role === 'string' && typeof entry?.content === 'string')
      .map((entry) => ({ role: entry.role, content: entry.content }))
    : [];

  try {
    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content:
            'You are a concise, friendly assistant that helps product teams explore ideas, plan releases, and summarise insights.'
        },
        ...normalizedHistory,
        { role: 'user', content: message.trim() }
      ]
    });

    const outputText =
      typeof response.output_text === 'string' ? response.output_text : response.output?.map?.((item) => {
        if (typeof item?.content === 'string') {
          return item.content;
        }
        if (Array.isArray(item?.content)) {
          return item.content
            .map((part) => (typeof part?.text === 'string' ? part.text : ''))
            .join('');
        }
        if (typeof item?.text === 'string') {
          return item.text;
        }
        return '';
      })
        .join('');

    const assistantReply = outputText?.trim();

    if (!assistantReply) {
      return res.status(502).json({ error: 'The assistant returned an empty response.' });
    }

    res.json({ message: assistantReply });
  } catch (error) {
    console.error('OpenAI response error', error);
    res.status(500).json({ error: 'Failed to retrieve a response from OpenAI.' });
  }
});

app.listen(port, () => {
  console.log(`API server ready on port ${port} 🚀`);
});