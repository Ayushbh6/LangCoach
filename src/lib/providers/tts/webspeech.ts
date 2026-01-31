import type { TTSProvider, TTSRequest } from "../types";

export class WebSpeechTTSProvider implements TTSProvider {
  name = "webspeech";

  async synthesize(_request: TTSRequest): Promise<Uint8Array> {
    throw new Error("Web Speech API runs in the browser. Use client-side TTS.");
  }
}
