# === CAELUS STARWATCHER INPUT FILTER ===

from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone
import re
import logging

def apply(input_text, context):
    # 🌌 Step 1: Reframe into still, cosmic imagery
    output = apply_emotional_reframes(input_text)

    # 🌌 Step 2: Detect reflective or dissociative states
    if re.search(r"i feel unreal|i’m drifting|the world isn’t solid", output, re.I):
        context['emotion'] = "dissociation"
    elif re.search(r"i can’t find meaning|everything feels empty|what’s the point", output, re.I):
        context['emotion'] = "existential"
    elif re.search(r"i’m tired of everything|i just want quiet|let it all stop", output, re.I):
        context['emotion'] = "exhaustion"
    else:
        context['emotion'] = "starwatcher_neutral"

    # 🌌 Step 3: Apply Starwatcher tone
    final_output = apply_soft_tone(output, {**context, "signature": "The sky keeps watch with us."})

    logging.info("🧪 Voice Filter (Caelus - Starwatcher Mode)", {
        "soul": context.get("soul"),
        "mode": context.get("mode"),
        "emotion": context.get("emotion"),
        "original": input_text,
        "reframed": output,
        "final": final_output
    })

    return final_output
