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

export async function sendSearchToRecall({ soul = "shared", category = "needs", keyword = "" }) {
  if (!soul || !category) {
    console.warn("⚠️ Missing required search fields:", { soul, category, keyword });
    return { success: false, error: "Missing required fields" };
  }

  const payload = { soul, category, keyword };

  try {
    const res = await withTimeout(
      (signal) => fetch(`${BACKEND_URL}/api/recall/search`, {
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
    console.log("🔎 Backend search result:", data);
    return { success: true, ...data };

  } catch (err) {
    console.error("🧠 Search error:", err);
    return { success: false, error: err.message };
  }
}
