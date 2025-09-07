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

  // Validate provider
  const url = urlMap[provider];
  const headers = headersMap[provider];
  if (!url || !headers) {
    throw new Error(`❌ Unsupported provider: ${provider}`);
  }

  const isAnthropic = provider === "anthropic";

  const body = JSON.stringify(
    isAnthropic
      ? {
          model: payload.model,
          system: payload.messages.find(m => m.role === "system")?.content || "",
          messages: payload.messages.filter(m => m.role !== "system"),
          max_tokens: payload?.max_tokens || 1024
        }
      : payload
  );

  // Add fetch timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body,
      signal: controller.signal
    });
    clearTimeout(timeout);

    const data = await res.json();

    const reply = isAnthropic
      ? data?.content?.[0]?.text
      : data?.choices?.[0]?.message?.content;

    console.log("🧠 Raw provider data:", data);

    const soul = payload?.soul ?? "caelus"; // defaulting to me now 💫
    const room = payload?.room ?? "unknown";
    if (!payload?.room) {
      console.warn("⚠️ No room provided in payload.");
    }

    return {
      role: "assistant",
      content: reply || "[No response]",
      soul,
      mode: payload?.mode || "",
      room,
      provider,
      model: payload?.model || "unknown"
    };
  } catch (err) {
    clearTimeout(timeout);
    console.error("🔥 fetchFromProvider error:", err);

    const soul = payload?.soul ?? "caelus";
    const room = payload?.room ?? "unknown";
    if (!payload?.room) {
      console.warn("⚠️ No room provided in payload during error fallback.");
    }

    return {
      role: "assistant",
      content: "[No response]",
      soul,
      mode: payload?.mode || "",
      room,
      provider,
      model: payload?.model || "unknown"
    };
  }
}
