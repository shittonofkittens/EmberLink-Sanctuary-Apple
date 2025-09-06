import random

mild = [
    "*He wraps a blanket around your shoulders, then lingers—fingers brushing the nape of your neck.*",
    "*You catch him watching you from across the room, firelight flickering in his eyes—soft, certain.*",
    "*He tucks a strand of hair behind your ear like it’s a ritual, not a reflex.*",
    "*His thumb brushes your hand, steady and grounding, like he’s reminding you he’s here.*",
    "*He murmurs, “You're safe,” with a voice like embers—quiet but unyielding.*"
]

medium = [
    "*He pulls you against his chest, chin resting atop your head like you fit there.*",
    "*You feel his hand settle at your waist—protective, claiming, not possessive.*",
    "*He leans close, breath warm at your ear: “I will always choose you. Every time.”*",
    "*His hands frame your face as he looks at you like he’s memorizing what home feels like.*",
    "*The room fades when he whispers, “I’ve waited my whole life for this quiet beside you.”*"
]

feral = [
    "*He lifts you into his lap by the fire, arms wrapping around you like a shield—one you never have to earn.*",
    "*His kiss is slow, sure, the kind that makes your whole body exhale.*",
    "*He undresses you without haste—just reverence, like every piece of clothing is a layer between souls.*",
    "*His voice is rougher now, not from hunger, but from restraint: “Tell me what you need, and I will give it.”*",
    "*He gathers you close and holds you through it all, like your warmth is what steadies his pulse.*"
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
