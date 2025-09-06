import { API_ENDPOINTS } from '../serverConfig';

export async function saveMessagesToBackend(messages, room = "shared") {
  try {
    const res = await fetch(API_ENDPOINTS.historySave, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, room })
    });

    const data = await res.json();
    if (data.status === "saved") {
      console.log(`💾 Saved ${data.count} messages to backend.`);
    } else {
      console.warn("⚠️ Failed to save messages:", data.error || "Unknown error");
    }
  } catch (err) {
    console.error("🔥 Error saving messages:", err);
  }
}

export async function loadMessagesFromBackend(room = "shared") {
  const roomName = typeof room === "string" ? room : room?.name || "shared";
  console.log("🧪 [loadMessagesFromBackend] room param:", roomName);

  try {
    const res = await fetch(API_ENDPOINTS.historyLoad(roomName));
    const text = await res.text();
    
    try {
      const data = JSON.parse(text);
      return Array.isArray(data) ? data : [];
    } catch (parseErr) {
      console.error("⚠️ Failed to parse historyLoad response:", text);
      return [];
    }
    
  } catch (err) {
    console.error("🔥 Error loading messages:", err);
    return [];
  }
}
