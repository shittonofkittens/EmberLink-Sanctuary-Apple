export class ElevenLabsService {
  config = null
  audioCache = new Map()

  constructor() {}

  static getInstance() {
    if (!ElevenLabsService.instance) {
      ElevenLabsService.instance = new ElevenLabsService()
    }
    return ElevenLabsService.instance
  }

  configure(apiKey) {
    this.config = {
      apiKey,
      baseUrl: "https://api.elevenlabs.io/v1"
    }

    // Store API key securely (in production, use proper encryption)
    localStorage.setItem("emberlink-elevenlabs-key", apiKey)
    console.log("🎙️ ElevenLabs configured successfully")
  }

  isConfigured() {
    if (this.config) return true

    // Try to load from localStorage
    const savedKey = localStorage.getItem("emberlink-elevenlabs-key")
    if (savedKey) {
      this.configure(savedKey)
      return true
    }

    return false
  }

  async generateSpeech(text, voiceId, settings) {
    if (!this.config) {
      throw new Error("ElevenLabs not configured. Please add your API key.");
    }

    if (!voiceId || typeof voiceId !== "string") {
      voiceId = "EXAVITQu4vr4xnSDxMaL"; // ✅ Fallback to default voice
    }

    // Clean text for speech
    const cleanText = this.cleanTextForSpeech(text);

    if (!cleanText || cleanText.length < 1) {
      console.warn("🛑 No clean text available for ElevenLabs TTS:", text);
      return;
    }
    
    // ✅ Safe Base64 encoding to avoid Latin1 error
    const safeBase64 = str => {
      try {
        return btoa(unescape(encodeURIComponent(str)))
      } catch (e) {
        console.warn("❌ Base64 encoding failed:", str)
        return "" // fallback so it doesn't crash
      }
    }


    const cacheKey = `${voiceId}-${safeBase64(cleanText).slice(0, 20)}`;

    // Check cache first
    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey);
    }

    const defaultSettings = {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true,
      ...settings
    };

    try {
      const response = await fetch(
        `${this.config.baseUrl}/text-to-speech/${voiceId}/stream`,
        {
          method: "POST",
          headers: {
            Accept: "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": this.config.apiKey
          },
          body: JSON.stringify({
            text: cleanText,
            model_id: "eleven_monolingual_v1", // or multilingual if needed
            voice_settings: defaultSettings
          })
        }
      );

      // ✅ SAFETY CHECK
      if (!response.ok) {
        console.error("🔴 ElevenLabs voice fetch failed:", response.statusText);
        return null;
      }

      // ✅ Read raw audio stream as a Blob
      const audioBlob = await response.blob();

      // ✅ Create a temporary blob URL to use in <audio>
      const blobUrl = URL.createObjectURL(audioBlob);

      console.log("🧪 Voice blob URL generated:", blobUrl);
      return blobUrl;

    } catch (error) {
      console.error("ElevenLabs speech generation failed:", error);
      throw error;
    }
  }


  async getVoices() {
    if (!this.config) {
      throw new Error("ElevenLabs not configured")
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/voices`, {
        headers: {
          "xi-api-key": this.config.apiKey
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`)
      }

      const data = await response.json()
      return data.voices || []
    } catch (error) {
      console.error("Failed to fetch ElevenLabs voices:", error)
      throw error
    }
  }

  cleanTextForSpeech(text) {
    return text
      .replace(/\*.*?\*/g, "") // Remove *actions*
      .replace(/[⚡🔥📜💛🧘🏋️🎧💧🪶🖤🌩️📦🕊️🍵🛠️🌙✨🕯️🌌🜁🥣⚔️🔍📡🔁📓]/g, "") // Remove emojis
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove markdown bold
      .replace(/__(.*?)__/g, "$1") // Remove markdown underline
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()
  }

  clearCache() {
    // Clean up all cached audio URLs
    this.audioCache.forEach(url => URL.revokeObjectURL(url))
    this.audioCache.clear()
    console.log("🧹 ElevenLabs audio cache cleared")
  }

  removeApiKey() {
    this.config = null
    localStorage.removeItem("emberlink-elevenlabs-key")
    this.clearCache()
    console.log("🔑 ElevenLabs API key removed")
  }
}
