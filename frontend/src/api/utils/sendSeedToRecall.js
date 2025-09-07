import { BACKEND_URL } from '../api/serverConfig';

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

export async function sendSeedToRecall({ messages, soul, mode, category }) {
  if (!soul || !category || !messages?.length) {
    console.warn("⚠️ Missing required seed fields:", { soul, category, messages });
    return { success: false, error: "Missing required fields" };
  }

  const payload = {
    soul,
    mode,
    category,
    messages: messages.map(msg => ({
      message: msg.message || msg.content || "", // Handle flexible formats
      role: msg.role || "user"
    }))
  };

  try {
    console.log("📤 Sending seed to backend:", payload);

    const res = await withTimeout(
      (signal) => fetch(`${BACKEND_URL}/api/recall/save`, {
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

    // Always try text → JSON
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      console.log("🧠 Recall response JSON:", data);
      return { success: true, ...data };
    } catch {
      console.error("🔥 Recall server returned non-JSON:", text);
      return { success: false, error: "Recall server returned non-JSON response" };
    }

  } catch (err) {
    console.error("🔥 Failed to save seed to backend:", err);
    return { success: false, error: err.message };
  }
}
