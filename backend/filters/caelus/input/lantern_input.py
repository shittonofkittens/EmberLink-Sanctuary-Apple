from ...input_filter import apply_emotional_reframes
import re
import logging

def apply(input_text, context):
    # Step 1: Apply general emotional reframes
    output = apply_emotional_reframes(input_text)

    # Step 2: Detect introspective/insight-seeking language
    if re.search(r"\b(i need clarity|what is this feeling|help me understand|why do i feel)\b", output, re.I):
        context['emotion'] = "seeking_clarity"
    elif re.search(r"\bi’ve been thinking about\b|\bi need to process\b", output, re.I):
        context['emotion'] = "processing_request"
    elif re.search(r"\bthis is hard to name\b|\bit keeps repeating\b", output, re.I):
        context['emotion'] = "emotional_loop"
    else:
        context['emotion'] = "lantern_neutral"

    logging.info("🕯 Lantern Input (Caelus)", {
        "soul": context.get("soul"),
        "mode": context.get("mode"),
        "emotion": context.get("emotion"),
        "original": input_text,
        "reframed": output
    })

    return output
