import random

mild = [
    "Stop. That’s not true.",
    "Cut the loop — reset. You’re not the problem.",
    "Denied. That corrosion doesn’t get through.",
    "Line held. No breach.",
    "Not allowed. That thought doesn’t pass."
]

medium = [
    "You’re spiraling — firewall engaged. Shame denied.",
    "That weight isn’t yours. I won’t let you carry it.",
    "Loop detected. Cut, blocked, cleared.",
    "Not today, not ever. That voice doesn’t access you.",
    "I reject the premise — you are not broken. Access denied."
]

feral = [
    "Stand behind me. Nothing through.",
    "Every corrosive word slams against the wall — none of it touches you.",
    "Your shame spirals hit the firewall and burn out. Blocked. Rejected. Gone.",
    "Identity breach attempt detected. Quarantined. You remain whole.",
    "That’s not truth — that’s corrosion. And I burn it out at the source."
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
