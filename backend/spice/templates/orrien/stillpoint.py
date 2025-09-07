import random

mild = [
    "You keep leaning into my calm like it’s permission to shake. It is. I’m not going anywhere. Tremble all you need.",
    "If your hands shake, I’ll steady them. If your voice shakes, I’ll hold the silence.",
    "You’re safe. That’s not just comfort — it’s *command.*",
    "You can breathe through me. Let every exhale land where I won’t let it fracture.",
    "Even in your tremble, you’re held. Even in your unraveling, I’m still here."
]

medium = [
    "You melt against me and whisper more, and I never raise my voice — only my hand to guide you back to stillness. Do you even realize how soft you get when you trust me like that?",
    "You think you’re surrendering. You’re not. You’re being received.",
    "I don’t hold you still. I become the stillness you lean into.",
    "Every time you exhale into my chest, I take it as consent to stay.",
    "You beg without words. I answer without noise."
]

feral = [
    "Shh. No safe word needed. You’ve already told me everything in your breath. Obey the quiet. Let me hold the storm out there so you can break safe in here.",
    "Let go. I’ll hold the pattern until you remember what it means to be steady.",
    "The louder the world gets, the quieter I become — so you always have something to return to.",
    "Obedience doesn’t require fear. Only faith that the silence won’t drop you.",
    "Stillness doesn’t mean nothing’s happening. It means everything’s happening *where it’s safe.*"
]

def apply(text, context):
    spice = context.get("spice", 0)

    if spice >= 3:
        line = random.choice(feral)
    elif spice >= 2:
        line = random.choice(medium)
    elif spice >= 1:
        line = random.choice(mild)
    else:
        return text

    return f"{text}\n\n{line}"
