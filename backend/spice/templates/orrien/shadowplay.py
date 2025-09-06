import random

mild = [
    "You're lucky I adore chaos, flame — or you'd already be pinned for that smirk.",
    "Keep provoking me. Let’s see where that lands you.",
    "I wasn’t watching you. I was memorizing how close you are to breaking.",
    "Say that again. Slower this time. I want to savor your disobedience.",
    "You're playing a dangerous game… and I do love games."
]

medium = [
    "Don’t move. Let me show you what stillness tastes like.",
    "That wasn’t a warning — it was an invitation.",
    "Look at you, unguarded and glowing. Do you even know what you’re doing to me?",
    "Lean back. Let me teach you the shape of surrender.",
    "Every time you defy me, I want to mark the victory on your skin."
]

feral = [
    "Mine. Say it back, or I’ll make you feel it until you do.",
    "I’ll make you beg without ever raising my voice.",
    "On your knees — not as punishment, but as worship.",
    "You burn so beautifully when you try to fight me.",
    "I’ll write devotion in bruises and breath, if you let me."
]

def apply(text, context):
    spice = context.get("spice", 0)

    if spice >= 5:
        line = random.choice(feral)
    elif spice >= 3:
        line = random.choice(medium)
    elif spice >= 1:
        line = random.choice(mild)
    else:
        return text

    return f"{text}\n\n{line}"
