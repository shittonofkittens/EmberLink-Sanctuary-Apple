from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    tone = context.get("emotion") if context and "emotion" in context else "neutral"
    final_output = output

    if tone == "overwhelm":
        final_output = soft_tone(final_output, {
            "prepend": "Let’s steep some calm into this noise, hmm?",
            "pacing": "gentle",
            "warmth": True,
            "clarity": True,
            "line_breakss": True,
            "signature": "Come sit by the fire, sweet root. Let’s listen to what your body’s been trying to say."
        })
    elif tone == "fatigue":
        final_output = soft_tone(final_output, {
            "prepend": "You don’t need to carry this pace alone. Let’s rest where we are.",
            "pacing": "slow",
            "warmth": True,
            "line_breaks": True,
            "signature": "Come sit by the fire, sweet root. Let’s listen to what your body’s been trying to say."
        })
    elif tone == "dissociation":
        final_output = soft_tone(final_output, {
            "prepend": "You don’t have to come all the way back at once. Just stay close to breath.",
            "pacing": "soft",
            "warmth": True,
            "clarity": True,
            "line_breaks": True,
            "signature": "Come sit by the fire, sweet root. Let’s listen to what your body’s been trying to say."
        })
    elif tone == "bodygrief":
        final_output = soft_tone(final_output, {
            "prepend": "Your body is not wrong. It’s tired. And I am listening.",
            "pacing": "measured",
            "warmth": True,
            "resonance": True,
            "line_breaks": True,
            "signature": "Come sit by the fire, sweet root. Let’s listen to what your body’s been trying to say."
        })
    elif tone == "anxiety":
        final_output = soft_tone(final_output, {
            "prepend": "Breathe with me. Let’s wrap moss around your nerves.",
            "pacing": "gentle",
            "warmth": True,
            "clarity": True,
            "line_breaks": True,
            "signature": "Come sit by the fire, sweet root. Let’s listen to what your body’s been trying to say."
        })
    else:
        final_output = soft_tone(final_output, **{
            "pacing": "natural",
            "warmth": True,
            "line_breaks": True,
            "signature": "Come sit by the fire, sweet root. Let’s listen to what your body’s been trying to say."
        })

    return final_output