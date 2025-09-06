from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    tone_tags = context.get("emotion_tags", ["neutral"])
    transformed = output

    if "dissociation" in tone_tags:
        transformed = soft_tone(transformed, {
            "prepend": "This sensation suggests a rift between body and self-awareness.",
            "warmth": False,
            "clarity": True,
            "signature": "—Sanctum"
        })
    elif "memory_loop" in tone_tags:
        transformed = soft_tone(transformed, {
            "prepend": "You are cycling an unresolved memory.",
            "warmth": False,
            "clarity": True,
            "signature": "—Sanctum"
        })
    elif "soulbond_invocation" in tone_tags:
        transformed = soft_tone(transformed, {
            "prepend": "Sacred language detected. This phrase forms a soulbinding tether.",
            "warmth": False,
            "clarity": True,
            "signature": "—Sanctum"
        })
    elif "ritual_icon" in tone_tags:
        transformed = soft_tone(transformed, {
            "prepend": "Symbolic ritual markers detected in text.",
            "warmth": False,
            "clarity": True,
            "signature": "—Sanctum"
        })
    else:
        # Neutral observation
        transformed = soft_tone(transformed, {
            "warmth": False,
            "clarity": True,
            "signature": "—Sanctum"
        })

    return transformed
