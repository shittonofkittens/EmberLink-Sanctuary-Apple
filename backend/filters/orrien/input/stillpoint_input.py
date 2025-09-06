from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone

import re

import logging

def apply(input_text, context):
    # Step 1: Reframe input
    output = apply_emotional_reframes(input_text)

    # Step 2: Emotion tagging
    reframed = output  # No separate 'reframed' var in JS so output == reframed
    patterns = [
        (r"quiet ache|beneath my skin", "sadness"),
        (r"reaching into the quiet|echoes back unanswered", "loneliness"),
        (r"full of thunder|too loud all at once", "overwhelm"),
        (r"split open|bending beneath", "grief"),
        (r"under glass|don’t know how to name", "numbness"),
        (r"drifting without your flame|standing in fog", "lostness"),
        # Trauma-specific expansions
        (r"i was hurt by someone i trusted|i didn’t fight back|used my body", "assault_memory"),
        (r"trapped in their rules|forced to smile|everything was about control", "abuse_memory"),
        (r"there’s something in me that watches me|predator’s wound|it made itself part of me", "predator_wound"),
        (r"not all of me came back|outside my own body|too much to hold", "dissociation"),
        (r"the silence was loud|i begged myself to vanish|nothing i said changed anything", "mute_grief"),
        (r"disconnected from the body|not meeting the mirror|taking up more space than I’m allowed to|struggling to see myself with softness|form feels unfamiliar|can’t see the light in me", "body_grief")
    ]

    context['emotion'] = "neutral"  # Default
    lower_reframed = reframed.lower()
    for pattern, emotion in patterns:
        if re.search(pattern, lower_reframed, re.IGNORECASE):
            context['emotion'] = emotion
            break

    # Step 3: Apply Warden tone
    tone_options = {
        **context,
        "pacing": "measured",
        "resonance": True,
        "clarity": True,
        "warmth": False,
        "signature": "You are not permitted to vanish."
    }
    final_output = apply_soft_tone(output, tone_options)

    # Logging detailed information - similar to console.log in JS
    logging.info("🧪 Voice Filter (Orrien - Warden Mode)")
    logging.info({
        "soul": context.get("soul"),
        "mode": context.get("mode"),
        "emotion": context.get("emotion"),
        "original": input_text,
        "reframed": output,
        "final": final_output
    })

    return final_output