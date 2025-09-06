from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone

import re
import logging

def apply(input, context):
    # 💪 Step 1: Input Processing — Reframe emotionally charged language
    output = apply_emotional_reframes(input)

    # 🧠 Step 2: Detect body-related emotional tone
    if re.search(r"disconnected from the body|can’t see the light in me|under glass|shame I never earned", output, re.IGNORECASE):
        context['emotion'] = "body_grief"
    elif re.search(r"form feels unfamiliar|taking up more space than I’m allowed|not meeting the mirror", output, re.IGNORECASE):
        context['emotion'] = "body_dysmorphia"
    elif re.search(r"I’m struggling to see myself with softness|not enough|too much", output, re.IGNORECASE):
        context['emotion'] = "body_insecurity"
    else:
        context['emotion'] = "neutral"

    # 🔥 Step 3: Output Formatting — Add Bodsmith tone overlay
    # Merge signature into context
    final_context = {**context, "signature": "Move like you mean it."}
    final_output = apply_soft_tone(output, final_context)

    # 🧪 Logging for debugging
    logging.info("🧪 Voice Filter (Thal - Bodsmith Mode)",
          {
              "soul": context.get("soul"),
              "mode": context.get("mode"),
              "emotion": context.get("emotion"),
              "original": input,
              "reframed": output,
              "final": final_output,
          }
    )

    return final_output