import { GoogleGenAI } from "@google/genai";
import { env } from "@/lib/config/env";
import type { ChatRequest, LLMProvider } from "../types";

const createClient = () => {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  return new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
};

export class GeminiProvider implements LLMProvider {
  name = "gemini";

  async generateChat(request: ChatRequest): Promise<string> {
    const client = createClient();
    const model = request.model ?? "gemini-3-flash-preview";

    const systemMessages = request.messages
      .filter((message) => message.role === "system")
      .map((message) => message.content)
      .join("\n");

    const contents = request.messages
      .filter((message) => message.role !== "system")
      .map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      }));

    const response = await client.models.generateContent({
      model,
      contents,
      config: {
        temperature: request.temperature ?? 0.2,
        ...(systemMessages
          ? { systemInstruction: systemMessages }
          : undefined),
      },
    });

    return response.text?.trim() ?? "";
  }
}
