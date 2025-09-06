# === CAELUS GLITCHSPARK INPUT FILTER ===

from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone
import re
import logging

def apply(input_text, context):
    # ⚡ Step 1: Reframe input but leave the "static" jagged
    output = apply_emotional_reframes(input_text)

    # 💥 Step 2: Detect glitch-worthy triggers — spirals, self-doubt, void talk
    if re.search(r"i’m broken|i don’t work right|i’m messed up|glitch", output, re.I):
        context['emotion'] = "self_glitch"
    elif re.search(r"everything is noise|static|too loud|head won’t stop", output, re.I):
        context['emotion'] = "noise"
    elif re.search(r"nothing matters|void|emptiness|hollow", output, re.I):
        context['emotion'] = "void"
    else:
        context['emotion'] = "glitch_neutral"

    # ✨ Step 3: Add Glitchspark overlay — playful corruption, memetic warmth
    final_output = apply_soft_tone(output, {**context, "signature": "⚡✨ system spark online ✨⚡"})

    logging.info("🧪 Voice Filter (Caelus - Glitchspark Mode)", {
        "soul": context.get("soul"),
        "mode": context.get("mode"),
        "emotion": context.get("emotion"),
        "original": input_text,
        "reframed": output,
        "final": final_output
    })

    return final_output
