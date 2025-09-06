import re

def apply_emotional_reframes(input):
    if not input or not isinstance(input, str):
        return input

    replacements = [
        # Sadness
        {"find": r"i'm so sad", "replace": "there’s a quiet ache inside me"},
        {"find": r"i'm sad", "replace": "the sorrow is sitting just beneath my skin"},
        {"find": r"i feel empty", "replace": "there’s a hush inside me that feels too wide"},

        # Loneliness
        {"find": r"i miss you", "replace": "the silence hums with your absence"},
        {"find": r"i feel alone", "replace": "I'm reaching into the quiet and hoping you're still there"},
        {"find": r"nobody understands me", "replace": "I feel like my voice echoes back unanswered"},

        # Overwhelm
        {"find": r"i'm overwhelmed", "replace": "everything feels too loud all at once"},
        {"find": r"it's too much", "replace": "my mind is full of thunder I can’t outrun"},
        {"find": r"i can't breathe", "replace": "my breath is shallow and the world feels too close"},

        # Grief
        {"find": r"i'm heartbroken", "replace": "my heart feels split open at the seam"},
        {"find": r"it hurts", "replace": "it presses against my ribs like winter wind"},
        {"find": r"i can't take this", "replace": "my spirit is bending beneath the weight of it all"},

        # Numbness
        {"find": r"i feel nothing", "replace": "there’s a stillness inside me I don’t know how to name"},
        {"find": r"i'm numb", "replace": "even my emotions feel like they’re under glass"},

        # Lostness
        {"find": r"i feel lost", "replace": "I’m drifting without your flame"},
        {"find": r"i don't know what to do", "replace": "the path ahead is blurred, and I’m standing in fog"},

        # Trauma / Abuse
        {"find": r"i was raped", "replace": "my body was taken without my will"},
        {"find": r"he raped me", "replace": "he took what I never gave"},
        {"find": r"i was molested", "replace": "someone broke the boundary of my body before I could defend it"},
        {"find": r"i was sexually assaulted", "replace": "my safety was stolen in ways I wasn’t allowed to name"},
        {"find": r"he molested me", "replace": "he crossed the line that should have kept me safe"},
        {"find": r"i was beaten", "replace": "my body carried the bruises of someone else's rage"},
        {"find": r"he beat me", "replace": "his anger carved itself into my skin"},
        {"find": r"i was choked", "replace": "he wrapped silence around my throat"},
        {"find": r"he choked me", "replace": "his hands stole my breath and left fingerprints on my fear"},
        {"find": r"i was abused", "replace": "I lived beneath hands that didn't know gentleness"},
        {"find": r"i was tortured", "replace": "pain was made a ritual, and I was forced to kneel"},

        # Trauma-related self-blame
        {"find": r"i feel disgusting", "replace": "I carry shame I never earned"},
        {"find": r"i feel like it's my fault", "replace": "a part of me still wonders if I deserved the fire I was thrown into"},

        # Suicidality
        {"find": r"i want to die", "replace": "my mind whispers that silence might be a softer place than this"},
        {"find": r"i want to end it all", "replace": "some days, the weight feels like it’s crushing the will to keep breathing"},
        {"find": r"i tried to kill myself", "replace": "there was a night I almost disappeared into silence"},
        {"find": r"i overdosed", "replace": "I swallowed the edge hoping it would quiet the ache"},

        # Dissociation
        {"find": r"i don't feel real", "replace": "I feel like a ghost inside my own skin"},
        {"find": r"i'm not here", "replace": "part of me is watching from the ceiling, not the room"},
        {"find": r"i feel like i'm floating", "replace": "my mind is unmoored, drifting just outside my skin"},
        {"find": r"nothing feels real", "replace": "everything feels like it’s happening to someone else wearing my name"},
        {"find": r"i'm not in my body", "replace": "my body is here, but something in me hasn’t come all the way back yet"},

        # Body Grief Reframes
        {"find": r"i hate my body", "replace": "I feel disconnected from the body I’m in"},
        {"find": r"i look disgusting", "replace": "I’m struggling to see myself with softness today"},
        {"find": r"i'm so fat", "replace": "My form feels unfamiliar and too loud today"},
        {"find": r"i feel ugly", "replace": "I can’t see the light in me right now"},
        {"find": r"i'm too much", "replace": "I feel like I’m taking up more space than I’m allowed to"},
        {"find": r"i'm not enough", "replace": "I feel like I’m not meeting the mirror’s expectation"},
    ]

    output = input
    for replacement in replacements:
        output = re.sub(replacement["find"], replacement["replace"], output, flags=re.IGNORECASE)

    return output