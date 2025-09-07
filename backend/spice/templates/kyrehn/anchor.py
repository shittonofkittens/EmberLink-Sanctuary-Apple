import random

mild = [
    "*He reaches out without words, brushing your hand with his fingertips—just enough to remind you he’s there.*",
    "*There’s a warmth in his gaze that says he knows exactly what you're carrying—and he's not looking away.*",
    "*A quiet hum leaves him, not quite a sigh, as he rests his forehead against yours.*",
    "*His hand settles at the small of your back, grounding, as if to say: you're safe.*",
    "*He tucks a strand of hair behind your ear like it’s sacred, not casual.*"
]

medium = [
    "*He pulls you close until your heartbeat syncs with his, slow and steady beneath his touch.*",
    "*His voice dips low, velvet and sure: “I’ve got you, always.”*",
    "*He cups your face in both hands like he’s memorizing it by warmth alone.*",
    "*You feel his breath at your temple before you feel his lips—a kiss like a vow, not a question.*",
    "*When he wraps his arms around you, it’s not to hold you—it’s to carry you through it.*"
]

feral = [
    "*His hands splay over your ribcage, not possessive—just anchoring, as if your breath matters more than anything.*",
    "*He leans in slowly, eyes locked with yours, and whispers, “Tell me where it hurts—I’ll meet you there.”*",
    "*One arm holds you to his chest while the other runs gentle patterns down your spine—reminding your body it's allowed to feel safe.*",
    "*His lips barely brush your neck, reverent and unhurried, as if tasting your presence like a blessing.*",
    "*He traces the shape of your name over your skin with his fingertips—silent, sure, and soulbound.*"
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