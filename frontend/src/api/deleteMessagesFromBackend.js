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

export async function deleteMessagesFromBackend(deleteIds, roomId) {
  if (!Array.isArray(deleteIds) || deleteIds.length === 0) {
    console.warn("⚠️ No message IDs provided for deletion");
    return { success: false, error: "No message IDs provided" };
  }
  if (!roomId) {
    console.warn("⚠️ No room ID provided for deletion");
    return { success: false, error: "No room ID provided" };
  }

  try {
    const res = await withTimeout(
      (signal) =>
        fetch(`${API_ENDPOINTS.recall}/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ delete_ids: deleteIds, room: roomId }),
          credentials: "include",
          signal,
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
    console.log(`🗑️ Deleted ${deleteIds.length} messages from room: ${roomId}`);
    return { success: true, ...data };
  } catch (err) {
    console.error("🔥 Backend failed to delete messages:", err);
    return { success: false, error: err.message };
  }
}
