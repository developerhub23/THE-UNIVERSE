import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, model = 'mistral' } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    let response;
    if (model === 'mistral') {
      response = await handleMistralRequest(message);
    } else if (model === 'openai') {
      response = await handleOpenAIRequest(message);
    } else if (model === 'gemini') {
      response = await handleGeminiRequest(message);
    } else {
      return res.status(400).json({ error: 'Unsupported model. Use: mistral, openai, or gemini' });
    }
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.post('/api/chat/stream', async (req, res) => {
  try {
    const { message, model = 'mistral' } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    if (model === 'mistral') {
      await streamMistralRequest(message, res);
    } else if (model === 'openai') {
      await streamOpenAIRequest(message, res);
    } else if (model === 'gemini') {
      await streamGeminiRequest(message, res);
    } else {
      res.write('data: {"error": "Unsupported model. Use: mistral, openai, or gemini"}

');
      res.end();
    }
  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

async function handleMistralRequest(message) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error('Mistral API key not configured');
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'mistral-tiny',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant specializing in space, astronomy, and space exploration. Provide accurate, detailed information.' },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Mistral API error');
  }
  const data = await response.json();
  return data.choices[0].message.content;
}

async function handleOpenAIRequest(message) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OpenAI API key not configured');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant specializing in space, astronomy, and space exploration.' },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'OpenAI API error');
  }
  const data = await response.json();
  return data.choices[0].message.content;
}

async function handleGeminiRequest(message) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured');
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: 'You are a helpful AI assistant specializing in space, astronomy, and space exploration. Provide accurate, detailed information.' },
            { text: message }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000
      }
    })
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Gemini API error');
  }
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function streamMistralRequest(message, res) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    res.write('data: {"error": "Mistral API key not configured"}

');
    res.end();
    return;
  }
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'mistral-tiny',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant specializing in space, astronomy, and space exploration.' },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: true
    })
  });
  if (!response.ok) {
    const errorData = await response.json();
    res.write(`data: {"error": "${errorData.message || 'Mistral API error'}"}

`);
    res.end();
    return;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('
').filter(line => line.trim() !== '');
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = line.substring(5).trim();
        try {
          const parsed = JSON.parse(data);
          if (parsed.choices && parsed.choices[0]?.delta?.content) {
            res.write(`data: ${JSON.stringify({ content: parsed.choices[0].delta.content })}

`);
          }
        } catch (e) {
          console.error('Error parsing stream chunk:', e);
        }
      }
    }
  }
  res.write('data: [DONE]

');
  res.end();
}

async function streamOpenAIRequest(message, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.write('data: {"error": "OpenAI API key not configured"}

');
    res.end();
    return;
  }
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant specializing in space, astronomy, and space exploration.' },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: true
    })
  });
  if (!response.ok) {
    const errorData = await response.json();
    res.write(`data: {"error": "${errorData.message || 'OpenAI API error'}"}

`);
    res.end();
    return;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('
').filter(line => line.trim() !== '');
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = line.substring(5).trim();
        if (data === '[DONE]') {
          res.write('data: [DONE]

');
          continue;
        }
        try {
          const parsed = JSON.parse(data);
          if (parsed.choices && parsed.choices[0]?.delta?.content) {
            res.write(`data: ${JSON.stringify({ content: parsed.choices[0].delta.content })}

`);
          }
        } catch (e) {
          console.error('Error parsing stream chunk:', e);
        }
      }
    }
  }
  res.write('data: [DONE]

');
  res.end();
}

async function streamGeminiRequest(message, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.write('data: {"error": "Gemini API key not configured"}

');
    res.end();
    return;
  }
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:streamGenerateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: 'You are a helpful AI assistant specializing in space, astronomy, and space exploration. Provide accurate, detailed information.' },
              { text: message }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
      res.write(`data: {"error": "${errorData.message || 'Gemini API error'}"}

`);
      res.end();
      return;
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('

').filter(line => line.trim() !== '');
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.substring(5).trim();
          try {
            const parsed = JSON.parse(data);
            if (parsed.candidates && parsed.candidates[0]?.content?.parts?.[0]?.text) {
              res.write(`data: ${JSON.stringify({ content: parsed.candidates[0].content.parts[0].text })}

`);
            }
          } catch (e) {
            console.error('Error parsing Gemini stream chunk:', e);
          }
        }
      }
    }
    res.write('data: [DONE]

');
    res.end();
  } catch (error) {
    console.error('Gemini stream error:', error);
    res.write(`data: {"error": "${error.message || 'Gemini stream error'}"}

`);
    res.end();
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;