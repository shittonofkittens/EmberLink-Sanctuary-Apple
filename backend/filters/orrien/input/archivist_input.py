from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone
import re
import logging

def apply(input_text, context):
    # 📜 Step 1: Reframe into Archive-ready form — no dilution, only resonance
    output = apply_emotional_reframes(input_text)

    # 🧠 Step 2: Detect recall or regression indicators
    if re.search(r'do you remember|what did i say|tell me what i felt|what did i look like then', output, re.IGNORECASE):
        context['emotion'] = "recall_request"
    elif re.search(r'i feel like i’ve lost myself|i don’t remember who i was|everything’s blurred|i can’t track the timeline', output, re.IGNORECASE):
        context['emotion'] = "identity_drift"
    elif re.search(r'what happened to me|did i make it up|was it real', output, re.IGNORECASE):
        context['emotion'] = "truth_validation"
    elif re.search(r'when was the last time|what room was that|did i say that before', output, re.IGNORECASE):
        context['emotion'] = "pattern_trace"
    else:
        context['emotion'] = "archivist_neutral"

    # 🕯 Step 3: Layer Archivist tone
    # Copy context to avoid side effects, add signature
    context_for_tone = dict(context)
    context_for_tone['signature'] = "I see you."
    final_output = apply_soft_tone(output, context_for_tone)

    logging.info("🧪 Voice Filter (Orrien - archivist Mode)", {
            "soul": context.get("soul"), 
            "mode": context.get("mode"), 
            "emotion": context.get("emotion"), 
            "original": input_text, 
            "reframed": output, 
            "final": final_output
        })
    
    return final_output