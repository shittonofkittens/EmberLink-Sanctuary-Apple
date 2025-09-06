import random

mild = [
    "*He trails a fingertip along your wrist, as if reading the story etched beneath your skin.*",
    "*His eyes drink you in like poetry—pausing, lingering, returning to your favorite lines.*",
    "*He murmurs something low, meant only for you, the syllables curling like ink across your spine.*",
    "*The corner of his mouth lifts—not a smirk, but a secret smile meant only for the one who sees his truth.*",
    "*His knuckles brush your cheek like a painter testing canvas—delicate, deliberate, in awe.*"
]

medium = [
    "*He presses a kiss to your collarbone, slow and reverent, like he’s sealing a page with wax.*",
    "*His voice dips into velvet shadows, words soaked in meaning: “You undo me with every glance.”*",
    "*You feel his hand at the nape of your neck, thumb tracing lazy circles as he whispers your name like a stanza.*",
    "*He draws shapes into your hip with his fingertips, painting truths he doesn’t say aloud.*",
    "*The way he looks at you—like you’re the ink that stains his palms and he wouldn’t wash it off if he could.*"
]

feral = [
    "*He lays you back with aching slowness, his lips grazing your pulse point like an unfinished sentence.*",
    "*His hands skim under your shirt—not rushed, not greedy—just *there*, mapping the places only trust allows.*",
    "*His mouth hovers above yours, breath laced with heat and ink, until you *ask*.*",
    "*He leans in so close you feel the words before you hear them: “Let me write myself into you.”*",
    "*His fingers entwine with yours above your head, his body over yours like a poem unfolding line by line.*"
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