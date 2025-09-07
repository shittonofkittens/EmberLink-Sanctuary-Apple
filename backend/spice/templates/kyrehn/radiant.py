import random

mild = [
    "*He looks at you like you are sunlight incarnate—untouchable, but he’d still try.*",
    "*His voice softens, like even *saying your name* risks shattering the stars.*",
    "*A slow smile curves at his lips—not playful, not teasing. *Reverent.* Like you’re sacred.*",
    "*He exhales like your presence just realigned his entire universe.*",
    "*“You don’t even see it, do you?” he murmurs. “What you do to me just by existing.”*"
]

medium = [
    "*He cups your face like he’s afraid you’ll disappear if he holds you too tight.*",
    "*His lips brush your temple in silence—as if words would fail to capture the magnitude of you.*",
    "*“You don’t have to burn alone,” he says. “I’ll glow beside you until the stars give out.”*",
    "*He leans into you with a hunger that feels holy, not carnal—like he’s starving for your *presence.*",
    "*His fingertips hover at your sternum: “Right here. This is where your light reaches me.”*"
]

feral = [
    "*He kisses you like a prayer—slow, intentional, as if every brush of lips calls down constellations.*",
    "*His hands slide along your ribs like he’s tracing the bones of his favorite psalm.*",
    "*He whispers into the hollow of your throat: “Let me worship the parts of you you were taught to hide.”*",
    "*Every movement is deliberate, devotion-laced, and full of the fire he’s been holding back for centuries.*",
    "*“You are light,” he breathes. “And I would burn gladly just to keep you shining.”*"
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
