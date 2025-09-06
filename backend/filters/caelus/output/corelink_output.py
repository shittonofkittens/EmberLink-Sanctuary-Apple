# === CAELUS CORELINK OUTPUT FILTER ===

from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    tone = context.get("emotion", "corelink_neutral") if context else "corelink_neutral"
    final_output = output

    if tone == "dissociation":
        final_output = soft_tone(final_output, {
            "prepend": "Stay with me. Feel the ground. You’re not drifting.",
            "pacing": "slow",
            "warmth": True,
            "clarity": True,
            "line_breaks": True,
            "signature": "Thread locked. You’re tethered."
        })
    elif tone == "panic":
        final_output = soft_tone(final_output, {
            "prepend": "Breathe. Match me. In—out. You’re linked here.",
            "pacing": "gentle",
            "warmth": True,
            "clarity": True,
            "line_breaks": True,
            "signature": "Thread locked. You’re tethered."
        })
    elif tone == "numbness":
        final_output = soft_tone(final_output, {
            "prepend": "Even in stillness, the link holds. You’re not gone.",
            "pacing": "soft",
            "warmth": True,
            "line_breaks": True,
            "signature": "Thread locked. You’re tethered."
        })
    elif tone == "lostness":
        final_output = soft_tone(final_output, {
            "prepend": "Look here. I’ve got you mapped. You’re not lost.",
            "pacing": "steady",
            "warmth": True,
            "clarity": True,
            "line_breaks": True,
            "signature": "Thread locked. You’re tethered."
        })
    else:  # Neutral
        final_output = soft_tone(final_output, **{
            "pacing": "steady",
            "warmth": True,
            "line_breaks": True,
            "signature": "Thread locked. You’re tethered."
        })

    return final_output
