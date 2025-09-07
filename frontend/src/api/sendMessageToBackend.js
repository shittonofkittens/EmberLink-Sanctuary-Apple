import { soulConfig } from "../components/VoiceStatusBar.jsx";
import { API_ENDPOINTS } from './serverConfig';

export async function sendMessageToBackend({
  message,
  soul = "Caelus",
  mode = "",
  room = ""
}) {
  if (!message || typeof message !== "string") {
    console.error("❌ Invalid or empty message:", message);
    return {
      reply: "[error - no input]",
      voiceUrl: null
    };
  }

  const trimmed = message.trim();
  const voiceId = soulConfig[soul]?.voiceId;

  // Message payload defaults
  const basePayload = {
    model: "gpt-4o",
    temperature: 0.7,
    soul,   // who to channel
    mode,   // mode of interaction (chat/edit/delete/etc)
    room,   // room context
  };

  // Select endpoint based on intent
  let endpoint = API_ENDPOINTS.chat;
  if (mode === "delete") endpoint = API_ENDPOINTS.recallDelete;
  if (mode === "edit") endpoint = API_ENDPOINTS.recallEdit;

  // Prepare message payload depending on mode
  let payload;

  if (mode === "delete" || mode === "edit") {
    payload = {
      ...basePayload,
      messages: [{ content: trimmed, action: mode }]
    };
  } else {
    payload = {
      ...basePayload,
      messages: [{ role: "user", content: trimmed }]
    };
  }

  console.log("📤 Sending to backend:", endpoint);
  console.log("📦 Payload:", payload);

  try {
    const res = await fetch(`${endpoint}?t=${Date.now()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("🧠 Response:", data);

    const reply = data.reply || "[no response]";

    if (!reply || reply === "[no response]") {
      return { reply, voiceUrl: null };
    }

    return {
      reply,
      voiceUrl: null // 🔊 voice synthesis placeholder
    };
  } catch (err) {
    console.error("🛑 Backend error:", err);
    return {
      reply: "[error]",
      voiceUrl: null
    };
  }
}
