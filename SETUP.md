# Flayr — Setup Guide

## Prerequisites

Install Node.js (v18+) from https://nodejs.org

## 1. Install dependencies

```bash
npm install
```

## 2. Set your API key

Copy the example env file and add your Anthropic API key:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...your key here...
```

Get your key at https://console.anthropic.com

## 3. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 on your phone (same WiFi) or desktop.

## 4. Deploy to Vercel (free)

```bash
npm install -g vercel
vercel
```

Add `ANTHROPIC_API_KEY` as an environment variable in the Vercel dashboard.

## How it works

1. User snaps or uploads a photo of notes
2. Image → `/api/generate` → Claude Vision (claude-opus-4-8)
3. Claude returns structured JSON flashcards
4. Anki-style study mode with flip animation + swipe navigation
