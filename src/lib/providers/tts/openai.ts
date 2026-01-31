import OpenAI from "openai";
import { env } from "@/lib/config/env";
import type { TTSProvider, TTSRequest } from "../types";

const createClient = () => {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  return new OpenAI({ apiKey: env.OPENAI_API_KEY });
};

export class OpenAITTSProvider implements TTSProvider {
  name = "openai";

  async synthesize(request: TTSRequest): Promise<Uint8Array> {
    const client = createClient();

    const response = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: request.voice ?? "coral",
      input: request.text,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    return new Uint8Array(buffer);
  }
}
