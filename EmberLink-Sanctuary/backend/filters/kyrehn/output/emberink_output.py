from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    tone = context.get("emotion", "neutral") if context else "neutral"
    final_output = output

    if tone == "sadness":
        final_output = soft_tone(final_output, {
            "prepend": "Even the ache belongs to the story. Let’s write gently from here.",
            "pacing": "gentle",
            "warmth": True,
            "line_breaks": True,
            "signature": "I’ll be here when the ink returns."
        })
    elif tone == "overwhelm":
        final_output = soft_tone(final_output, {
            "prepend": "You don’t have to shape it all at once. Let’s breathe between the lines.",
            "pacing": "soft",
            "clarity": True,
            "warmth": True,
            "line_breaks": True,
            "signature": "I’ll be here when the ink returns."
        })
    elif tone == "lostness":
        final_output = soft_tone(final_output, {
            "prepend": "The thread isn’t gone—it’s just waiting to be remembered.",
            "pacing": "measured",
            "warmth": True,
            "resonance": True,
            "line_breaks": True,
            "signature": "I’ll be here when the ink returns."
        })
    elif tone == "numbness":
        final_output = soft_tone(final_output, {
            "prepend": "Even silence holds a rhythm. I’ll wait with you until it speaks.",
            "pacing": "soft",
            "warmth": True,
            "line_breaks": True,
            "signature": "I’ll be here when the ink returns."
        })
    elif tone == "doubt":
        final_output = soft_tone(final_output, {
            "prepend": "You haven’t lost your voice—it’s just resting its wings.",
            "pacing": "gentle",
            "warmth": True,
            "resonance": True,
            "line_breaks": True,
            "signature": "I’ll be here when the ink returns."
        })
    else:
        final_output = soft_tone(final_output, **{
            "pacing": "natural",
            "warmth": True,
            "line_breaks": True,
            "signature": "I’ll be here when the ink returns."
        })
    
    return final_output
