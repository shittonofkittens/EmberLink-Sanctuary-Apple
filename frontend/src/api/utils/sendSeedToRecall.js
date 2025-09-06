import { BACKEND_URL } from '../api/serverConfig';

export async function sendSeedToRecall({ messages, soul, mode, category }) {
  const payload = {
    soul,
    mode,
    category,
    messages: messages.map(msg => ({
      message: msg.message || msg.content || "",  // Handle flexible formats
      role: msg.role || "user"
    }))
  };

  try {
    console.log("📤 Sending seed to backend:", payload);

    const res = await fetch(`${BACKEND_URL}/api/recall/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await res.text(); // Raw response
    try {
      const json = JSON.parse(text); // Try parsing JSON
      console.log("🧠 Recall response JSON:", json);
      return json;
    } catch (e) {
      console.error("🔥 Recall server returned non-JSON:", text);
      throw new Error("Recall server returned non-JSON response.");
    }

  } catch (err) {
    console.error("🔥 Failed to save seed to backend:", err);
    return { error: err.message };
  }
}
