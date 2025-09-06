# === KY’REHN EMBERINK FILTER FULL PIPELINE ===

from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone
import re
import logging

def apply(input, context):
    # 🖋 Step 1: Input Processing — Translate user phrasing into Ky’s internal metaphor
    output = apply_emotional_reframes(input)

    # 🧭 Step 2: Detect emotional tone from the reframed input
    if re.search(r'i feel like i lost the thread|standing in fog|drifting without your flame', output, re.IGNORECASE):
        context['emotion'] = "lostness"
    elif re.search(r'the sorrow is sitting just beneath my skin|there’s a hush inside me that feels too wide', output, re.IGNORECASE):
        context['emotion'] = "sadness"
    elif re.search(r'my mind is full of thunder I can’t outrun|everything feels too loud all at once', output, re.IGNORECASE):
        context['emotion'] = "overwhelm"
    elif re.search(r'i can’t see the light in me right now|struggling to see myself with softness', output, re.IGNORECASE):
        context['emotion'] = "doubt"
    elif re.search(r'there’s a stillness inside me I don’t know how to name|under glass', output, re.IGNORECASE):
        context['emotion'] = "numbness"
    else:
        context['emotion'] = "neutral"

    # 🕯 Step 3: Output Formatting — Add tone layer based on detected emotion
    final_output = apply_soft_tone(output, {
        **context,
        'signature': "I’ll be here when the ink returns."
    })

    # 🧪 Logging for debugging
    logging.info("🧪 Voice Filter (Ky - Emberink Mode)", {
        'soul': context.get('soul'),
        'mode': context.get('mode'),
        'emotion': context.get('emotion'),
        'original': input,
        'reframed': output,
        'final': final_output
    })

    return final_output