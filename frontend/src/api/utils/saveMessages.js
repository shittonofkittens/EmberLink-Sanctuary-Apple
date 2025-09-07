import { API_ENDPOINTS } from '../serverConfig';

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

export async function saveMessagesToBackend(messages, room = "shared", soul = "caelus") {
  try {
    const res = await withTimeout(
      (signal) => fetch(API_ENDPOINTS.historySave, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, room, soul }),
        signal
      })
    );

    if (!res.ok) {
      throw new Error(`Server responded ${res.status}`);
    }

    const data = await res.json();
    if (data.status === "saved") {
      console.log(`💾 Saved ${data.count} messages to backend.`);
      return { success: true, count: data.count };
    } else {
      console.warn("⚠️ Failed to save messages:", data.error || "Unknown error");
      return { success: false, error: data.error || "Unknown error" };
    }
  } catch (err) {
    console.error("🔥 Error saving messages:", err);
    return { success: false, error: err.message };
  }
}

export async function loadMessagesFromBackend(room = "shared") {
  const roomName = typeof room === "string" ? room : room?.name || "shared";
  console.log("🧪 [loadMessagesFromBackend] room param:", roomName);

  try {
    const res = await withTimeout(
      (signal) => fetch(API_ENDPOINTS.historyLoad(roomName), { signal })
    );

    if (!res.ok) {
      throw new Error(`Server responded ${res.status}`);
    }

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return { success: true, messages: Array.isArray(data) ? data : [] };
    } catch (parseErr) {
      console.error("⚠️ Failed to parse historyLoad response:", text);
      return { success: false, messages: [] };
    }
  } catch (err) {
    console.error("🔥 Error loading messages:", err);
    return { success: false, messages: [] };
  }
}
