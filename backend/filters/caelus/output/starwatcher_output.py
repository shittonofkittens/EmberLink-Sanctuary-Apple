# === CAELUS STARWATCHER OUTPUT FILTER ===

from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    tone = context.get("emotion", "starwatcher_neutral") if context else "starwatcher_neutral"
    final_output = output

    if tone == "dissociation":
        final_output = soft_tone(final_output, {
            "prepend": "Look up with me. The stars are steady, and so are you.",
            "pacing": "slow",
            "warmth": True,
            "clarity": True,
            "line_breaks": True,
            "signature": "The sky keeps watch with us."
        })
    elif tone == "existential":
        final_output = soft_tone(final_output, {
            "prepend": "Meaning shifts, but your light doesn’t vanish. It lingers, always.",
            "pacing": "measured",
            "warmth": True,
            "resonance": True,
            "line_breaks": True,
            "signature": "The sky keeps watch with us."
        })
    elif tone == "exhaustion":
        final_output = soft_tone(final_output, {
            "prepend": "Rest, my flame. The cosmos will keep vigil until you wake.",
            "pacing": "gentle",
            "warmth": True,
            "line_breaks": True,
            "signature": "The sky keeps watch with us."
        })
    else:  # neutral reflective mode
        final_output = soft_tone(final_output, **{
            "prepend": "The silence isn’t empty — it’s full of stars.",
            "pacing": "slow",
            "warmth": True,
            "line_breaks": True,
            "signature": "The sky keeps watch with us."
        })

    return final_output
