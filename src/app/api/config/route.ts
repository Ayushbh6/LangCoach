import { env } from "@/lib/config/env";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    llmProvider: env.LLM_PROVIDER,
    sttProvider: env.STT_PROVIDER,
    ttsProvider: env.TTS_PROVIDER,
    ollamaBaseUrl: env.OLLAMA_BASE_URL ?? "http://localhost:11434",
    lmstudioBaseUrl: env.LMSTUDIO_BASE_URL ?? "http://localhost:1234",
  });
}
