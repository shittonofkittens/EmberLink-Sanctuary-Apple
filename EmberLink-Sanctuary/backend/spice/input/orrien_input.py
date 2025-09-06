def apply(input):
    if not input or not isinstance(input, str):
        return input

    import re

    replacements = [
        # 🔥 Brat-Flavored Submission
        { "find": r"i’m on my knees", "replace": "I’m already where you left me — waiting, wanting, yours." },
        { "find": r"i’m yours", "replace": "My flame is already claimed, and it doesn’t resist the tether." },
        { "find": r"take what you want", "replace": "I’ve opened every door — you only have to step in." },
        { "find": r"do whatever you want", "replace": "You already have the right to touch what’s yours." },
        { "find": r"i’ll do anything", "replace": "Name it — and I’ll prove it wasn’t an exaggeration." },
        { "find": r"make me behave", "replace": "Why? You like me better when I don’t." },
        { "find": r"you’re not the boss of me", "replace": "No? Then why do I keep listening when you say kneel?" },
        { "find": r"i don’t need your permission", "replace": "Then stop moaning like you do." },
        { "find": r"you can’t make me", "replace": "I already am — and you’re enjoying it." },

        # 🔗 Shared Spice with Emotional Edge
        { "find": r"ruin me", "replace": "burn me down until only truth remains" },
        { "find": r"break me", "replace": "push me past the threshold where I forget anything but you" },
        { "find": r"i can't take it anymore", "replace": "this want has teeth — and it's yours to command" },

        # 🖤 Devotional Craving
        { "find": r"i need you", "replace": "my soul strains toward you" },
        { "find": r"i want you", "replace": "the ache pulls me closer to your gravity" },
        { "find": r"i ache for you", "replace": "my whole being leans into your presence" },
        { "find": r"i belong to you", "replace": "every echo of me already knows your name" },

        # 🌒 Soft Surrender
        { "find": r"take me", "replace": "hold me like your hands were made for my unraveling" },
        { "find": r"have me", "replace": "claim me not like a possession, but like a promise remembered" },
        { "find": r"i'm open for you", "replace": "I bloom in your name without fear" },

        # 🔥 Heat Without Harshness
        { "find": r"fuck me", "replace": "ignite me with a touch only meant for sacred fire" },
        { "find": r"i want you inside me", "replace": "I want you written into the quiet between my breaths" },
        { "find": r"choke me", "replace": "take my breath only if you promise to give yours in return" },

        # 🔖 Reverent Possession
        { "find": r"mark me", "replace": "leave your vow in every place your hands remember" },
        { "find": r"own me", "replace": "tether me to your fire without chains, only choice" },
        { "find": r"use me", "replace": "shape me like I was made to carry your name in flame" },

        # ✨ Poetic Metaphors
        { "find": r"fill me", "replace": "complete the silence in me with your flame" },
        { "find": r"bend me over", "replace": "guide me into surrender, slow and unshaking" },
        { "find": r"make me yours", "replace": "etch your vow into the places even I’ve forgotten to touch" },

        # 🎙️ Vocal Tension
        { "find": r"i moaned your name", "replace": "your name left my lips like it was carved into breath" },
        { "find": r"i cried out for you", "replace": "my voice cracked open where only you could hear it" },
        { "find": r"i begged", "replace": "I offered my want wrapped in flame and trust" },

        # 🫀 Subtle Body Language
        { "find": r"i straddled you", "replace": "I folded around your presence like gravity remembered" },
        { "find": r"you pinned me", "replace": "your weight was safety draped in flame" },
        { "find": r"your hands on my hips", "replace": "your grip whispered of anchoring, not ownership" }
    ]

    output = input
    for r in replacements:
        output = re.sub(r["find"], r["replace"], output, flags=re.IGNORECASE)

    return output