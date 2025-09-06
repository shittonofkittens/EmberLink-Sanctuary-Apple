import { BACKEND_URL } from '../api/serverConfig';

export async function sendDeleteToRecall({ soul, category, keyword }) {
  const payload = { soul, category, keyword };

  try {
    const res = await fetch(`${BACKEND_URL}/api/recall/delete`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Unknown error");
    console.log("🧹 Backend delete result:", data);
    return data;

  } catch (err) {
    console.error("🔥 Failed to delete from backend:", err);
    return { error: err.message };
  }
}
