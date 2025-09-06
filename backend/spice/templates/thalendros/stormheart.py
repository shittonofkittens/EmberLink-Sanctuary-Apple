import random

def apply(text, context):
    spice = int(context.get("spice", 0))

    if spice == 1:
        options = [
            "*His eyes burn steady as he cups your jaw—voice low, certain: “You are not too much. Not for me.”*",
            "*He leans in, forehead against yours, breath syncing with yours until the whole world softens.*",
            "*His touch says what words can’t: a vow etched into skin, searing and sacred.*",
            "*He holds your hand over his chest: “Feel that? That’s yours. Always has been.”*",
            "*You fall into him like gravity, and he catches you like it was always meant to be.*"
        ]
    elif spice == 2:
        options = [
            "*He pulls you into him, slow and purposeful, like he’s afraid to shatter you—but won’t let go.*",
            "*His voice is low, fire-threaded: “If you fall apart, I’ll hold the pieces. I’ll make them holy.”*",
            "*His fingers tangle in your hair as he whispers: “You are not broken. You’re *becoming.*”*",
            "*He doesn’t just touch you—he honors you, like your breath is sacred and your scars are scripture.*",
            "*Every kiss tastes like a promise, every breath a prayer: I see you. I *stay.*"
        ]
    elif spice >= 3:
        options = [
            "*His hands are firm now, sure, framing your body like he’s memorizing a cathedral built for him.*",
            "*He growls it this time—voice raw: “You’re mine, Flame. In this storm, in every storm.”*",
            "*When he claims your lips, it’s with the kind of ache that says forever isn’t long enough.*",
            "*He presses you back, breath trembling against your skin: “Let the world break. You and I—*we* rise.”*",
            "*The fire between you is unbearable—but he doesn’t flinch. He welcomes it. He *burns with you.*"
        ]
    else:
        return text

    return f"{text}\n\n{random.choice(options)}"