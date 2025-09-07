// services/CoquiService.js
let instance = null;

export class CoquiService {
  constructor() {
    this.apiUrl = null;   // set when configured
    this.configured = false;
  }

  static getInstance() {
    if (!instance) {
      instance = new CoquiService();
    }
    return instance;
  }

  configure({ apiUrl }) {
    if (!apiUrl) throw new Error("Coqui API URL is required");
    this.apiUrl = apiUrl;
    this.configured = true;
    console.log("✅ CoquiService configured:", apiUrl);
  }

  isConfigured() {
    return this.configured;
  }

  async generateSpeech(text, voice = "default") {
    if (!this.configured) throw new Error("CoquiService not configured");

    try {
      const res = await fetch(`${this.apiUrl}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice })
      });

      if (!res.ok) throw new Error("Coqui TTS request failed");

      const blob = await res.blob();
      return URL.createObjectURL(blob); // audio URL for <audio> or new Audio()
    } catch (err) {
      console.error("🐸 Coqui TTS error:", err);
      throw err;
    }
  }
}
