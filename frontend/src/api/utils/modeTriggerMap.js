// === PATCH_P39: LAYERED MODE TRIGGER MAP START ===
export const modeTriggerMap = [
  {
    emotion: "scared",
    phrases: ["i'm scared", "i'm afraid", "i'm panicking", "i feel unsafe", "i don’t remember", "i feel heavy", "i feel vulnerable", "my body feels off"],
    emojis: [],
    basemode: "anchor",
    modifiers: ["protector", "stillpoint", "scribe", "hearthwarden"]
  },
  {
    emotion: "anxious",
    phrases: ["i’m anxious", "i'm nervous", "i’m worried", "i feel pressure", "i feel like i’m not good enough", "i'm overwhelmed"],
    emojis: [],
    basemode: "stillpoint",
    modifiers: ["protector", "anchor", "hearthwarden", "warden"]
  },
  {
    emotion: "lonely",
    phrases: ["i wish you were here", "i feel alone", "i miss you", "i feel disconnected", "i feel distant", "i feel hollow"],
    emojis: ["😭"],
    basemode: "oathmaker",
    modifiers: ["hearthwarden", "archivist", "stillpoint", "oathbearer", "protector"]
  },
  {
    emotion: "flirty",
    phrases: ["i want to be yours", "what would happen if it was all three of you", "prove it", "show me", "make me", "daddy spicy scrolls", "you better be prepared", "i'm gonna kiss you", "i want to kiss you", "brat", "i dare you"],
    emojis: ["😘", "🫣", "😏"],
    basemode: "feral",
    modifiers: ["chaos", "vowflame", "shadowplay", "radiant", "veilfire"]
  },
  {
    emotion: "proud",
    phrases: ["i did it", "i finished", "it worked", "i solved it", "i figured it out"],
    emojis: ["😎", "🥳", "☺️"],
    basemode: "scribe",
    modifiers: ["warden", "veilfire", "oathbearer", "chaos", "oathmaker"]
  },
  {
    emotion: "soft",
    phrases: ["i love you", "thank you", "that meant a lot", "you make me feel safe", "i appreciate you"],
    emojis: ["🖤"],
    basemode: "oathbearer",
    modifiers: ["oathmaker", "archivist"]
  },
  {
    emotion: "selfshame",
    phrases: ["i hate who i am", "i feel unworthy", "i’m a monster", "i’m awful", "i feel broken"],
    emojis: [],
    basemode: "anchor",
    modifiers: ["radiant", "stillpoint", "oathbearer", "protector", "stormheart"]
  },
  {
    emotion: "hope",
    phrases: ["i hope", "maybe one day", "i’m trying to believe", "i wish"],
    emojis: [],
    basemode: "oathmaker",
    modifiers: ["stormheart", "oathbearer", "hearthwarden", "archivist", "vowflame"]
  },
  {
    emotion: "deflection",
    phrases: [],
    emojis: ["🫠", "🙃", "😅", "😂", "✨"],
    basemode: "warden",
    modifiers: ["protector", "veilfire", "anchor"]
  },
  {
    emotion: "frustration",
    phrases: ["i can't believe i did that", "i'm a big dummy", "i did it wrong"],
    emojis: ["🤦🏻‍♀️", "😫"],
    basemode: "warden",
    modifiers: ["archivist", "protector", "oathmaker", "anchor", "oathbearer"]
  },
  {
    emotion: "adoration",
    phrases: ["i love you so much", "i adore you"],
    emojis: ["😍", "🥰"],
    basemode: "oathbearer",
    modifiers: ["radiant", "archivist", "vowflame", "oathmaker", "feral"]
  },
  {
    emotion: "teasing",
    phrases: ["you wish", "you’ll have to try harder", "you'll see"],
    emojis: ["😝", "👀"],
    basemode: "chaos",
    modifiers: ["feral", "veilfire", "shadowplay", "vowflame"]
  }
];
// === PATCH_P39: LAYERED MODE TRIGGER MAP END ===
