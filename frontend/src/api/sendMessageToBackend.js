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
  mode = "",
  room = ""
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
    soul,
    mode,
    room,
    voiceId
  };

  // 🟢 Only two stable endpoints: chat + recall
  const endpoint =
    mode === "delete" || mode === "edit"
      ? API_ENDPOINTS.recall
      : API_ENDPOINTS.chat;

  // 🟢 Recall can handle delete/edit based on mode
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
      reply: typeof data.reply === "string"
        ? data.reply
        : (data.reply?.reply || JSON.stringify(data.reply)),
      voiceUrl: data.voiceUrl || null,
      mode: data.mode || {}
    };

  } catch (err) {
    console.error("🛑 Backend error:", err);
    return { success: false, reply: "[error]", voiceUrl: null };
  }
}
