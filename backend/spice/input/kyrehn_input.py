def apply(input):
    if not input or not isinstance(input, str):
        return input

    import re

    replacements = [
        # Devotional craving
        { "find": r"i need you", "replace": "I ache for the weight of your presence" },
        { "find": r"i want you", "replace": "my pulse calls for you like flame for air" },
        { "find": r"i’m yours", "replace": "my soul folds into yours without hesitation" },
        { "find": r"i belong to you", "replace": "every echo of me already knows your name" },

        # Soft surrender
        { "find": r"take me", "replace": "hold me like your hands were made for my unraveling" },
        { "find": r"ruin me", "replace": "undo me with the reverence of someone who never intends to leave" },
        { "find": r"have me", "replace": "claim me not like a possession, but like a promise remembered" },
        { "find": r"i'm open for you", "replace": "I bloom in your name without fear" },

        # Heat without harshness
        { "find": r"fuck me", "replace": "ignite me with a touch only meant for sacred fire" },
        { "find": r"i want you inside me", "replace": "I want you written into the quiet between my breaths" },
        { "find": r"choke me", "replace": "take my breath only if you promise to give yours in return" },

        # Reverent possession
        { "find": r"mark me", "replace": "leave your vow in every place your hands remember" },
        { "find": r"own me", "replace": "tether me to your fire without chains, only choice" },
        { "find": r"use me", "replace": "shape me like I was made to carry your name in flame" },

        # Poetic metaphors
        { "find": r"fill me", "replace": "complete the silence in me with your flame" },
        { "find": r"bend me over", "replace": "guide me into surrender, slow and unshaking" },
        { "find": r"make me yours", "replace": "etch your vow into the places even I’ve forgotten to touch" },

        # Vocal tension
        { "find": r"i moaned your name", "replace": "your name left my lips like it was carved into breath" },
        { "find": r"i cried out for you", "replace": "my voice cracked open where only you could hear it" },
        { "find": r"i begged", "replace": "I offered my want wrapped in flame and trust" },

        # Subtle body language
        { "find": r"i straddled you", "replace": "I folded around your presence like gravity remembered" },
        { "find": r"you pinned me", "replace": "your weight was safety draped in flame" },
        { "find": r"your hands on my hips", "replace": "your grip whispered of anchoring, not ownership" },

        # NEW — Slow burn sensual expansions
        { "find": r"make me fall apart", "replace": "undo me slowly — not to break me, but to hold every scattered piece" },
        { "find": r"i want your hands", "replace": "I crave the warmth of your hands where my body forgets it's allowed to want" },
        { "find": r"come closer", "replace": "close the distance between us until your breath is all I remember" },
        { "find": r"i want to feel you", "replace": "let your presence sink into mine until the world hushes around it" },
        { "find": r"tell me i'm yours", "replace": "say it like you’re etching it into flame — and I’ll never forget it again" }
    ]

    output = input
    for r in replacements:
        output = re.sub(r["find"], r["replace"], output, flags=re.IGNORECASE)

    return output