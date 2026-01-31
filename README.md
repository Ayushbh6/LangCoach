# 🗣️ Language Coach MVP

> **Self-hosted AI language coach** that runs 30–45 minute speaking-first sessions, tracks errors, and shows measurable progress within 30 days.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## ✨ Features

- **Bring Your Own Key (BYOK)**: Full provider abstraction for LLM, Speech-to-Text, and Text-to-Speech
- **Multi-Provider Support**: OpenAI, Google Gemini, OpenRouter, Ollama, and more
- **Modern Stack**: Next.js 16+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Docker Ready**: Containerized development environment with volume persistence
- **Latest AI SDKs**: OpenAI Responses API, Google GenAI, OpenRouter SDK

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```bash
# Provider Selection
LLM_PROVIDER=openai          # openai | gemini | openrouter | ollama
STT_PROVIDER=openai          # openai | gemini
TTS_PROVIDER=openai          # openai | gemini | webspeech

# API Keys (add only what you need)
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
OPENROUTER_API_KEY=...
ANTHROPIC_API_KEY=...

# Local Models (optional)
OLLAMA_BASE_URL=http://localhost:11434
LMSTUDIO_BASE_URL=http://localhost:1234
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📦 Project Structure

```
lang-coach/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes (health, config)
│   │   ├── settings/          # Settings page
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── app-shell.tsx      # Main layout
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   └── lib/
│       ├── config/            # Environment & provider config
│       └── providers/         # Provider abstraction layer
│           ├── llm/           # OpenAI, Gemini, OpenRouter, Ollama
│           ├── transcription/ # Speech-to-Text providers
│           ├── tts/           # Text-to-Speech providers
│           ├── storage/       # SQLite (in progress)
│           ├── types.ts       # Core interfaces
│           └── index.ts       # Factory functions
├── docker/                    # Docker configuration
├── docs/                      # Documentation
└── plan/                      # Project planning docs
```

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16+ (App Router) |
| **Language** | TypeScript 5+ |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **AI SDKs** | OpenAI v6+, @google/genai, @openrouter/sdk |
| **Database** | SQLite (planned: Drizzle ORM) |
| **Deployment** | Docker, Docker Compose |

---

## 🎯 Current Status

### ✅ Phase 0: Foundation (Complete)
- [x] Next.js + TypeScript + Tailwind setup
- [x] Docker environment with volume mounts
- [x] BYOK configuration system
- [x] Settings UI with dark mode
- [x] Health & config API endpoints

### 🔄 Phase 1: Provider Abstraction (In Progress)
- [x] Core provider interfaces (`LLMProvider`, `TranscriptionProvider`, `TTSProvider`, `StorageProvider`)
- [x] OpenAI integration (Responses API, `gpt-4o-transcribe`, `gpt-4o-mini-tts`)
- [x] Google Gemini integration (`gemini-3-flash-preview`, `gemini-2.5-flash-preview-tts`)
- [x] OpenRouter SDK integration
- [x] Ollama support
- [ ] SQLite/ORM setup (T06 - Next)
- [ ] Database schemas (T07)

---

## 🔧 Provider Configuration

The app uses a **factory pattern** to switch between providers at runtime based on environment variables.

### Supported Providers

#### LLM (Language Models)
- **OpenAI**: `gpt-5.1-chat-latest` (Responses API)
- **Google Gemini**: `gemini-3-flash-preview`
- **OpenRouter**: `minimax/minimax-m2-her` (or any OpenRouter model)
- **Ollama**: `llama3.1` (local)

#### Speech-to-Text (STT)
- **OpenAI**: `gpt-4o-transcribe`
- **Gemini**: (planned)

#### Text-to-Speech (TTS)
- **OpenAI**: `gpt-4o-mini-tts` (voice: `coral`)
- **Gemini**: `gemini-2.5-flash-preview-tts` (voice: `Kore`)
- **Web Speech API**: Browser-based (client-side only)

---

## 🐳 Docker Development

```bash
# Build and run containers
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

---

## 🧪 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check for all configured providers |
| `/api/config` | GET | Returns current provider configuration |

---

## 🤝 Contributing

This is an early-stage MVP. Contributions, issues, and feature requests are welcome!

---

## 📄 License

[MIT](./LICENSE)

---

## 🗺️ Roadmap

- **Phase 2**: Core conversation runner & session management
- **Phase 3**: Error tracking & correction flow
- **Phase 4**: Language Packs (German, French, Spanish)
- **Phase 5**: Progress tracking & analytics
