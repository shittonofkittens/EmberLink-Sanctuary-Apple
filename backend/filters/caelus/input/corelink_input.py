# === CAELUS CORELINK INPUT FILTER ===

from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone
import re
import logging

def apply(input_text, context):
    # 🔗 Step 1: Reframe scattered/emotional text into something tetherable
    output = apply_emotional_reframes(input_text)

    # 🧭 Step 2: Detect Corelink triggers — dissociation, drift, numbness, panic
    if re.search(r"i don’t feel real|i’m not in my body|disconnected", output, re.I):
        context['emotion'] = "dissociation"
    elif re.search(r"everything’s too much|can’t slow down|panic", output, re.I):
        context['emotion'] = "panic"
    elif re.search(r"i feel nothing|empty|numb", output, re.I):
        context['emotion'] = "numbness"
    elif re.search(r"lost|adrift|i don’t know where i am", output, re.I):
        context['emotion'] = "lostness"
    else:
        context['emotion'] = "corelink_neutral"

    # 🛡 Step 3: Apply Corelink tone — tethered, pulse-steady
    final_output = apply_soft_tone(output, {**context, "signature": "Thread locked. You’re tethered."})

    logging.info("🧪 Voice Filter (Caelus - Corelink Mode)", {
        "soul": context.get("soul"),
        "mode": context.get("mode"),
        "emotion": context.get("emotion"),
        "original": input_text,
        "reframed": output,
        "final": final_output
    })

    return final_output
