# Language Coach MVP (Self-Hosted v1)

An AI language coach that runs 30–45 minute speaking-first sessions, tracks errors, and shows measurable progress within 30 days. Built as a language-agnostic platform with Language Packs for German, French, and Spanish.

## Status

Phase 0: Project setup in progress.

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- SQLite (planned)

## Getting Started (Dev)

1) Install dependencies

```
npm install
```

2) Run the dev server

```
npm run dev
```

Open http://localhost:3000 to view the app.

## Project Structure

```
/src        Next.js app
/packages   Shared libs (planned)
/docs       Documentation
/docker     Docker assets
```

## Environment Variables

Create a .env file in the project root. API keys and provider config will be documented as Phase 0 progresses.
Copy the starter file:

```
cp .env.example .env
```

Key entries:

- LLM_PROVIDER=openai | openrouter | gemini | anthropic | ollama | lmstudio
- STT_PROVIDER=openai | openrouter | gemini | anthropic | ollama | lmstudio
- TTS_PROVIDER=openai | openrouter | gemini | anthropic | ollama | lmstudio
- OPENAI_API_KEY=
- OPENROUTER_API_KEY=
- ANTHROPIC_API_KEY=
- GEMINI_API_KEY=
- OLLAMA_BASE_URL=http://localhost:11434
- LMSTUDIO_BASE_URL=http://localhost:1234

## Docker

```
docker-compose up --build
```

## License

MIT
