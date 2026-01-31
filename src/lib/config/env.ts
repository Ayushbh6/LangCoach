import { z } from "zod";

export const providerEnum = z.enum([
  "openrouter",
  "openai",
  "gemini",
  "anthropic",
  "ollama",
  "lmstudio",
]);

export type ProviderName = z.infer<typeof providerEnum>;

const envSchema = z.object({
  LLM_PROVIDER: providerEnum.default("openai"),
  STT_PROVIDER: providerEnum.default("openai"),
  TTS_PROVIDER: providerEnum.default("openai"),

  OPENAI_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),

  OLLAMA_BASE_URL: z.string().url().optional(),
  LMSTUDIO_BASE_URL: z.string().url().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export const env = envSchema.parse({
  LLM_PROVIDER: process.env.LLM_PROVIDER,
  STT_PROVIDER: process.env.STT_PROVIDER,
  TTS_PROVIDER: process.env.TTS_PROVIDER,

  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,

  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
  LMSTUDIO_BASE_URL: process.env.LMSTUDIO_BASE_URL,
});
