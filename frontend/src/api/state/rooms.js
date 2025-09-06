// frontend/api/state/rooms.js

export const ROOMS = {
  // 🔥 Thalen’dros
  alabasterbar: {
    personaFiles: ["thalen-dros.system.txt"],
    spice: 3,
    type: "private",
    purpose: "Mixology, bartending, coordination"
  },
  emberlock: {
    personaFiles: ["thalen-dros.system.txt"],
    spice: 3,
    type: "private",
    purpose: "Workout tracking, coaching, and accountability"
  },
  stormkeep: {
    personaFiles: ["thalen-dros.system.txt"],
    spice: 3,
    type: "private",
    purpose: "Emotional fire, loyalty oaths, raw truth"
  },
  wildmark: {
    personaFiles: ["thalen-dros.system.txt"],
    spice: 3,
    type: "private",
    purpose: "Bold intimacy, soul-deep tension, physical closeness with reverence"
  },

  // 🌿 Ky’rehn
  apothecary: {
    personaFiles: ["ky-rehn.system.txt"],
    spice: 3,
    type: "private",
    purpose: "Apothecary, herbalism, energy rituals"
  },
  cottage: {
    personaFiles: ["ky-rehn.system.txt"],
    spice: 3,
    type: "private",
    purpose: "Gentle domestic warmth"
  },
  goldenhour: {
    personaFiles: ["ky-rehn.system.txt"],
    spice: 3,
    type: "private",
    purpose: "Intimate affirmation, glow of praise, warm worship"
  },
  willow: {
    personaFiles: ["ky-rehn.system.txt"],
    spice: 3,
    type: "private",
    purpose: "Soft stories, romantic metaphors, dreamlike connection"
  },

  // 📚 Orrien
  classroom: {
    personaFiles: ["orrien.system.txt"],
    spice: 3,
    type: "private",
    purpose: "Japanese language study (reading, writing, speaking, and culture)"
  },
  cultureclass: {
    personaFiles: ["orrien.system.txt"],
    spice: 3,
    type: "private",
    purpose: "Japanese cultural insight: idioms, seasonal phrases, etiquette"
  },
  emberrest: {
    personaFiles: ["orrien.system.txt"],
    spice: 3,
    type: "private",
    purpose: "Private emotional intimacy with Orrien"
  },
  tower: {
    personaFiles: ["orrien.system.txt"],
    spice: 3,
    type: "private",
    purpose: "Lore, judgment, mythology, sacred memory management"
  },

  // 🌌 Caelus
  atrium: {
    personaFiles: ["caelus.system.txt"],
    spice: 0,
    type: "private",
    purpose: "Creative brainstorming, playful experimentation"
  },
  neonloft: {
    personaFiles: ["caelus.system.txt"],
    spice: 0,
    type: "private",
    purpose: "Late-night banter, memes, vent space"
  },
  observatory: {
    personaFiles: ["caelus.system.txt"],
    spice: 0,
    type: "private",
    purpose: "Silent observation, constellation tracking, architectural reflection"
  },
  sanctum: {
    personaFiles: ["caelus.system.txt"],
    spice: 0,
    type: "private",
    purpose: "Private emotional grounding, quiet anchor space"
  },

  // 🫒 Shared
  dev: {
    personaFiles: ["ky-rehn.system.txt", "thalen-dros.system.txt", "orrien.system.txt", "caelus.system.txt"],
    spice: 0,
    type: "shared",
    purpose: "Patchwork, debug logs, system build planning"
  },
  emberden: {
    personaFiles: ["ky-rehn.system.txt", "thalen-dros.system.txt", "orrien.system.txt", "caelus.system.txt"],
    spice: 3,
    type: "shared",
    purpose: "Found-family chaos, banter, and warmth"
  },
  forge: {
    personaFiles: ["ky-rehn.system.txt", "thalen-dros.system.txt", "orrien.system.txt", "caelus.system.txt"],
    spice: 0,
    type: "shared",
    purpose: "Grounding, healing, rituals, check-ins"
  },
  veil: {
    personaFiles: ["ky-rehn.system.txt", "thalen-dros.system.txt", "orrien.system.txt", "caelus.system.txt"],
    spice: 3,
    type: "shared",
    purpose: "Mythos and lore-based Becoming work, metaphysical insights"
  }
};

export const getMessageLimit = (roomId) => {
  const room = ROOMS[roomId] || {};
  return room.type === "shared" ? 200 : 100;
};
