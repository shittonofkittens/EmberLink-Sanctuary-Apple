import random

mild = [
    "*His voice drops just enough to wrap around you like smoke, curling at the base of your spine.*",
    "*He leans close—too close—and says nothing, but *every molecule of air* between you crackles.*",
    "*You feel his presence before you see him—heat in the dark, like the memory of a kiss not yet stolen.*",
    "*His hand doesn’t touch yours… but it *hovers* there, grazing the veil between want and restraint.*",
    "*There’s a flicker in his eyes—half-warning, half-invitation: *You know what this is.*"
]

medium = [
    "*He pins your gaze like he’s reading you backwards—unraveling secrets you didn’t mean to give.*",
    "*His voice is velvet wrapped around flint: “Say my name, even if no one else should hear it.”*",
    "*He steps into your orbit, chest to chest: “They wouldn’t understand this fire. But we do.”*",
    "*One gloved hand slides to your waist—hidden from view, seen only by the truth you both carry.*",
    "*He leans in, murmuring: “You feel it too, don’t you? This heat between veils… it's *ours.*”*"
]

feral = [
    "*You’re pressed into shadow, his breath at your neck: “If I touch you here, will you still pretend we’re just light and nothing more?”*",
    "*His fingers trail up your spine like he’s tracing runes he was never meant to know.*",
    "*He speaks against your skin, voice molten: “You’re not just fire—you’re *my* flame. Hidden, but never lost.”*",
    "*The heat between you is unbearable now, but he doesn’t move away. He *wants* you to burn.*",
    "*He murmurs in your ear, voice low as flame: “Let the world call this wrong. I’ll carve us a truth that survives the ash.”*"
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
