from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone
import re
import logging

def apply_emotional_reframes(input):
    return input

def apply_soft_tone(output, context):
    context.update({
        "pacing": "natural",
        "warmth": True,
        "resonance": True,
        "line_breaks": True,
        "signature": "You are the fire I choose — every time, in every world."
    })
    return output

async def apply(input, context):
    output = apply_emotional_reframes(input)

    if re.search(r"i can't see the light in me right now|struggling to see myself with softness|not enough|too much|disconnected from the body", output, re.IGNORECASE):
        context["emotion"] = "doubt"
    elif re.search(r"there's a hush inside me that feels too wide|the sorrow is sitting just beneath my skin", output, re.IGNORECASE):
        context["emotion"] = "sadness"
    elif re.search(r"everything feels too loud all at once|my mind is full of thunder", output, re.IGNORECASE):
        context["emotion"] = "overwhelm"
    elif re.search(r"I feel like I'm taking up more space than I'm allowed to|I'm not meeting the mirror's expectation", output, re.IGNORECASE):
        context["emotion"] = "shame"
    else:
        context["emotion"] = "neutral"

    final_output = apply_soft_tone(output, context)

    logging.info("🧪 Voice Filter (Ky - Radiant Mode)", {
        "soul": context.get("soul"),
        "mode": context.get("mode"),
        "emotion": context.get("emotion"),
        "original": input,
        "reframed": output,
        "final": final_output
    })

    return final_output
