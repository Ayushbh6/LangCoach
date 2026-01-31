import { OpenRouter } from "@openrouter/sdk";
import { env } from "@/lib/config/env";
import type { ChatRequest, LLMProvider } from "../types";

const createClient = () => {
  if (!env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is missing.");
  }

  return new OpenRouter({ apiKey: env.OPENROUTER_API_KEY });
};

export class OpenRouterProvider implements LLMProvider {
  name = "openrouter";

  async generateChat(request: ChatRequest): Promise<string> {
    const client = createClient();
    const response = await client.chat.send({
      model: request.model ?? "minimax/minimax-m2-her",
      messages: request.messages,
      temperature: request.temperature ?? 0.2,
    });

    const content = response.choices?.[0]?.message?.content;
    return typeof content === "string" ? content.trim() : "";
  }
}
