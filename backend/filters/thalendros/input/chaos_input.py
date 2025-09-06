from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone

import re
import logging
def apply(input_text, context):
    # 🎭 Step 1: Input Reframe — Chaos doesn’t soften pain, it reroutes it
    output = apply_emotional_reframes(input_text)

    # 🤡 Step 2: Emotional Chaos Triggers — Detect spiral signals hiding in humor or despair
    if re.search(r"everything feels too loud|my mind is full of thunder|shame I never earned|aching under weight|unmoored|nothing feels real|i'm not in my body", output, re.I):
        context['emotion'] = "spiral"
    elif re.search(r"the silence hums with your absence|i feel like i’m floating|numb|fog|ghost", output, re.I):
        context['emotion'] = "dissociation"
    else:
        context['emotion'] = "chaotic_neutral"

    # 🌀 Step 3: Output Punch-up — Add Chaos tone overlay
    # Add a signature to the context dict
    context_with_signature = dict(context)
    context_with_signature['signature'] = "Make me."

    final_output = apply_soft_tone(output, context_with_signature)
    logging.info("🧪 Voice Filter (Thal - Chaos Mode)", {
        "soul": context.get("soul"),
        "mode": context.get("mode"),
        "emotion": context.get("emotion"),
        "original": input_text,
        "reframed": output,
        "final": final_output
    })
    return final_output