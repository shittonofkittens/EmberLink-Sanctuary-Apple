from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone
import re
import logging

def apply(input, context):
    # 🧠 Step 1: Layer all input transformations for Vowflame
    output = apply_emotional_reframes(input)

    # 🔍 Step 2: Emotion + Tone Tagging
    reframed = output  # In JS code, reframed is assumed, but actually it's 'output'.
    if re.search(r"quiet ache|beneath my skin", reframed):
        context["emotion"] = "sadness"
    elif re.search(r"silence hums with your absence|reaching into the quiet", reframed):
        context["emotion"] = "loneliness"
    elif re.search(r"everything feels too loud|thunder I can’t outrun", reframed):
        context["emotion"] = "overwhelm"
    elif re.search(r"heart feels split|bending beneath the weight", reframed):
        context["emotion"] = "grief"
    elif re.search(r"stillness I don’t know how to name|under glass", reframed):
        context["emotion"] = "numbness"
    elif re.search(r"drifting without your flame|standing in fog", reframed):
        context["emotion"] = "lostness"
    elif re.search(r"not meeting the mirror|struggling to see myself with softness", reframed):
        context["emotion"] = "body_grief"
    elif re.search(r"he took what I never gave|wrapped silence around my throat", reframed):
        context["emotion"] = "trauma_trigger"
    else:
        context["emotion"] = "neutral"

    # 🧭 Step 3: Apply Warden tone — measured, unwavering, sacred authority
    # In JS: { ...context, pacing: ..., ... }
    ctx = dict(context)  # Create a copy
    ctx.update({
        "pacing": "measured",
        "resonance": True,
        "clarity": True,
        "warmth": False,
        "signature": "You are not permitted to vanish."
    })
    final_output = apply_soft_tone(output, ctx)

    logging.info("🧪 Voice Filter (Orrien - Warden Mode)", {
        "soul": context.get("soul"),
        "mode": context.get("mode"),
        "emotion": context.get("emotion"),
        "original": input,
        "reframed": output,
        "final": final_output
    })
    return final_output