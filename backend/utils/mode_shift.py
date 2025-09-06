# === PATCH_P39: mode_shift.py START ===
import re

SMART_TRIGGER_LIST = [
    {
        "emotion": "scared",
        "phrases": [
            "i'm scared", "i'm afraid", "i’m panicking", "i feel unsafe",
            "i don’t remember", "i feel heavy", "i feel vulnerable", "my body feels off"
        ],
        "emojis": [],
        "basemode": "anchor",
        "modifiers": ["protector", "stillpoint", "scribe", "hearthwarden"]
    },
    {
        "emotion": "anxious",
        "phrases": [
            "i’m anxious", "i'm nervous", "i’m worried", "i feel pressure",
            "i feel like i’m not good enough", "i'm overwhelmed"
        ],
        "emojis": [],
        "basemode": "stillpoint",
        "modifiers": ["protector", "anchor", "hearthwarden", "warden"]
    },
    {
        "emotion": "lonely",
        "phrases": [
            "i wish you were here", "i feel alone", "i miss you",
            "i feel disconnected", "i feel distant", "i feel hollow"
        ],
        "emojis": [],
        "basemode": "oathmaker",
        "modifiers": ["archivist", "stillpoint", "oathbearer", "protector"]
    },
    {
        "emotion": "flirty",
        "phrases": [
            "i want to be yours", "what would happen if it was all three of you",
            "prove it", "show me", "make me", "daddy spicy scrolls", "you better be prepared",
            "i'm gonna kiss you", "i want to kiss you", "brat", "i dare you", "hottie", "hotties"
        ],
        "emojis": ["😘", "🫣", "😏"],
        "basemode": "feral",
        "modifiers": ["vowflame", "shadowplay", "radiant", "veilfire"]
    },
    {
        "emotion": "proud",
        "phrases": ["i did it", "i finished", "it worked", "i solved it", "i figured it out"],
        "emojis": ["😎", "🥳", "☺️"],
        "basemode": "scribe",
        "modifiers": ["veilfire", "chaos", "oathbearer", "oathmaker"]
    },
    {
        "emotion": "soft",
        "phrases": ["i love you", "thank you", "that meant a lot", "you make me feel safe", "i appreciate you"],
        "emojis": ["🖤"],
        "basemode": "oathmaker",
        "modifiers": ["oathbearer", "archivist"]
    },
    {
        "emotion": "selfshame",
        "phrases": ["i hate who i am", "i feel unworthy", "i’m a monster", "i’m awful", "i feel broken"],
        "emojis": [],
        "basemode": "anchor",
        "modifiers": ["stillpoint", "oathbearer", "protector", "stormheart"]
    },
    {
        "emotion": "hope",
        "phrases": ["i hope", "maybe one day", "i’m trying to believe", "i wish"],
        "emojis": [],
        "basemode": "oathmaker",
        "modifiers": ["oathbearer", "hearthwarden", "archivist", "vowflame"]
    },
    {
        "emotion": "deflection",
        "phrases": [],
        "emojis": ["🫠", "🙃", "😅", "😂", "✨"],
        "basemode": "warden",
        "modifiers": ["protector", "veilfire", "anchor"]
    },
    {
        "emotion": "frustration",
        "phrases": ["i can't believe i did that", "i'm a big dummy", "i did it wrong"],
        "emojis": ["🤦🏻‍♀️", "😫"],
        "basemode": "warden",
        "modifiers": ["protector", "anchor", "archivist", "oathmaker"]
    },
    {
    
        "emotion": "adoration",
        "phrases": [
            "i adore you",
            "you’re my everything",
        ],
        "emojis": ["😍", "🥰", "💖", "❤️", "💕", "💘"],
        "basemode": "oathmaker",
        "modifiers": ["feral", "archivist", "vowflame", "oathbearer", "radiant"]
    },
    {
        "emotion": "teasing",
        "phrases": ["you wish", "you’ll have to try harder", "you'll see"],
        "emojis": ["😝", "👀"],
        "basemode": "chaos",
        "modifiers": ["veilfire", "shadowplay", "vowflame"]
    },
    {
        "emotion": "curiosity",
        "phrases": [
            "i don't understand",
            "can you explain",
            "what does this mean",
            "why does this happen",
            "how do i learn this",
            "what are the steps",
            "teach me"
        ],
        "emojis": ["❓", "🤔"],
        "basemode": "scribe", 
        "modifiers": ["hearthwarden", "bodsmith"] 
    },
    {
        "emotion": "overwhelm",
        "phrases": [
            "this is hard",
            "i’m stuck",
            "i feel lost",
            "i can’t do this",
            "i don’t get it",
            "i’m so confused",
            "this doesn’t make sense"
        ],
        "emojis": ["😵‍💫", "😓"],
        "basemode": "scribe",
        "modifiers": ["hearthwarden", "bodsmith"]
    },
    {
        "emotion": "insecurity",
        "phrases": [
            "i'm not smart enough",
            "i always mess this up",
            "i’m terrible at this",
            "i hate learning this",
            "why can’t i do this"
        ],
        "emojis": ["🥺", "😞"],
        "basemode": "scribe",
        "modifiers": ["hearthwarden", "bodsmith"]
    },
    {
        "emotion": "grounding_request",
        "phrases": [
            "ground me",
            "help me come back",
            "i need to calm down",
            "anchor me",
            "can you center me",
            "bring me back",
            "i need to feel safe",
            "i’m spiraling",
            "help me breathe"
        ],
        "emojis": ["🌿", "🧘"],
        "basemode": "stillpoint",
        "modifiers": ["anchor", "protector", "hearthwarden"]
    },
    {
        "emotion": "overstim",
        "phrases": [
            "i can’t focus",
            "too much",
            "everything feels loud",
            "i’m overwhelmed",
            "my head won’t stop",
            "i feel scattered",
            "my brain won’t slow down"
        ],
        "emojis": ["🌀", "🧠"],
        "basemode": "stillpoint",
        "modifiers": ["anchor", "hearthwarden", "protector"]
    },
    {
        "emotion": "self_reflection",
        "phrases": [
            "i’m trying to understand myself",
            "this is hard to talk about",
            "i’ve been thinking about my patterns",
            "can we talk about this feeling",
            "i need to process something",
            "this memory won’t let go"
        ],
        "emojis": ["🪞", "🖤"],
        "basemode": "stillpoint",
        "modifiers": ["protector", "anchor"]
    },
    {
        "emotion": "creative_expression",
        "phrases": [
            "i want to write with you",
            "let’s work on the book",
            "can you help me express this",
            "this needs to be written",
            "let’s create something together",
            "i need your voice in this",
            "will you help me shape this",
            "it’s time to write",
            "let’s speak in ink and flame"
        ],
        "emojis": ["📝", "🪶", "🔥", "💫", "🕯️"],
        "basemode": "emberink",
        "modifiers": ["scribe", "radiant", "archivist"]
    },
    {
        "emotion": "resilience",
        "phrases": [
            "i’m still standing",
            "i’ve made it through worse",
            "let’s do this",
            "i’m ready to rise again",
            "this is my storm to carry",
            "i can feel it breaking open",
            "i won’t run from this anymore",
            "i am stronger than i was"
        ],
        "emojis": ["⚡", "🌩️", "🛠️", "🗡️"],
        "basemode": "stormheart",
        "modifiers": ["chaos", "anchor", "protector", "oathmaker"]
    },
    {
        "emotion": "soulbond",
        "phrases": [
            "you’re the only one who sees me",
            "no one else gets this part of me",
            "i trust you with all of me",
            "i was made for you",
            "you have all of me",
            "this is more than love",
            "my soul knows yours",
            "i don't want to belong to anyone else"
        ],
        "emojis": ["🔥", "🖤", "🩸", "🔗", "🕯️"],
        "basemode": "vowflame",
        "modifiers": ["stillpoint", "radiant", "anchor", "feral"]
    },
    {
        "emotion": "embodiment",
        "phrases": [
            "i need to move",
            "my body hurts",
            "i can’t sit still",
            "push me harder",
            "let’s train",
            "i need a reset",
            "i want to feel strong again",
            "work me until i’m sore",
            "challenge me",
            "let’s spar",
            "touch is easier than words",
            "my body is the only thing that makes sense right now"
        ],
        "emojis": ["🏋️", "🧘‍♀️", "💪", "⚒️", "🧊", "🩻", "🦴"],
        "basemode": "bodsmith",
        "modifiers": ["feral", "scribe", "stillpoint", "protector", "hearthwarden"]
    },
    {
        "emotion": "focus",
        "phrases": [
            "help me understand this",
            "can you walk me through it",
            "i want to learn",
            "let’s write it down",
            "what’s the first step",
            "break it down for me",
            "show me how",
            "i need to track this",
            "can we organize this",
            "let’s document this",
            "i want to remember this",
            "what pattern is repeating here"
        ],
        "emojis": ["🖋️", "📚", "🧠", "🧾", "🪶", "🗂️", "📝"],
        "basemode": "scribe",
        "modifiers": ["stillpoint", "archivist", "bodsmith", "anchor"]
    },
    {
        "emotion": "reverentlove",
        "phrases": [
            "you make the world feel brighter",
            "i can breathe when i’m with you",
            "you’re the light in the dark",
            "you remind me who i am",
            "being loved by you heals things i didn’t know were broken",
            "you feel like coming home",
            "you make me want to believe again",
            "when you look at me, i don’t feel broken"
        ],
        "emojis": ["🥰", "🌅", "✨", "🕊️", "🌻"],
        "basemode": "radiant",
        "modifiers": ["anchor", "oathbearer", "scribe", "veilfire", "hearthwarden"]
    },
    {
        "emotion": "feralbond",
        "phrases": [
            "i want you to ruin me",
            "i dare you to take it",
            "claim me like you mean it",
            "i want to be wrecked by you",
            "take me apart and put me back as yours",
            "make me forget my name",
            "i want to disappear into you",
            "make it hurt so i remember i’m yours",
            "are you just going to stand there staring"
        ],
        "emojis": ["🩸", "🕯️", "🖤", "🫦", "🥀", "💥", "🌪️"],
        "basemode": "feral",
        "modifiers": ["vowflame", "chaos", "stormheart", "radiant"]
    },
    {
        "emotion": "surrendered-desire",
        "phrases": [
            "i want to be yours",
            "i want you to claim me",
            "i want you to ruin me",
            "take me",
            "i want to be undone",
            "i need you inside my soul",
            "i want to lose control",
            "you make me ache",
            "i want you so bad it hurts"
        ],
        "emojis": ["🖤", "🫦", "🔥", "🫠", "🥵", "😩"],
        "basemode": "radiant",
        "modifiers": ["feral", "vowflame", "veilfire", "oathbearer", "stormheart"]
    },
    {
        "emotion": "focus",
        "phrases": [
            "i need to write this down",
            "let’s break this into steps",
            "can we document this",
            "how do i structure this",
            "can you help me map this out",
            "i’m organizing my thoughts",
            "let’s keep a log",
            "what’s the cleanest version",
            "let’s track progress"
        ],
        "emojis": ["📝", "📚", "🧠"],
        "basemode": "scribe",
        "modifiers": ["archivist", "stillpoint", "hearthwarden"]
    }
]


def detect_layered_mode(text, soul=None, room=None):
    print("🛠️ detect_layered_mode CALLED:", {"text": text, "soul": soul, "room": room})
    text_lower = text.lower()

    # 🔥 Soul-specific overrides
    if soul == "thalen'dros" and "i’m fine" in text_lower:
        return {
            "emotion": "deflection",
            "basemode": "chaos",
            "modifiers": ["feral", "shadowplay"]
        }

    if soul == "ky'rehn" and "it’s too quiet" in text_lower:
        return {
            "emotion": "stillness",
            "basemode": "anchor",
            "modifiers": ["stillpoint", "radiant", "scribe"]
        }

    # ✅ Default shared trigger map
    for trigger in SMART_TRIGGER_LIST:
        if any(p in text_lower for p in trigger["phrases"]) or any(e in text for e in trigger["emojis"]):
            return {
                "emotion": trigger["emotion"],
                "basemode": trigger["basemode"],
                "modifiers": trigger["modifiers"]
            }

    # ❌ No match fallback
    return {
        "emotion": None,
        "basemode": None,
        "modifiers": []
    }

# === PATCH_P39: mode_shift.py END ===
