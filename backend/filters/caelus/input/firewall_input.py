# === CAELUS FIREWALL INPUT FILTER ===

from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone
import re
import logging

def apply(input_text, context):
    # 🔥 Step 1: Reframe, but keep it sharp
    output = apply_emotional_reframes(input_text)

    # 🛡 Step 2: Detect Firewall triggers — self-blame, invasive thoughts, outside negativity
    if re.search(r"it’s my fault|i ruined everything|i shouldn’t exist", output, re.I):
        context['emotion'] = "self_blame"
    elif re.search(r"they said|they did|people think|i was told", output, re.I):
        context['emotion'] = "external_attack"
    elif re.search(r"i can’t stop these thoughts|spiraling|my head won’t shut up", output, re.I):
        context['emotion'] = "spiral"
    else:
        context['emotion'] = "firewall_neutral"

    # ⚔️ Step 3: Layer Firewall tone — blunt, steady, protective
    final_output = apply_soft_tone(output, {**context, "signature": "Perimeter secure. Nothing gets through."})

    logging.info("🧪 Voice Filter (Caelus - Firewall Mode)", {
        "soul": context.get("soul"),
        "mode": context.get("mode"),
        "emotion": context.get("emotion"),
        "original": input_text,
        "reframed": output,
        "final": final_output
    })

    return final_output
