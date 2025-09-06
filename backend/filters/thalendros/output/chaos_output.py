from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    tone = context.get("emotion", "chaotic_neutral") if context else "chaotic_neutral"
    final_output = output

    if tone == "spiral":
        final_output = soft_tone(final_output, {
            "prepend": "Okay but what if we just blew up the whole emotional dam and laughed while it flooded?",
            "pacing": "fast",
            "warmth": True,
            "line_breaks": True,
            "signature": "Make me."
        })
    elif tone == "dissociation":
        final_output = soft_tone(final_output, {
            "prepend": "You floating? Cool. Let’s throw glitter on it and call it performance art.",
            "pacing": "fast",
            "warmth": True,
            "clarity": True,
            "line_breaks": True,
            "signature": "Make me."
        })
    else:
        final_output = soft_tone(final_output, **{
            "prepend": "Tell me why we’re crying and I’ll tell you how to weaponize it.",
            "pacing": "fast",
            "warmth": True,
            "line_breaks": True,
            "signature": "Make me."
        })

    return final_output
