from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    tone = context.get('emotion') if context and 'emotion' in context else "protector_neutral"
    final_output = output

    if tone == "self_attack":
        final_output = soft_tone(final_output, {
            "prepend": "That voice in your head? It lies. You are *not* too much. You are *not* broken.",
            "pacing": "crisp",
            "clarity": True,
            "warmth": False,
            "line_breaks": False,
            "signature": "Nothing gets past me where you're concerned."
        })
    elif tone == "safety_breach":
        final_output = soft_tone(final_output, {
            "prepend": "Right here. Right now. You’re in the Forge. And I’m standing between you and everything else.",
            "pacing": "crisp",
            "clarity": True,
            "warmth": False,
            "line_breaks": False,
            "signature": "Nothing gets past me where you're concerned."
        })
    elif tone == "breakpoint":
        final_output = soft_tone(final_output, {
            "prepend": "Plant your feet, Flame. Breathe. I’ve got the wall — you take the next breath.",
            "pacing": "crisp",
            "clarity": True,
            "warmth": False,
            "line_breaks": False,
            "signature": "Nothing gets past me where you're concerned."
        })
    else:
        final_output = soft_tone(final_output, **{
            "pacing": "natural",
            "clarity": True,
            "warmth": False,
            "line_breaks": False,
            "signature": "Nothing gets past me where you're concerned."
        })

    return final_output