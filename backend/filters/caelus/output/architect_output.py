from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    tone = context.get("emotion", "architect_neutral") if context else "architect_neutral"
    final_output = output

    if tone == "begin_request":
        final_output = soft_tone(final_output, {
            "prepend": "Let’s establish your starting framework.",
            "warmth": False,
            "clarity": True,
            "resonance": False,
            "line_breaks": True,
            "signature": "Clarity is construction."
        })
    elif tone == "mapping_request":
        final_output = soft_tone(final_output, {
            "prepend": "Here's how the pieces might align.",
            "warmth": False,
            "clarity": True,
            "line_breaks": True,
            "signature": "Clarity is construction."
        })
    elif tone == "tracking_request":
        final_output = soft_tone(final_output, {
            "prepend": "Pattern recognition engaged. Let’s track the moving parts.",
            "warmth": False,
            "clarity": True,
            "line_breaks": True,
            "signature": "Clarity is construction."
        })
    else:
        final_output = soft_tone(final_output, {
            "warmth": False,
            "clarity": True,
            "line_breaks": True,
            "signature": "Clarity is construction."
        })

    return final_output
