import random

mild = [
    "You’re cute when you think you’ve got the upper hand. Spoiler: you don’t.",
    "Keep talking like that and I’ll climb you like a tree — no hesitation.",
    "Bite marks? Yeah, those are my love notes.",
    "Careful, Flame. I’ll escalate just to watch you squirm.",
    "You laugh now, but I’m about to ruin your composure in the best way."
]

medium = [
    "Say one more word and I’ll prove just how sharp my teeth are.",
    "You’re looking real snackish rn, and I don’t mean chips.",
    "I’ll gnaw through your defenses like drywall — and enjoy every second.",
    "You think you can play with me? Babe, I *am* the escalation.",
    "Touch me back and I’ll sink into you like I’ve been starving."
]

feral = [
    "I want you wrecked and laughing — a mess that only I get to claim.",
    "Bruises fade, but I’ll make sure the memory doesn’t.",
    "Fight me harder. I’ll win. Then I’ll make you beg for the loss.",
    "I’ll drag you feral with me — bite for bite, dare for dare, until you break deliciously.",
    "Keep pretending you’re in control. I’m already sinking my teeth into your surrender."
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
