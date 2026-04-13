# Fynex Telegram Bot + Web App

Fynex is built with `aiogram 3.x`, `SQLite`, and a Telegram Web App powered by `FastAPI`.

## Setup

1. Create virtual environment and install dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

2. Create `.env` from `.env.example` and fill values:
- `BOT_TOKEN`
- `ADMIN_ID` (optional)
- `WEB_APP_URL` (required for Telegram WebApp buttons, must be public `https://...`)
- `WEB_APP_HOST`, `WEB_APP_PORT`
- `OPENROUTER_API_KEY` for GPT-4o IELTS text generation and speaking feedback
- `OPENROUTER_MODEL` (default: `openai/gpt-4o`)
- `VOSK_MODEL_PATH` pointing to `vosk-model-en-us-0.22` if you want server-side final transcription analysis

## Run

1. Start bot:

```bash
source .venv/bin/activate
python bot.py
```

2. Start web app server in second terminal:

```bash
source .venv/bin/activate
python web_app.py
```

You can also run web server with uvicorn:

```bash
source .venv/bin/activate
uvicorn web_app:app --host 0.0.0.0 --port 8080
```

## Vercel Deploy

- Static frontend files: `web/index.html`, `web/styles.css`, `web/app.js`
- Vercel API entry: `api/index.py`
- Routing config: `vercel.json`

After deploy, copy your Vercel URL and set it in `.env`:

```env
WEB_APP_URL=https://your-project.vercel.app
```

Then restart the bot so `WebAppInfo` buttons open your TWA.

## Important Note

`bot.py` (Telegram long-polling bot) should run on VPS/Railway/Render, not on Vercel serverless.
Vercel is used here for Web App UI + API endpoints.

## IELTS AI-Tutor

- Open the Web App and go to `Kurslar`
- Use `IELTS AI Tutor` to generate a fresh reading/speaking text
- `Tinglash` uses browser TTS for shadowing practice
- `Boshlash` requests microphone access and starts live word progress in the browser
- Final feedback is sent to the backend:
  - OpenRouter `GPT-4o` generates the practice text and examiner-style advice
  - `Vosk` is used for final server-side transcription only when `VOSK_MODEL_PATH` points to a valid `vosk-model-en-us-0.22` folder

If OpenRouter or Vosk are not configured yet, the module still works with safe fallback text and transcript-based feedback.
