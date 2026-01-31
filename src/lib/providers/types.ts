export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatRequest = {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

export interface LLMProvider {
  name: string;
  generateChat(request: ChatRequest): Promise<string>;
}

export type TranscriptionRequest = {
  audio: Uint8Array;
  mimeType: string;
  language?: string;
};

export interface TranscriptionProvider {
  name: string;
  transcribe(request: TranscriptionRequest): Promise<string>;
}

export type TTSRequest = {
  text: string;
  voice?: string;
  format?: "mp3" | "wav" | "ogg";
};

export interface TTSProvider {
  name: string;
  synthesize(request: TTSRequest): Promise<Uint8Array>;
}

export interface StorageProvider {
  name: string;
  ping(): Promise<boolean>;
}
