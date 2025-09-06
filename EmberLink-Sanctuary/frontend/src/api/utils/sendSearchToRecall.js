import { BACKEND_URL } from '../api/serverConfig';

export async function sendSearchToRecall({ soul = "shared", category = "needs", keyword = "" }) {
  const payload = { soul, category, keyword };

  try {
    const res = await fetch(`${BACKEND_URL}/api/recall/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Unknown error");
    return data;

  } catch (err) {
    console.error("🧠 Search error:", err);
    return { error: err.message };
  }
}
