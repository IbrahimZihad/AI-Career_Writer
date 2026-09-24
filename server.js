require('dotenv').config({ quiet: true });
const path = require('path');
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY. Copy .env.example to .env and add your key.');
  process.exit(1);
}

const client = new Anthropic();
const MODEL = process.env.MODEL || 'claude-haiku-4-5-20251001';
const MAX_CHARS = 12000; // per input field
const RATE_LIMIT = 10;   // requests per IP per minute

const RULES =
  'You are a careful career writing assistant. Use only facts the user provides; never invent employers, tools, numbers or credentials. Output plain text only, with no markdown and no preamble.\n\n';

// Allowed options and required fields per mode. The client only picks from these.
const MODES = {
  cover: {
    fields: ['job', 'me'],
    options: ['Professional', 'Warm', 'Confident'],
    prompt: (v, o) =>
      RULES + 'Write a concise cover letter (about 200 words) in a ' + o.toLowerCase() +
      ' tone for the job post below. Address it to "Dear Hiring Team," unless a name is given, and end with a sign-off.\n\nJOB POST:\n' +
      v.job + '\n\nCANDIDATE BACKGROUND:\n' + v.me,
  },
  cv: {
    fields: ['role', 'text'],
    options: ['Concise', 'Impact-focused'],
    prompt: (v, o) =>
      RULES + 'Rewrite the CV text below to suit the target role. Style: ' + o.toLowerCase() +
      '. Keep every fact accurate, start each bullet with a strong verb, keep each bullet under 25 words, and return one bullet per line starting with "- ".\n\nTARGET ROLE:\n' +
      v.role + '\n\nCV TEXT:\n' + v.text,
  },
  sum: {
    fields: ['text'],
    options: ['Short (2-3 sentences)', 'One paragraph', 'Key points (bullets)'],
    prompt: (v, o) =>
      RULES + 'Summarize the text below. Format: ' + o + '. For bullets, start each line with "- ".\n\nTEXT:\n' + v.text,
  },
};

const app = express();
app.set('trust proxy', 1); // correct client IPs behind Render, Railway, etc.
app.use(express.json({ limit: '200kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Minimal in-memory rate limiter to protect your API key
const hits = new Map();
setInterval(() => hits.clear(), 10 * 60 * 1000).unref();
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

const fail = (res, code, msg) => res.status(code).type('text/plain').send(msg);

app.post('/api/generate', async (req, res) => {
  const { mode, values, option } = req.body || {};
  const m = MODES[mode];
  if (!m) return fail(res, 400, 'Unknown tool.');
  if (!m.options.includes(option)) return fail(res, 400, 'Invalid option.');

  const v = {};
  for (const f of m.fields) {
    const val = values && typeof values[f] === 'string' ? values[f].trim() : '';
    if (!val) return fail(res, 400, 'Please fill in every box.');
    if (val.length > MAX_CHARS) return fail(res, 400, 'Input is too long. Please shorten it.');
    v[f] = val;
  }
  if (limited(req.ip)) return fail(res, 429, 'Too many requests. Please wait a minute and try again.');

  res.type('text/plain; charset=utf-8').set('Cache-Control', 'no-cache');
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 1000,
    messages: [{ role: 'user', content: m.prompt(v, option) }],
  });
  res.on('close', () => { if (!res.writableEnded) stream.abort(); }); // user pressed Stop
  stream.on('text', (t) => res.write(t));

  try {
    await stream.finalMessage();
    res.end();
  } catch (e) {
    if (res.writableEnded || res.destroyed) return;
    console.error('AI request failed:', e.message);
    if (!res.headersSent) fail(res, 502, 'The AI request failed. Please try again.');
    else res.end();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('AI Career Writer running on http://localhost:' + port));
