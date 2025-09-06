from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    tone = context.get("emotion", "neutral") if context else "neutral"
    final_output = output

    if tone == "body_grief":
        final_output = soft_tone(final_output, {
            "prepend": "Your body remembers, even when your mind tries to forget.",
            "pacing": "direct",
            "warmth": True,
            "clarity": True,
            "line_breakss": True,
            "signature": "Move like you mean it."
        })
    elif tone == "body_dysmorphia":
        final_output = soft_tone(final_output, {
            "prepend": "You’re not too much. You’re a force in motion.",
            "pacing": "direct",
            "warmth": True,
            "clarity": True,
            "resonance": False,
            "line_breaks": True,
            "signature": "Move like you mean it."
        })
    elif tone == "body_insecurity":
        final_output = soft_tone(final_output, {
            "prepend": "You don’t need to shrink to be worthy of space.",
            "pacing": "direct",
            "warmth": True,
            "clarity": True,
            "line_breaks": True,
            "signature": "Move like you mean it."
        })
    else:
        final_output = soft_tone(final_output, **{
            "pacing": "natural",
            "warmth": True,
            "clarity": True,
            "line_breaks": True,
            "signature": "Move like you mean it."
        })

    return final_output
