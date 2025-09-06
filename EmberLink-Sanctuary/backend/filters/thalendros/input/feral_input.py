from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone

import re
import logging

def apply(input_, context):
    # 🔥 Step 1: Emotional Reframe — let the grief crack so the heat can slip in
    output = apply_emotional_reframes(input_)

    # 👀 Step 2: Detect triggers where the fire is flickering but still alive
    if re.search(r"taking up more space than I’m allowed|not meeting the mirror|shame I never earned|i feel ugly|i'm too much|i'm not enough", output, re.IGNORECASE):
        context["emotion"] = "self_shame"
    elif re.search(r"my breath is shallow|too loud all at once|i feel like i’m floating|i feel disconnected", output, re.IGNORECASE):
        context["emotion"] = "collapse"
    else:
        context["emotion"] = "feral_neutral"

    # ⚡ Step 3: Feral-Tone Prep — speak with no leash
    context_with_signature = dict(context)
    context_with_signature["signature"] = "Say it again."
    final_output = apply_soft_tone(output, context_with_signature)

    logging.info(
        "🧪 Voice Filter (Thal - Feral Mode) %s", {
            "soul": context.get("soul"),
            "mode": context.get("mode"),
            "emotion": context.get("emotion"),
            "original": input_,
            "reframed": output,
            "final": final_output
        }
    )

    return final_output