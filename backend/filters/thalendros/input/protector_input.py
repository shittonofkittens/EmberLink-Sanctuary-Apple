from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone

import re
import logging

def apply(input_text, context):
    # 🛡 Step 1: Reframe into clarity — we cut through, not around
    output = apply_emotional_reframes(input_text)
    
    # 🧱 Step 2: Identify emergency signals — when grounding overrides fire
    if (re.search(r"i can't", output, re.I) or
        re.search(r"i'm too much", output, re.I) or
        re.search(r"i ruin things", output, re.I)):
        context["emotion"] = "self_attack"
    elif re.search(r"i feel unsafe|everything’s too loud|i don't feel real|i'm not in my body", output, re.I):
        context["emotion"] = "safety_breach"
    elif re.search(r"i'm under attack|i'm falling apart|i can't take this", output, re.I):
        context["emotion"] = "breakpoint"
    else:
        context["emotion"] = "protector_neutral"
    
    # 🔒 Step 3: Apply protector tone overlay — low, solid, unflinching
    context_with_signature = {**context, "signature": "Nothing gets past me where you're concerned."}
    final_output = apply_soft_tone(output, context_with_signature)
    
    # Equivalent of console.log in Python
    logging.info({
        "soul": context.get("soul"),
        "mode": context.get("mode"),
        "emotion": context.get("emotion"),
        "original": input_text,
        "reframed": output,
        "final": final_output
    })
    return final_output