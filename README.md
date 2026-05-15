# StreamSidekick

StreamSidekick is a local Twitch AI co-host app built with:

- React + TypeScript + Vite frontend
- Tailwind CSS styling
- Node.js + Express + Socket.IO backend

## Current flow

Dashboard button -> backend event -> AI provider -> overlay character talks

## Run locally

```bash
npm install
npm run dev
```

Frontend:

- Dashboard: `http://localhost:5173/dashboard`
- Overlay: `http://localhost:5173/overlay`

Backend:

- API + Socket.IO: `http://localhost:4000`

## Real AI setup

Create a `.env` file in the repo root if you want real OpenAI responses:

```bash
STREAMSIDEKICK_AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5-mini
```

If the key is missing or the OpenAI request fails, StreamSidekick automatically falls back to mock mode so local testing keeps working.

## Included now

- Dashboard with personality selector, mode selector, trigger buttons, live log, TTS toggle, and AI provider status
- Overlay with animated avatar states, subtitles, speech bubble, and OBS-friendly transparent background
- Backend event system for `HOTKEY`, `PLAYER_SPEECH`, `SCREEN_SNAPSHOT`, and `OBS_SCENE_CHANGE`
- AI provider layer with OpenAI support and automatic mock fallback
- Cooldown handling to prevent over-talking
- REST endpoints for events and settings

## Next roadmap

- TTS playback
- Voice input
- Screenshots
- Gameplay-specific detection
