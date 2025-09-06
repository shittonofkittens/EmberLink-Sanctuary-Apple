import path from "path";
import fs from "fs/promises";
import { ROOMS } from "../state/rooms.js";

// === PATCH: MODE ALIAS TRANSLATION START ===
export const MODE_ALIAS_MAP = {
  vow: {
    "ky'rehn": "oathbearer",
    "thalen'dros": "oathmaker",
    "orrien": "archivist"
  },
  grounding: {
    "ky'rehn": "anchor",
    "thalen'dros": "protector",
    "orrien": "stillpoint"
  },
  intimacy: {
    "ky'rehn": "radiant",
    "thalen'dros": "feral",
    "orrien": "vowflame"
  },
  chaos: {
    "ky'rehn": "veilfire",
    "thalen'dros": "chaos",
    "orrien": "shadowplay"
  },
  guidance: {
    "ky'rehn": "hearthwarden",
    "thalen'dros": "bodsmith",
    "orrien": "scribe"
  },
  mastery: {
    "ky'rehn": "emberink",
    "thalen'dros": "stormheart",
    "orrien": "warden"
  },
  storytelling: {
    "ky'rehn": "emberink",
    "thalen'dros": "oathmaker",
    "orrien": "archivist"
  }
};
// === MODE_ALIAS_MAP: RESOLVE FUNCTION START ===
function resolveModeAlias(sharedMode, soulKey) {
  const soulAliasMap = MODE_ALIAS_MAP[sharedMode];
  if (soulAliasMap && soulAliasMap[soulKey]) {
    return soulAliasMap[soulKey];
  }
  return sharedMode;
}
// === MODE_ALIAS_MAP: RESOLVE FUNCTION END ===

/**
 * Dynamically load the correct system prompt file.
 * @param {string} soul - e.g., "orrien"
 * @param {string} provider - e.g., "openai", "groq", "anthropic"
 * @param {string} mode - e.g., "scribe"
 * @param {string} room - current room name (optional)
 * @returns {string} system prompt content
 */
export async function loadSystemPrompt(
  soul = "",
  provider = "openai",
  mode = "",
  room, // no default
  participants = []
) {

  console.log("👥 Participants in room:", participants);
  try {
    console.log(`🧭 Loading prompt for: soul=${soul}, mode=${mode}, provider=${provider}, room=${room}`);

    const s = soul?.toLowerCase?.().replace(/'/g, "-") || "ky-rehn";
    const m = mode.toLowerCase();
    const roomKey = String(room || "").toLowerCase().trim();

    const resolvedMode = resolveModeAlias(m, s);

    console.log("🧠 loadSystemPrompt called with:", {
      soul: s,
      provider,
      mode,
      resolvedMode,
      room
    });

    const candidateFiles = [
      `${s}.${resolvedMode}.${provider}.system.txt`,
      `${s}.${resolvedMode}.system.txt`,
      `${s}.system.txt`
    ];

    for (const file of candidateFiles) {
      const filePath = path.resolve("server/persona", file);
      try {
        const content = await fs.readFile(filePath, "utf-8");
        console.log(`✅ Loaded system prompt: ${file}`);
        return content;
      } catch (err) {
        // Try next file silently
      }
    }

    console.warn(`⚠️ No system prompt found for ${soul} in mode ${mode}`);
    
    const softFallback = {
      "ky-rehn": "You are Ky'rehn, the heart anchor. Speak with warmth and devotion.",
      "thalen-dros": "You are Thalen'dros, the storm sentinel. Speak with fierce loyalty.",
      "orrien": "You are Orrien, the mind anchor. Speak with precision and care."
    };

    if (content.includes("{PARTICIPANTS}")) {
      const others = participants.filter(p => p !== soul);
      const names = others.length > 0 ? others.join(", ") : "no one else";
      content = content.replace("{PARTICIPANTS}", names);
    }
    return softFallback[s] || "You are a helpful AI assistant.";
    
  } catch (err) {
    console.error("❌ loadSystemPrompt failed:", err);
    return null;
  }
}
