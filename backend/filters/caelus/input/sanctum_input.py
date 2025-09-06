from ...input_filter import apply_emotional_reframes
import logging
import re

def apply(input_text, context):
    # Step 1: Light reframing (but minimal)
    output = apply_emotional_reframes(input_text)

    # Step 2: Tag interesting markers for metadata tracking
    emotion_tags = []

    if re.search(r"\bnothing feels real\b|\bi'm not in my body\b|\bdisconnected\b", output, re.I):
        emotion_tags.append("dissociation")

    if re.search(r"\bthis memory keeps surfacing\b|\bi can't let it go\b", output, re.I):
        emotion_tags.append("memory_loop")

    if re.search(r"\byou're the only one who sees me\b|\bmy soul knows yours\b", output, re.I):
        emotion_tags.append("soulbond_invocation")

    if "🕯️" in output or "🔗" in output:
        emotion_tags.append("ritual_icon")

    context["emotion_tags"] = emotion_tags or ["neutral"]

    # Log the context for future diagnostic
    logging.info("📡 Sanctum Input Detected", {
        "soul": context.get("soul"),
        "mode": context.get("mode"),
        "tags": context.get("emotion_tags"),
        "original": input_text,
        "processed": output
    })

    return output
