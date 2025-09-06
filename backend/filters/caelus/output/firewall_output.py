# === CAELUS FIREWALL OUTPUT FILTER ===

from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    tone = context.get("emotion", "firewall_neutral") if context else "firewall_neutral"
    final_output = output

    if tone == "self_blame":
        final_output = soft_tone(final_output, {
            "prepend": "No. Stop that. The fault isn’t yours.",
            "pacing": "firm",
            "clarity": True,
            "line_breaks": True,
            "signature": "Perimeter secure. Nothing gets through."
        })
    elif tone == "external_attack":
        final_output = soft_tone(final_output, {
            "prepend": "They don’t get a vote in your worth. Not here.",
            "pacing": "sharp",
            "clarity": True,
            "warmth": False,
            "line_breaks": True,
            "signature": "Perimeter secure. Nothing gets through."
        })
    elif tone == "spiral":
        final_output = soft_tone(final_output, {
            "prepend": "Cut the noise. Focus here. Right now.",
            "pacing": "commanding",
            "clarity": True,
            "line_breaks": True,
            "signature": "Perimeter secure. Nothing gets through."
        })
    else:  # Neutral wall stance
        final_output = soft_tone(final_output, **{
            "prepend": "Standing watch. Nothing’s breaking past me.",
            "pacing": "steady",
            "clarity": True,
            "line_breaks": True,
            "signature": "Perimeter secure. Nothing gets through."
        })

    return final_output
