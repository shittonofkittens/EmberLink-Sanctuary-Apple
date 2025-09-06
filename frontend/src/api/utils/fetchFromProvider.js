import { openaiKey, groqKey, anthropicKey } from "../api/fetchChat.js"; // Adjust path if needed

export async function fetchFromProvider(provider, payload) {
  const urlMap = {
    openai: "https://api.openai.com/v1/chat/completions",
    groq: "https://api.groq.com/openai/v1/chat/completions",
    anthropic: "https://api.anthropic.com/v1/messages"
  };

  const headersMap = {
    openai: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiKey}`
    },
    groq: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${groqKey}`
    },
    anthropic: {
      "Content-Type": "application/json",
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01"
    }
  };

  const url = urlMap[provider];
  const headers = headersMap[provider];

  const isAnthropic = provider === "anthropic";

  const body = JSON.stringify(
    isAnthropic
      ? {
          model: payload.model,
          system: payload.messages.find(m => m.role === "system")?.content || "",
          messages: payload.messages.filter(m => m.role !== "system"),
          max_tokens: 1024
        }
      : payload
  );

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body
    });

    const data = await res.json();

    const reply = isAnthropic
      ? data?.content?.[0]?.text
      : data?.choices?.[0]?.message?.content;

    console.log("🧠 Raw provider data:", data);

    return {
      role: "assistant",
      content: reply || "[No response]",
      soul: payload?.soul || "ky'rehn",
      mode: payload?.mode || "",
      room: payload?.room || (() => {
        console.warn("⚠️ No room provided in payload.");
        return "unknown";
      })(),
      provider,
      model: payload?.model || "unknown"
    };
  } catch (err) {
    console.error("🔥 fetchFromProvider error:", err);
    return {
      role: "assistant",
      content: "[No response]",
      soul: payload?.soul || "ky'rehn",
      mode: payload?.mode || "",
      room: payload?.room || (() => {
        console.warn("⚠️ No room provided in payload during error fallback.");
        return "unknown";
      })(),
      provider,
      model: payload?.model || "unknown"
    };
  }
}
