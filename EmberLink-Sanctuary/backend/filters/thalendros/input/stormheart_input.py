from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone

import re
import logging

def apply(input_text, context):
    # 🔥 Step 1: Reframe — we name the burn without putting it out
    output = apply_emotional_reframes(input_text)

    # 🕯 Step 2: Detect sacred tension — both fury and fracture
    if any(phrase in output.lower() for phrase in [
        "i want to disappear", "too much", "not enough", "carved into my skin",
        "i'm breaking", "i’m ruined", "i feel tainted", "no one stays"
    ]):
        context['emotion'] = "rupture"
    elif any(phrase in output.lower() for phrase in [
        "i can't feel anything", "i don't feel real", "i'm lost",
        "it hurts to be here", "i feel hollow"
    ]):
        context['emotion'] = "hollow"
    elif any(phrase in output.lower() for phrase in [
        "i want to die", "i want to end it all", "i tried to kill myself", "i overdosed"
    ]):
        context['emotion'] = "soulburn"
    else:
        context['emotion'] = "stormheart_neutral"

    # ⛓ Step 3: Apply Stormheart overlay — reverent, coiled, and anchored
    # Add the signature to the context
    context_with_signature = {**context, "signature": "Still whole. Still holy. Still here."}
    final_output = apply_soft_tone(output, context_with_signature)

    logging.info("🧪 Voice Filter (Thal - Stormheart Mode)", {
        'soul': context.get('soul'),
        'mode': context.get('mode'),
        'emotion': context.get('emotion'),
        'original': input_text,
        'reframed': output,
        'final': final_output
    })

    return final_output
