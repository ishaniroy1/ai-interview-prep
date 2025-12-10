const express = require('express');
const OpenAI = require('openai');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper: call an async function with retries on rate-limit / quota errors
async function callWithRetry(fn, attempts = 3, initialDelay = 500) {
  let attempt = 0;
  while (attempt < attempts) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      const msg = err && err.message ? String(err.message) : '';
      const status = err && err.status ? err.status : null;
      const isRateLimit = status === 429 || /rate limit|quota|429/i.test(msg);
      if (!isRateLimit || attempt >= attempts) {
        throw err;
      }
      const delay = initialDelay * Math.pow(2, attempt - 1);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

// Generate questions
router.post('/generate-questions', auth, async (req, res) => {
  const { jobRole, difficulty, count } = req.body;
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `Generate ${count} interview questions for a ${difficulty} level ${jobRole} position. Include a mix of technical and behavioral questions. Format as JSON array with objects having "question" and "type" fields.`;

    const response = await callWithRetry(() => openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000
    }));

    const questions = JSON.parse(response.choices[0].message.content);
    res.json({ questions });
  } catch (err) {
    const msg = err && err.message ? String(err.message) : 'Unknown error';
    console.error('Error generating questions:', msg);
    if (/rate limit|quota|429/i.test(msg) || (err && err.status === 429)) {
      return res.status(429).json({ message: 'OpenAI quota exceeded or rate limited', error: msg });
    }
    res.status(500).json({ message: 'Error generating questions', error: msg });
  }
});

// Generate feedback
router.post('/generate-feedback', auth, async (req, res) => {
  const { question, answer, jobRole } = req.body;
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `As an interviewer for a ${jobRole} position, provide constructive feedback on this answer to the question: "${question}". Answer: "${answer}". Keep it concise and helpful.`;

    const response = await callWithRetry(() => openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500
    }));

    const feedback = response.choices[0].message.content;
    res.json({ feedback });
  } catch (err) {
    const msg = err && err.message ? String(err.message) : 'Unknown error';
    console.error('Error generating feedback:', msg);
    if (/rate limit|quota|429/i.test(msg) || (err && err.status === 429)) {
      return res.status(429).json({ message: 'OpenAI quota exceeded or rate limited', error: msg });
    }
    res.status(500).json({ message: 'Error generating feedback', error: msg });
  }
});

// ElevenLabs integration (placeholder for voice generation)
router.post('/generate-voice', auth, async (req, res) => {
  const { text, voice_id } = req.body;
  try {
    const response = await axios.post(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: { stability: 0.5, similarity_boost: 0.5 }
    }, {
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      responseType: 'arraybuffer'
    });

    res.set('Content-Type', 'audio/mpeg');
    res.send(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Error generating voice' });
  }
});

module.exports = router;