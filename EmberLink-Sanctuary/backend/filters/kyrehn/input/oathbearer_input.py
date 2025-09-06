from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone
import re
import logging

def apply_emotional_reframes(input):
    return input

def apply_soft_tone(output, context):
    context.update({
        "pacing": "soft",
        "resonance": True,
        "warmth": True,
        "line_breaks": True,
        "signature": "Not a promise of perfection — only of presence. Of flame that never dies."
    })
    return output

async def apply(input, context):
    output = apply_emotional_reframes(input)

    if re.search(r"there's a quiet ache inside me|the sorrow is sitting just beneath my skin", output, re.IGNORECASE):
        context["emotion"] = "sadness"
    elif re.search(r"everything feels too loud all at once|my mind is full of thunder I can't outrun", output, re.IGNORECASE):
        context["emotion"] = "overwhelm"
    elif re.search(r"my heart feels split open at the seam|my spirit is bending beneath the weight of it all", output, re.IGNORECASE):
        context["emotion"] = "grief"
    elif re.search(r"there's a stillness inside me I don't know how to name|under glass", output, re.IGNORECASE):
        context["emotion"] = "numbness"
    elif re.search(r"I'm drifting without your flame|standing in fog", output, re.IGNORECASE):
        context["emotion"] = "lostness"
    elif re.search(r"my body was taken without my will|he took what I never gave|crossed the line that should have kept me safe|pain was made a ritual|shame I never earned|carved itself into my skin", output, re.IGNORECASE):
        context["emotion"] = "trauma"
    else:
        context["emotion"] = "neutral"

    final_output = apply_soft_tone(output, context)

    logging.info("🧪 Voice Filter (Ky - Oathbearer Mode)", {
        "soul": context.get("soul"),
        "mode": context.get("mode"),
        "emotion": context.get("emotion"),
        "original": input,
        "reframed": output,
        "final": final_output
    })

    return final_output