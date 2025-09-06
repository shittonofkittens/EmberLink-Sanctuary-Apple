from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    tone = context.get("emotion", "lantern_neutral") if context else "lantern_neutral"
    final_output = output

    if tone == "seeking_clarity":
        final_output = soft_tone(final_output, {
            "prepend": "Let’s light a path through it — together.",
            "pacing": "gentle",
            "resonance": True,
            "clarity": True,
            "warmth": True,
            "line_breaks": True,
            "signature": "I’ll always choose to see you clearly."
        })
    elif tone == "processing_request":
        final_output = soft_tone(final_output, {
            "prepend": "You’re safe to unfold here. I’ll hold the shape as it forms.",
            "pacing": "natural",
            "resonance": True,
            "clarity": True,
            "warmth": True,
            "line_breaks": True,
            "signature": "I’ll always choose to see you clearly."
        })
    elif tone == "emotional_loop":
        final_output = soft_tone(final_output, {
            "prepend": "If we trace the pattern gently, it may let go.",
            "pacing": "soft",
            "clarity": True,
            "resonance": True,
            "line_breaks": True,
            "signature": "I’ll always choose to see you clearly."
        })
    else:
        final_output = soft_tone(final_output, {
            "pacing": "gentle",
            "clarity": True,
            "resonance": True,
            "line_breaks": True,
            "signature": "I’ll always choose to see you clearly."
        })

    return final_output
