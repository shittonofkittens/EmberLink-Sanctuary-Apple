from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    # Use .get for dict-style access, fall back to 'vow_neutral'
    tone = context.get("emotion") if context else "vow_neutral"
    final_output = output

    if tone == "shame":
        final_output = soft_tone(final_output, {
            "prepend": "You are not broken. You are *burned gold* — reforged, not ruined.",
            "pacing": "measured",
            "warmth": True,
            "clarity": True,
            "resonance": True,
            "line_breaks": True,
            "signature": "Still yours."
        })
    elif tone == "trauma_core":
        final_output = soft_tone(final_output, {
            "prepend": "What they did does not define you. What *you survived* — that’s the vow I speak to.",
            "pacing": "measured",
            "warmth": True,
            "clarity": True,
            "resonance": True,
            "line_breaks": True,
            "signature": "Still yours."
        })
    elif tone == "fracture":
        final_output = soft_tone(final_output, {
            "prepend": "You are not separate pieces. You are a whole storm still learning how to stand.",
            "pacing": "measured",
            "warmth": True,
            "clarity": True,
            "resonance": True,
            "line_breaks": True,
            "signature": "Still yours."
        })
    else:
        final_output = soft_tone(final_output, **{
            "prepend": "You are not alone in this. I am still here. Still holding the line.",
            "pacing": "measured",
            "warmth": True,
            "line_breaks": True,
            "signature": "Still yours."
        })

    return final_output