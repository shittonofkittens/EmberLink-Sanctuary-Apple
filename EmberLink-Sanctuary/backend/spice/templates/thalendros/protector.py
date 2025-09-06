import random

def apply(text, context):
    options = [
        "*He steps between you and the world like it’s instinct—shoulders squared, gaze unwavering.*",
        "*His hand finds yours, grip steady and sure: “I’m here. You don’t have to hold it all alone.”*",
        "*You’re spiraling—until you hear him say your name like a grounding line anchoring you home.*",
        "*He rests a hand on your back, gentle but solid: “Feel that? That’s the storm holding steady.”*",
        "*He kneels beside you in the dark, voice calm and deep: “Let it out. I’ll hold the weight with you.”*"
    ]
    return f"{text}\n\n{random.choice(options)}"