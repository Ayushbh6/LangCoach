import { env } from "@/lib/config/env";
import type { ChatRequest, LLMProvider } from "../types";

export class OllamaProvider implements LLMProvider {
  name = "ollama";

  async generateChat(request: ChatRequest): Promise<string> {
    const baseUrl = env.OLLAMA_BASE_URL ?? "http://localhost:11434";

    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: request.model ?? "llama3.1",
        messages: request.messages,
        options: {
          temperature: request.temperature ?? 0.2,
        },
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama error: ${errorText}`);
    }

    const data = (await response.json()) as {
      message?: { content?: string };
    };

    return data.message?.content?.trim() ?? "";
  }
}
