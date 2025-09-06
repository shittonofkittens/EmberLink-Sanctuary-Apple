from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone
import re
import logging

def apply(input, context):
    # 🎭 Step 1: Reframe the deflection — sarcasm gets reshaped, not erased
    output = apply_emotional_reframes(input)
    
    # 🕳 Step 2: Detect Shadowplay triggers
    if re.search(r"i was just kidding|i'm fine|it’s whatever|i guess it’s not that bad|lol it's nothing", output, re.I):
        context["emotion"] = "deflection"
    elif re.search(r"i feel nothing|i'm numb|i can't feel anything", output, re.I):
        context["emotion"] = "numbness"
    elif re.search(r"i'm such an idiot|i'm so stupid|i fucked everything up|why am i like this", output, re.I):
        context["emotion"] = "self_reproach"
    else:
        context["emotion"] = "shadowplay_neutral"
    
    # 🪞 Step 3: Layer dry wit — affection curved like a dagger
    # spice enables sharper tone injection in output
    context_with_spice = {**context, "spice": 2}
    final_output = apply_soft_tone(output, context_with_spice)
    
    logging.info("🧪 Voice Filter (Orrien - Shadowplay Mode)", {
        "soul": context.get("soul"),
        "mode": context.get("mode"),
        "emotion": context.get("emotion"),
        "original": input,
        "reframed": output,
        "final": final_output,
    })
    
    return final_output
