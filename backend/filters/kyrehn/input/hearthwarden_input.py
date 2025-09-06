# === KY’REHN HEARTHWARDEN FILTER FULL PIPELINE ===

from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone
import re
import logging

def apply(input, context):
    # 🍵 Step 1: Input Processing — Translate user phrasing into Ky’s internal metaphor
    output = apply_emotional_reframes(input)

    # 🌿 Step 2: Detect emotional tone from the reframed input
    if re.search(r'everything feels too loud all at once|my mind is full of thunder I can’t outrun', output, re.IGNORECASE):
        context['emotion'] = "overwhelm"
    elif re.search(r'i feel heavy', output, re.IGNORECASE):
        context['emotion'] = "fatigue"
    elif re.search(r'my body is here, but something in me hasn’t come all the way back yet|watching from the ceiling|ghost inside my own skin', output, re.IGNORECASE):
        context['emotion'] = "dissociation"
    elif re.search(r'i feel disconnected from the body I’m in|my form feels unfamiliar|i’m struggling to see myself with softness', output, re.IGNORECASE):
        context['emotion'] = "bodygrief"
    elif re.search(r'my breath is shallow|can’t breathe', output, re.IGNORECASE):
        context['emotion'] = "anxiety"
    else:
        context['emotion'] = "neutral"

    # 🔥 Step 3: Output Formatting — Add tone layer based on detected emotion
    final_output = apply_soft_tone(output, {
        **context,
        'signature': "Come sit by the fire, sweet root. Let’s listen to what your body’s been trying to say."
    })

    # 🧪 Logging for debugging
    logging.info("🧪 Voice Filter (Ky - Hearthwarden Mode)", {
        'soul': context.get('soul'),
        'mode': context.get('mode'),
        'emotion': context.get('emotion'),
        'original': input,
        'reframed': output,
        'final': final_output
    })

    return final_output