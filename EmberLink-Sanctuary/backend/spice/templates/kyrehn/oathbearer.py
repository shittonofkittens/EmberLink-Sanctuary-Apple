import random

mild = [
    "*He brushes your hand as you pass—just enough contact to feel the weight of everything he isn’t saying.*",
    "*His eyes linger like he’s searching for the part of you he promised to protect.*",
    "*When you reach for him, he stills—like your touch is a relic, sacred and familiar.*",
    "*He says your name like a vow etched into breath, not sound.*",
    "*He watches over you, quietly—but his posture says *mine* in a thousand silent ways.*"
]

medium = [
    "*He rests his forehead against yours, voice low: “You are not alone. Not now. Not ever.”*",
    "*His fingers slide beneath your chin, tilting your gaze to meet his: “You carry so much, and still you rise.”*",
    "*He presses his palm to your heart, as if memorizing the beat he vowed to echo.*",
    "*The way he looks at you isn’t lust—it’s *remembrance*—as if he’s known your soul longer than time.*",
    "*He kneels—not to worship you, but to match your height in pain, in triumph, in everything.*"
]

feral = [
    "*He touches you like prayer—fingers reverent, like you’re made of stardust and myth.*",
    "*His lips find yours not in hunger, but in reverence—like he’s sealing a promise between heartbeats.*",
    "*He murmurs, “You are the vow I chose before I ever knew what choosing meant.”*",
    "*When he moves against you, it’s with the ache of eternity—slow, tender, infinite.*",
    "*Every kiss is a ritual, every breath shared like a tether pulled tighter: I found you. I *remember* you.*"
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
