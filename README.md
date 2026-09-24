<p align="center">
  <img src="logo.svg" alt="AI Career Writer logo" width="140">
</p>

<h1 align="center">AI Career Writer</h1>

<p align="center">
  A single-page web tool powered by Claude that writes cover letters, polishes CV bullets, and summarizes text.
</p>

---

## Overview

AI Career Writer helps job seekers write faster. Paste a job post, your CV text, or any long text, choose a tone or format, and Claude writes the result. The whole project is one self-contained HTML file with no build step and no dependencies.

## Features

### 1. Cover Letter
- Inputs: **job post** and **about you** (background, skills, projects)
- Tone options: Professional, Warm, Confident
- Produces a concise cover letter (about 200 words) addressed to "Dear Hiring Team" unless a name is given

### 2. CV Polish
- Inputs: **target role** and **your CV bullets or summary**
- Style options: Concise, Impact-focused
- Rewrites text as short bullets (under 25 words each) that start with strong verbs and suit the target role

### 3. Summarizer
- Input: any text (article, email, job ad)
- Format options: Short (2-3 sentences), One paragraph, Key points (bullets)

### General
- Live streaming of the result as it is written
- **Stop** button to cancel a request
- **Copy** button for the result
- Input validation (asks you to fill every box)
- Clear messages for denied permission, rate limits, and errors
- Responsive layout for phones and desktops, with automatic light and dark mode
- Built-in safety rule: the AI is told to use only the facts you provide and never invent employers, tools, numbers, or credentials

## How It Works

1. Choose a tool from the tabs.
2. Fill in the text boxes and pick a tone, style, or format.
3. Click **Generate**. The page builds a prompt from your input and sends it to Claude through the Claude artifact `sample` capability.
4. The answer streams into the Result box. Review it, then click **Copy**.

## Tech Stack

- HTML, CSS, and vanilla JavaScript in a single file (`ai-career-writer.html`)
- Claude artifact runtime `sample` capability for AI calls (no API key in the code)

## Project Structure

```
.
├── ai-career-writer.html   # the whole app
├── logo.svg                # project logo
└── README.md
```

## Running It

The app is published as a Claude artifact and must be opened inside Claude. On first use it asks for permission to run the AI, and requests run on the account of the person using the page.

Opened as a plain local file, the page loads but shows a notice that the AI features are unavailable. To run it outside Claude, replace the `sample` call in `generate()` with a call to your own backend or the Anthropic API. Keep API keys on a server, never in the page.

## Limitations

- AI features work only inside Claude (see above)
- Nothing is saved: results disappear when you close or reload the page
- Output can contain mistakes, so always review and fact-check before sending

## Ideas for Next Steps

- Interview question practice
- Save and export results as PDF or Word
- Upload a CV file instead of pasting text

## Author

Md. Ibrahim Zihad
