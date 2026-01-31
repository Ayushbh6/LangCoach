import { env } from "@/lib/config/env";
import type { TranscriptionProvider, TranscriptionRequest } from "../types";

export class GeminiTranscriptionProvider implements TranscriptionProvider {
  name = "gemini";

  async transcribe(_request: TranscriptionRequest): Promise<string> {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing.");
    }

    throw new Error(
      "Gemini transcription is not wired yet. Use OpenAI Whisper for now."
    );
  }
}
