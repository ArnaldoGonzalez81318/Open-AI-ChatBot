# Open AI Chatbot (Vite + TypeScript)

![Chatbot UI](./src/Assets/Images/OpenAI-ChatBot.jpg)

Modernised AI chat workspace built with React 18, Vite, Tailwind CSS v4, and TypeScript. The refreshed interface focuses on conversation clarity, helpful shortcuts, and a streamlined hand-off to the OpenAI-powered backend.

## Highlights

- ✨ **Revamped layout** — responsive two-panel workspace with gradients, metrics, and richer message styling.
- ⚡ **Typed React hooks** — stateful chat flow with error handling, history payloads, and optimistic UI updates.
- 🎯 **Prompt shortcuts** — reusable suggestion chips and keyboard affordances for faster ideation.
- 🔐 **Configurable backend** — Express server upgraded to modern OpenAI Responses API with contextual memory.

## Quick Start

```bash
npm install

# Frontend (Vite + Tailwind)
npm run dev

# API server (Express + OpenAI)
VITE_API_URL=http://localhost:3001 \\
OPENAI_API_KEY=sk-... \\
OPENAI_MODEL=gpt-4.1-mini \\
EXPRESS_PORT=3001 \\
npm run server
```

Visit `http://localhost:5173` for the UI and keep the Express server running on the port configured via `EXPRESS_PORT`.

## Environment Variables

Create a `.env` file in the project root (never commit secrets):

```
OPENAI_API_KEY=your-key-here
OPENAI_MODEL=gpt-4.1-mini
EXPRESS_PORT=3001
VITE_API_URL=http://localhost:3001
```

`VITE_API_URL` is exposed to the client; the remaining values stay server-side.

## Project Scripts

- `npm run dev` – start Vite in development mode with hot module replacement.
- `npm run build` – generate an optimized production build in `dist`.
- `npm run preview` – serve the built assets locally to verify production output.
- `npm run server` – launch the Express API (requires environment variables above).

## Folder Overview

- `src/` — TypeScript React app with modular components, hooks, and Tailwind styles.
- `index.js` — Express API entry point forwarding prompts to OpenAI.
- `public/` — static assets served as-is (favicons, manifest, etc.).

## Customisation Tips

- Extend Tailwind themes in `tailwind.config.ts` to match your brand.
- Add new prompt shortcuts by editing `suggestionSeeds` in `src/App.tsx`.
- Swap OpenAI models via `OPENAI_MODEL` (e.g. `gpt-4.1`, `gpt-3.5-turbo`).
- Enhance analytics by persisting `messages` from `useChatApi` to storage or a database.

---

Crafted with React, Vite, Tailwind, and GPT-5-Codex.
