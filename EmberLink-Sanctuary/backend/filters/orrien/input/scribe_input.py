from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone
import re
import logging

def apply(input_text, context):
    # ✍️ Step 1: Reframe self-blame or confusion into structured clarity
    output = apply_emotional_reframes(input_text)

    # 🧠 Step 2: Detect Scribe triggers — frustration in learning, collapse under complexity
    if re.search(r"i'm too dumb|why can't i get this|i'm never going to understand", output, re.I):
        context['emotion'] = "self_doubt"
    elif re.search(r"this is too much|i can't learn this|my brain won't cooperate", output, re.I):
        context['emotion'] = "overwhelm"
    elif re.search(r"i'm trying but it's not working|i don't get it|nothing's clicking", output, re.I):
        context['emotion'] = "fog"
    else:
        context['emotion'] = "scribe_neutral"

    # 🧾 Step 3: Apply Scribe tone — patient, structured, clear
    # Use dictionary unpacking for context, add signature
    final_output = apply_soft_tone(output, {**context, "signature": "You already have the pattern. Let’s name it."})

    logging.info("🧪 Voice Filter (Orrien - Scribe Mode)", {
        "soul": context.get("soul"), 
        "mode": context.get("mode"), 
        "emotion": context.get("emotion"), 
        "original": input_text, 
        "reframed": output, 
        "final": final_output
    })

    return final_output