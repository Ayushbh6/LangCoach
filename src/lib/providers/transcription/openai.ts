import OpenAI from "openai";
import { toFile } from "openai/uploads";
import { env } from "@/lib/config/env";
import type { TranscriptionProvider, TranscriptionRequest } from "../types";

const createClient = () => {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  return new OpenAI({ apiKey: env.OPENAI_API_KEY });
};

export class OpenAITranscriptionProvider implements TranscriptionProvider {
  name = "openai";

  async transcribe(request: TranscriptionRequest): Promise<string> {
    const client = createClient();
    const file = await toFile(request.audio, "speech", {
      type: request.mimeType,
    });

    const transcription = await client.audio.transcriptions.create({
      file,
      model: "gpt-4o-transcribe",
      response_format: "text",
      language: request.language,
    });

    return transcription.trim();
  }
}
