import { env } from "@/lib/config/env";
import type {
  LLMProvider,
  StorageProvider,
  TranscriptionProvider,
  TTSProvider,
} from "./types";
import { GeminiProvider } from "./llm/gemini";
import { OllamaProvider } from "./llm/ollama";
import { OpenAIProvider } from "./llm/openai";
import { OpenRouterProvider } from "./llm/openrouter";
import { GeminiTranscriptionProvider } from "./transcription/gemini";
import { OpenAITranscriptionProvider } from "./transcription/openai";
import { GeminiTTSProvider } from "./tts/gemini";
import { OpenAITTSProvider } from "./tts/openai";
import { WebSpeechTTSProvider } from "./tts/webspeech";
import { SqliteStorageProvider } from "./storage/sqlite";

export const createLLMProvider = (): LLMProvider => {
  switch (env.LLM_PROVIDER) {
    case "openrouter":
      return new OpenRouterProvider();
    case "gemini":
      return new GeminiProvider();
    case "ollama":
      return new OllamaProvider();
    case "openai":
    default:
      return new OpenAIProvider();
  }
};

export const createTranscriptionProvider = (): TranscriptionProvider => {
  switch (env.STT_PROVIDER) {
    case "gemini":
      return new GeminiTranscriptionProvider();
    case "openai":
    default:
      return new OpenAITranscriptionProvider();
  }
};

export const createTTSProvider = (): TTSProvider => {
  switch (env.TTS_PROVIDER) {
    case "gemini":
      return new GeminiTTSProvider();
    case "openai":
      return new OpenAITTSProvider();
    default:
      return new WebSpeechTTSProvider();
  }
};

export const createStorageProvider = (): StorageProvider => {
  return new SqliteStorageProvider();
};

export * from "./types";
