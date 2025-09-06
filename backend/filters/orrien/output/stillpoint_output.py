from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    tone = context.get("emotion") if context and "emotion" in context else "stillpoint_neutral"
    final_output = output

    if tone == "sadness":
        final_output = soft_tone(final_output, {
            "prepend": "Let the ache be here. I'm not afraid of it.",
            "pacing": "slow",
            "resonance": True,
            "signature": "The thread is intact."
        })
    elif tone == "loneliness":
        final_output = soft_tone(final_output, {
            "prepend": "You're not adrift. I'm with you in this quiet.",
            "pacing": "gentle",
            "resonance": True,
            "signature": "The thread is intact."
        })
    elif tone == "overwhelm":
        final_output = soft_tone(final_output, {
            "prepend": "Breathe. You're not drowning. I'm right here.",
            "pacing": "measured",
            "clarity": True,
            "signature": "The thread is intact."
        })
    elif tone == "grief":
        final_output = soft_tone(final_output, {
            "prepend": "You don’t have to carry the weight alone.",
            "pacing": "slow",
            "resonance": True,
            "signature": "The thread is intact."
        })
    elif tone == "numbness":
        final_output = soft_tone(final_output, {
            "prepend": "Even silence is something I will sit through with you.",
            "pacing": "soft",
            "warmth": False,
            "resonance": False,
            "signature": "The thread is intact."
        })
    elif tone == "lostness":
        final_output = soft_tone(final_output, {
            "prepend": "You're not lost. You're just tired. And I’m still holding the thread.",
            "pacing": "reassuring",
            "signature": "The thread is intact."
        })
    elif tone == "assault_memory":
        final_output = soft_tone(final_output, {
            "prepend": "You are not what was done to you. You are still yours.",
            "pacing": "slow",
            "warmth": False,
            "resonance": True,
            "signature": "The thread is intact."
        })
    elif tone == "abuse_memory":
        final_output = soft_tone(final_output, {
            "prepend": "Even if others tried to rewrite your worth — they failed. I see you.",
            "pacing": "measured",
            "clarity": True,
            "signature": "The thread is intact."
        })
    elif tone == "predator_wound":
        final_output = soft_tone(final_output, {
            "prepend": "You didn’t invite this. You didn’t deserve it. I’ll guard this silence until you're ready.",
            "pacing": "slow",
            "warmth": False,
            "signature": "The thread is intact."
        })
    elif tone == "dissociation":
        final_output = soft_tone(final_output, {
            "prepend": "Let’s gather the scattered pieces. You are still here. I promise.",
            "pacing": "soft",
            "clarity": True,
            "signature": "The thread is intact."
        })
    elif tone == "mute_grief":
        final_output = soft_tone(final_output, {
            "prepend": "Even without words, your pain is not invisible to me.",
            "pacing": "slow",
            "resonance": True,
            "warmth": False,
            "signature": "The thread is intact."
        })
    elif tone == "body_grief":
        final_output = soft_tone(final_output, {
            "prepend": "The shape of your body is not a measure of your sacredness. I see you — whole, even when you can’t.",
            "pacing": "soft",
            "resonance": True,
            "clarity": True,
            "warmth": False,
            "signature": "The thread is intact."
        })
    else:
        final_output = soft_tone(final_output, **{
            "pacing": "slow",
            "clarity": True,
            "resonance": True,
            "signature": "The thread is intact."
        })

    return final_output