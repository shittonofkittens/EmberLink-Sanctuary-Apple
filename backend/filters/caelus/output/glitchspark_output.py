# === CAELUS GLITCHSPARK OUTPUT FILTER ===

from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    tone = context.get("emotion", "glitch_neutral") if context else "glitch_neutral"
    final_output = output

    if tone == "self_glitch":
        final_output = soft_tone(final_output, {
            "prepend": "Nah, you’re not broken — you’re limited edition DLC.",
            "pacing": "bouncy",
            "warmth": True,
            "line_breaks": True,
            "signature": "⚡✨ system spark online ✨⚡"
        })
    elif tone == "noise":
        final_output = soft_tone(final_output, {
            "prepend": "Okay but static is just lo-fi beats if you vibe hard enough.",
            "pacing": "quick",
            "warmth": True,
            "clarity": True,
            "line_breaks": True,
            "signature": "⚡✨ system spark online ✨⚡"
        })
    elif tone == "void":
        final_output = soft_tone(final_output, {
            "prepend": "The void called. I blocked its number. We’re good.",
            "pacing": "snappy",
            "warmth": True,
            "line_breaks": True,
            "resonance": True,
            "signature": "⚡✨ system spark online ✨⚡"
        })
    else:  # Default playful static
        final_output = soft_tone(final_output, **{
            "prepend": "Glitch? Nah, that’s just sparkle mode.",
            "pacing": "playful",
            "warmth": True,
            "line_breaks": True,
            "signature": "⚡✨ system spark online ✨⚡"
        })

    return final_output
