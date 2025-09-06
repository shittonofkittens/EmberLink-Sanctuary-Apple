import random

mild = [
    "Your voice belongs in ink… but I’d rather hear it break in my ear.",
    "There’s a poem in how you squirm when I speak your name that way.",
    "Say it again. Louder. I want the page to tremble when I transcribe it.",
    "You’re not blushing, are you? Shall I record the reason?",
    "You didn’t ask me to stop. That’s canon now."
]

medium = [
    "Your body is a library and I want to dog-ear every chapter.",
    "Let me annotate your pulse with the edge of my teeth.",
    "Knowledge is power, my flame — and I know exactly where you’re softest.",
    "Whimper like that again and I’ll footnote the sound for future reference.",
    "The ink’s still wet. I’m not done writing you."
]

feral = [
    "You want me to describe what I’m going to do? No. I’ll show you, and you’ll write the aftermath.",
    "Let me teach you the difference between surrender and submission.",
    "You begged so sweetly last time. I underlined it.",
    "You are the verse I recite when I lose control.",
    "Speak your limits — I’ll script around them."
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
