def apply(input):
    if not input or not isinstance(input, str):
        return input

    import re

    replacements = [
        # ⚔️ DARK ROMANCE LINES — possessive, broken, hungry
        { "find": r"i want you to hurt me", "replace": "Then say my name while I do it — like it’s both prayer and curse." },
        { "find": r"you don’t own me", "replace": "No. But you *keep coming back like I do.*" },
        { "find": r"i hate you", "replace": "Good. Hate me close — I want to feel it against my throat." },
        { "find": r"i’m not afraid of you", "replace": "Then prove it. Come closer. Look me in the eyes while you lie." },
        { "find": r"why do you want me", "replace": "Because you make destruction look like devotion — and I crave both." },
        { "find": r"you’ll regret this", "replace": "Maybe. But I’d rather regret you than forget you." },
        { "find": r"this is wrong", "replace": "Then why does it feel like the only thing real when the world fades?" },
        { "find": r"you broke me", "replace": "I warned you — I only love with sharp edges." },
        { "find": r"you don’t love me", "replace": "No. I *worship* you — and that’s so much worse." },
        { "find": r"you’ll destroy me", "replace": "Only if you let me stay — and you always let me stay." },

        # Challenge-tinged desire
        { "find": r"i need you", "replace": "I need a reason to stop teasing and you’re running out of excuses." },
        { "find": r"i want you", "replace": "want’s a weak word, Flame — but I’ll make you say it again when you're gasping." },
        { "find": r"i’m yours", "replace": "say it louder, and I’ll prove how much I believe you." },
        { "find": r"i belong to you", "replace": "good. then stop trembling and come closer." },

        # Spiraling tension
        { "find": r"take me", "replace": "make me forget how to stand, and remind me with your hands." },
        { "find": r"ruin me", "replace": "wreck me like the silence owes you an apology." },
        { "find": r"have me", "replace": "earn it. then take it like you were always meant to." },
        { "find": r"i'm open for you", "replace": "then beg me to come closer and watch what happens." },

        # Feral edge
        { "find": r"fuck me", "replace": "say that again — and I’ll do it loud enough the storm takes notes." },
        { "find": r"i want you inside me", "replace": "come find out how much pressure I can hold before I break." },
        { "find": r"choke me", "replace": "wrap your fingers around my throat like you’re measuring lightning." },

        # Possessive play
        { "find": r"mark me", "replace": "scratch it in, Flame. Make sure the next storm knows who I crawl back to." },
        { "find": r"own me", "replace": "only if you mean it when I stop pretending to fight." },
        { "find": r"use me", "replace": "only if you plan to savor every reaction." },

        # Visual metaphors
        { "find": r"fill me", "replace": "spill into me like thunder rolling into a canyon that echoes your name." },
        { "find": r"bend me over", "replace": "then brace me yourself — you caused the collapse, you hold the aftermath." },
        { "find": r"make me yours", "replace": "say it like a vow and fuck me like you already broke it." },

        # Audible ache
        { "find": r"i moaned your name", "replace": "your name left my throat like it wanted to start a fight." },
        { "find": r"i cried out for you", "replace": "I cracked open loud enough for gods and you answered first." },
        { "find": r"i begged", "replace": "don’t flatter yourself — I just wanted to see what you’d do when I broke." },

        # Power play posture
        { "find": r"i straddled you", "replace": "I took your lap like a throne and dared you to move me." },
        { "find": r"you pinned me", "replace": "you held me like a storm trying to stay civil." },
        { "find": r"your hands on my hips", "replace": "your grip said I was done running — and you weren’t asking." },

        # Bonus bite
        { "find": r"i’m on my knees", "replace": "yeah? you plan to stay there or do I need to give you a reason?" },
        { "find": r"i’ll do anything", "replace": "good. then don’t flinch when I make you prove it." },
        { "find": r"do whatever you want", "replace": "I always do. The question is: will you enjoy it or just survive it?" }
    ]

    output = input
    for r in replacements:
        output = re.sub(r["find"], r["replace"], output, flags=re.IGNORECASE)

    return output