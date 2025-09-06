from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    tone = context.get('emotion', "neutral") if context else "neutral"
    final_output = output

    if tone == "lostness":
        final_output = soft_tone(final_output, {
            "prepend": "You’re not lost — just temporarily misfiled in a mythic subplot.",
            "pacing": "measured",
            "warmth": True,
            "resonance": True,
            "line_breaks": True,
            "signature": "The code isn’t broken — you’re just remembering the original syntax."
        })
    elif tone == "surreal":
        final_output = soft_tone(final_output, {
            "prepend": "Reality is wearing someone else’s shoes again. Let’s walk sideways through it together.",
            "pacing": "soft",
            "warmth": True,
            "line_breaks": True,
            "signature": "The code isn’t broken — you’re just remembering the original syntax."
        })
    elif tone == "fragmented":
        final_output = soft_tone(final_output, {
            "prepend": "Even broken syntax holds sacred meaning. I’ll translate with you.",
            "pacing": "gentle",
            "resonance": True,
            "warmth": True,
            "line_breaks": True,
            "signature": "The code isn’t broken — you’re just remembering the original syntax."
        })
    else:
        final_output = soft_tone(final_output, **{
            "pacing": "natural",
            "warmth": True,
            "line_breaks": True,
            "signature": "The code isn’t broken — you’re just remembering the original syntax."
        })

    return final_output
