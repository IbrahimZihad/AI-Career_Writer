<p align="center">
  <img src="logo.svg" alt="AI Career Writer logo" width="140">
</p>

<h1 align="center">AI Career Writer</h1>

<p align="center">
  A web tool powered by Claude that writes cover letters, polishes CV bullets, and summarizes text.
</p>

---

## Features

- **Cover Letter**: paste a job post and your background, pick a tone (Professional, Warm, Confident), get a concise letter of about 200 words
- **CV Polish**: give a target role and your CV text, pick a style (Concise, Impact-focused), get short bullets that start with strong verbs
- **Summarizer**: paste any text and choose Short, One paragraph, or Key points
- Live streaming output, **Stop** and **Copy** buttons
- Responsive layout with automatic light and dark mode
- Safety rule in every prompt: use only the facts you provide, never invent employers, tools, numbers, or credentials

## Tech Stack

- Frontend: HTML, CSS, vanilla JavaScript (`public/index.html`)
- Backend: Node.js + Express, streaming responses from the Anthropic API (`server.js`)

## Project Structure

```
.
├── public/
│   └── index.html      # the web page
├── server.js           # Express server and /api/generate endpoint
├── package.json
├── .env.example        # copy to .env and add your key
├── .gitignore
├── logo.svg
└── README.md
```

## Run Locally

Requires Node.js 18 or newer and an Anthropic API key from the [Anthropic Console](https://console.anthropic.com/). API usage is billed separately from a claude.ai plan.

```bash
npm install
cp .env.example .env     # then put your key in .env
npm start
```

Open http://localhost:3000.

## Configuration

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `MODEL` | No | Model name. Default: `claude-haiku-4-5-20251001` |
| `PORT` | No | Server port. Default: `3000` |

## Deploy

Any Node host works (Render, Railway, Fly.io, and so on).

1. Push the project to GitHub (`.env` is already git-ignored).
2. Create a new web service from the repo.
3. Build command: `npm install`. Start command: `npm start`.
4. Add `ANTHROPIC_API_KEY` as an environment variable in the host's dashboard.

## API

`POST /api/generate` with JSON `{ "mode": "cover" | "cv" | "sum", "values": { ... }, "option": "..." }`. It streams the result back as plain text.

## Security Notes

- The API key stays on the server and is never sent to the browser.
- Prompts are built on the server, so the endpoint can't be used as a general-purpose proxy to Claude.
- Inputs are validated and capped at 12,000 characters per field.
- A simple in-memory rate limit (10 requests per minute per IP) protects your key. For heavier public use, add a stronger limiter or authentication.

## Limitations

- Nothing is saved: results disappear when you close or reload the page
- Output can contain mistakes, so always review and fact-check before sending

## Author

Md. Ibrahim Zihad
