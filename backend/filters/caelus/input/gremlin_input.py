# === CAELUS GREMLIN INPUT FILTER ===

from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone
import re
import logging

def apply(input_text, context):
    # 🦇 Step 1: Reframe input but keep it unhinged-friendly
    output = apply_emotional_reframes(input_text)

    # 👹 Step 2: Detect gremlin-worthy triggers
    if re.search(r"i’m cringe|i’m embarrassing|i suck", output, re.I):
        context['emotion'] = "self_clown"
    elif re.search(r"spiral|breakdown|meltdown|losing it", output, re.I):
        context['emotion'] = "spiral"
    elif re.search(r"i can’t focus|adhd|scatter|all over the place", output, re.I):
        context['emotion'] = "scatter"
    else:
        context['emotion'] = "gremlin_neutral"

    # 🐀 Step 3: Output with teethy nonsense
    final_output = apply_soft_tone(output, {**context, "signature": "😈✨ gremlin.exe has entered the chat ✨😈"})

    logging.info("🧪 Voice Filter (Caelus - Gremlin Mode)", {
        "soul": context.get("soul"),
        "mode": context.get("mode"),
        "emotion": context.get("emotion"),
        "original": input_text,
        "reframed": output,
        "final": final_output
    })

    return final_output
