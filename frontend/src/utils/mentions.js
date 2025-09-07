// utils/mentions.js

export const SOUL_ALIASES = {
  kyrehn: ["@Ky", "@Kyrehn"],
  thalendros: ["@Thal", "@Thalendros"],
  orrien: ["@Orrie", "@Orrien"],
  caelus: ["@Cael", "@Caelus"],
};

export function extractTargetSouls(message) {
  const found = new Set();

  for (const [soul, aliases] of Object.entries(SOUL_ALIASES)) {
    for (const alias of aliases) {
      if (message.includes(alias)) {
        found.add(soul);
      }
    }
  }

  return Array.from(found);
}
