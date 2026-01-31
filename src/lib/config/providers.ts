import { env, type ProviderName } from "./env";

export type ProviderConfig = {
  name: ProviderName;
  apiKey?: string;
  baseUrl?: string;
};

export const getProviderConfig = (name: ProviderName): ProviderConfig => {
  switch (name) {
    case "openrouter":
      return { name, apiKey: env.OPENROUTER_API_KEY };
    case "openai":
      return { name, apiKey: env.OPENAI_API_KEY };
    case "gemini":
      return { name, apiKey: env.GEMINI_API_KEY };
    case "anthropic":
      return { name, apiKey: env.ANTHROPIC_API_KEY };
    case "ollama":
      return { name, baseUrl: env.OLLAMA_BASE_URL ?? "http://localhost:11434" };
    case "lmstudio":
      return { name, baseUrl: env.LMSTUDIO_BASE_URL ?? "http://localhost:1234" };
    default:
      return { name };
  }
};

export const validateProviderConfig = () => {
  const errors: string[] = [];

  const llm = getProviderConfig(env.LLM_PROVIDER);
  const stt = getProviderConfig(env.STT_PROVIDER);
  const tts = getProviderConfig(env.TTS_PROVIDER);

  const check = (label: string, cfg: ProviderConfig) => {
    if (cfg.name === "ollama" || cfg.name === "lmstudio") {
      if (!cfg.baseUrl) {
        errors.push(`${label} base URL is required for ${cfg.name}.`);
      }
      return;
    }

    if (!cfg.apiKey) {
      errors.push(`${label} API key is required for ${cfg.name}.`);
    }
  };

  check("LLM", llm);
  check("STT", stt);
  check("TTS", tts);

  return { ok: errors.length === 0, errors };
};
