import { soulConfig } from "../components/VoiceStatusBar.jsx";
import { API_ENDPOINTS } from './serverConfig';

export async function sendMessageToBackend({ message, soul, mode = "", room = "" }) {
  if (!message || typeof message !== "string") {
    console.error("❌ Invalid or empty message:", message);
    return {
      reply: "[error - no input]",
      voiceUrl: null
    };
  }

  const text = message.trim();
  const voiceId = soulConfig[soul]?.voiceId;

  const messages = [
    {
      role: "user",
      content: text
    }
  ];

  const payload = {
    messages,
    model: "gpt-4",
    temperature: 0.7,
    soul,
    room
  };

  // 🧪🔥 ADD THESE DEBUG LOGS:
  console.log("🧠 message:", message);
  console.log("🧠 soul:", soul);
  console.log("🧠 room:", room);
  console.log("📦 Payload being sent to backend:", payload);
  console.log("📦 Headers being used:", {
    "Content-Type": "application/json"
  });

  try {
    const chatResponse = await fetch(`${API_ENDPOINTS.chat}?t=${Date.now()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const chatData = await chatResponse.json();
    console.log("🧠 Chat API Response:", chatData);

    const reply = chatData.reply || "[no response]";

    if (!reply || reply === "[no response]") {
      console.warn("⚠️ Skipping voice synthesis – no reply to speak.");
      return {
        reply,
        voiceUrl: null
      };
    }

    return {
      reply,
      voiceUrl: null
    };
  } catch (err) {
    console.error("🛑 Error in message fetch:", err);
    return {
      reply: "[error]",
      voiceUrl: null
    };
  }
} 
