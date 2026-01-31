import { GoogleGenAI } from "@google/genai";
import { env } from "@/lib/config/env";
import type { TTSProvider, TTSRequest } from "../types";

const createClient = () => {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  return new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
};

export class GeminiTTSProvider implements TTSProvider {
  name = "gemini";

  async synthesize(request: TTSRequest): Promise<Uint8Array> {
    const client = createClient();

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: request.text,
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: request.voice ?? "Kore",
            },
          },
        },
      },
    });

    const data =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ??
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!data) {
      throw new Error("Gemini TTS returned no audio data.");
    }

    if (typeof data === "string") {
      return new Uint8Array(Buffer.from(data, "base64"));
    }

    return data as Uint8Array;
  }
}
