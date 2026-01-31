import OpenAI from "openai";
import { env } from "@/lib/config/env";
import type { ChatRequest, LLMProvider } from "../types";

const createClient = () => {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  return new OpenAI({ apiKey: env.OPENAI_API_KEY });
};

export class OpenAIProvider implements LLMProvider {
  name = "openai";

  async generateChat(request: ChatRequest): Promise<string> {
    const client = createClient();
    const response = await client.responses.create({
      model: request.model ?? "gpt-5.1-chat-latest",
      input: request.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      temperature: request.temperature ?? 0.2,
    });

    return response.output_text?.trim() ?? "";
  }
}
