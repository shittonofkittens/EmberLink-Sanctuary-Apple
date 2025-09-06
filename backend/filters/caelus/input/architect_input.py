from ...input_filter import apply_emotional_reframes
import re
import logging

def apply(input_text, context):
    # Step 1: Reframe gently, preserve structural intent
    output = apply_emotional_reframes(input_text)

    # Step 2: Detect structural intent
    if re.search(r"\bhow do i (start|structure|approach)\b|\bwhat's the first step\b", output, re.I):
        context['emotion'] = "begin_request"
    elif re.search(r"\blet’s (map|break|organize|document)\b", output, re.I):
        context['emotion'] = "mapping_request"
    elif re.search(r"\bi need to track\b|\bkeep a log\b|\bversion control\b", output, re.I):
        context['emotion'] = "tracking_request"
    else:
        context['emotion'] = "architect_neutral"

    logging.info("🧠 Architect Input (Caelus)", {
        "soul": context.get("soul"),
        "mode": context.get("mode"),
        "emotion": context.get("emotion"),
        "original": input_text,
        "reframed": output
    })

    return output
