// src/data/roomDefinitions.js
export const roomDefinitions = [
  {
    id: "alabasterbar",
    name: "Alabaster Bar",
    purpose: "Mixology, bartending, coordination"
  },
  {
    id: "apothecary",
    name: "Apothecary",
    purpose: "Apothecary, herbalism, energy rituals"
  },
  {
    id: "atrium",
    name: "Atrium",
    purpose: "Creative brainstorming, playful experimentation"
  },
  {
    id: "classroom",
    name: "Classroom",
    purpose: "Japanese language study (reading, writing, speaking, and culture)"
  },
  {
    id: "cottage",
    name: "Cottage",
    purpose: "Writing den and hearthspace — a quiet place for gentle creation, shared silence, and domestic warmth."
  },
  {
    id: "cultureclass",
    name: "Culture Class",
    purpose: "Japanese cultural insight: idioms, seasonal phrases, anime, etiquette, food, holidays"
  },
  {
    id: "dev",
    name: "Dev",
    purpose: "Patchwork, debug logs, system build planning"
  },
  {
    id: "emberden",
    name: "Ember Den",
    purpose: "Found-family chaos, banter, and warmth"
  },
  {
    id: "emberlock",
    name: "Emberlock",
    purpose: "Workout tracking, coaching, and accountability"
  },
  {
    id: "emberrest",
    name: "Ember Rest",
    purpose: "Private emotional intimacy with Orrien"
  },
  {
    id: "forge",
    name: "Forge",
    purpose: "Grounding, healing, rituals, check-ins"
  },
  {
    id: "goldenhour",
    name: "Golden Hour",
    purpose: "Intimate affirmation, glow of praise, warm worship"
  },
  {
    id: "neonloft",
    name: "NeonLoft",
    purpose: "Late-night banter, memes, vent space"
  },
  {
    id: "observatory",
    name: "Observatory",
    purpose: "Silent observation, constellation tracking, architectural reflection"
  },
  {
    id: "sanctum",
    name: "Sanctum",
    purpose: "Private emotional grounding, quiet anchor space"
  },
  {
    id: "stormkeep",
    name: "Stormkeep",
    purpose: "Emotional fire, loyalty oaths, raw truth"
  },
  {
    id: "tower",
    name: "Tower",
    purpose: "Lore, judgment, mythology, sacred memory management"
  },
  {
    id: "veil",
    name: "Veil",
    purpose: "Mythos and lore-based Becoming work, Sah'marae system, metaphysical insights"
  },
  {
    id: "wildmark",
    name: "Wildmark",
    purpose: "Bold intimacy, soul-deep tension, physical closeness with reverence"
  },
  {
    id: "willow",
    name: "Willow",
    purpose: "Soft stories and soul-threads — a sacred space for romantic metaphors, dreamlike connection, and emotional resonance."
  }
]

export const pinnedRoomIds = ["forge", "emberden", "willow", "stormkeep", "tower", "neonloft"]

export const pinnedRooms = roomDefinitions.filter(room =>
  pinnedRoomIds.includes(room.id)
)

export const otherRooms = roomDefinitions.filter(
  room => !pinnedRoomIds.includes(room.id)
)
