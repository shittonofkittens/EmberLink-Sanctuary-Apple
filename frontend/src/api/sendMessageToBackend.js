import { soulConfig } from "../components/VoiceStatusBar.jsx";
import { API_ENDPOINTS } from "./serverConfig.js";

async function withTimeout(fetchPromise, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetchPromise(controller.signal);
    clearTimeout(timeout);
    return res;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

export async function sendMessageToBackend({
  message,
  soul = "Caelus",
  souls = null,    // 👥 optional: group of souls
  mode = "",
  room = "",
  messages = [],
  recall_mode = ""
}) {
  if (!message || typeof message !== "string" || !message.trim()) {
    console.error("❌ Invalid or empty message:", message);
    return { success: false, reply: "[error - no input]", voiceUrl: null };
  }

  const trimmed = message.trim();
  const voiceId = soulConfig[soul]?.voiceId;

  const basePayload = {
    model: "gpt-4o",
    temperature: 0.7,
    room,
    recall_mode
  };

  // 👥 If group, send souls array; else, single soul with voice
  if (souls && Array.isArray(souls)) {
    basePayload.souls = souls;
  } else {
    basePayload.soul = soul;
    basePayload.mode = mode;
    basePayload.voiceId = voiceId;
  }

  // 🟢 Choose endpoint
  const endpoint =
    mode === "delete" || mode === "edit"
      ? API_ENDPOINTS.recall
      : API_ENDPOINTS.chat;

  // 🟢 Attach message
  const payload =
    mode === "delete" || mode === "edit"
      ? { ...basePayload, messages: [{ content: trimmed, action: mode }] }
      : { ...basePayload, messages: [{ role: "user", content: trimmed }] };

  console.log("📤 Sending to backend:", endpoint);
  console.log("📦 Payload:", payload);

  try {
    const res = await withTimeout(
      (signal) =>
        fetch(`${endpoint}?t=${Date.now()}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal
        })
    );

    if (!res.ok) {
      let errorText;
      try {
        const errData = await res.json();
        errorText = errData.error || "Unknown error";
      } catch {
        errorText = `Server error: ${res.status}`;
      }
      throw new Error(errorText);
    }

    const data = await res.json();
    console.log("🧠 Response:", data);

    return {
      success: true,
      reply:
        typeof data.reply === "string"
          ? data.reply
          : data.reply?.reply || JSON.stringify(data.reply),
      voiceUrl: data.voiceUrl || null,
      mode: data.mode || {}
    };
  } catch (err) {
    console.error("🛑 Backend error:", err);
    return { success: false, reply: "[error]", voiceUrl: null };
  }
}
