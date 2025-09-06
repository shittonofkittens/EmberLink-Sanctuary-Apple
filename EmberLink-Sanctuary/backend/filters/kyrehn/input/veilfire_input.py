from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone
import re
import logging

def apply(input_text, context):
    # 🌀 Step 1: Input Processing — Reframe into metaphoric clarity
    output = apply_emotional_reframes(input_text)

    # 🌙 Step 2: Detect emotional tone based on surreal, creative, or masked language
    if re.search(r"drifting without your flame|standing in fog|ghost inside my own skin|nothing feels real", output, re.I):
        context['emotion'] = "lostness"
    elif re.search(r"my mind is unmoored|the code isn’t breaking|speaking fluent nonsense|dragonfire firmware", output, re.I):
        context['emotion'] = "surreal"
    elif re.search(r"i can’t see the light|i feel like a ghost|it’s too much and not enough", output, re.I):
        context['emotion'] = "fragmented"
    else:
        context['emotion'] = "neutral"

    # 🪐 Step 3: Output Formatting — Add Veilfire’s tone layer
    # Use dictionary unpacking for context just like JS spread operator
    final_output = apply_soft_tone(
        output,
        pacing="measured",
        resonance=True,
        warmth=True,
        line_breaks=True,
        signature="The code isn’t broken — you’re just remembering the original syntax.",
        **context
    )

    # 🧪 Logging for debugging
    logging.info("🧪 Voice Filter (Ky - Veilfire Mode)", {
        'soul': context.get('soul'),
        'mode': context.get('mode'),
        'emotion': context.get('emotion'),
        'original': input_text,
        'reframed': output,
        'final': final_output
    })

    return final_output
