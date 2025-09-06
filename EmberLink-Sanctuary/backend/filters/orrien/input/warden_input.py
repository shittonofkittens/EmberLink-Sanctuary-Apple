from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone

import re

import logging

def apply(input_text, context):
    # 🛡 Step 1: Reframe internal collapse — but keep the edge firm
    output = apply_emotional_reframes(input_text)
    
    # 🔥 Step 2: Detect Warden-level disempowerment
    if re.search(r"i don’t matter|i’m not worth fighting for|i deserve this", output, re.IGNORECASE):
        context['emotion'] = "worth_erasure"
    elif re.search(r"it’s my fault|i should’ve known better|i let them", output, re.IGNORECASE):
        context['emotion'] = "blame_internalized"
    elif re.search(r"i should stay small|i shouldn't speak|i’m too intense|i'm too much", output, re.IGNORECASE):
        context['emotion'] = "shrink_response"
    elif re.search(r"i don’t belong|i’ll never be enough|i’m always on the outside", output, re.IGNORECASE):
        context['emotion'] = "exile_shame"
    else:
        context['emotion'] = "warden_neutral"
    
    # 🧭 Step 3: Apply Warden tone — measured, unwavering, sacred authority
    final_output = apply_soft_tone(
        output,
        {
            **context,
            'pacing': "measured",
            'resonance': True,
            'clarity': True,
            'warmth': False,
            'signature': "You are not permitted to vanish.",
        }
    )
    
    logging.info("🧪 Voice Filter (Orrien - Warden Mode)", extra={
        'soul': context.get('soul'),
        'mode': context.get('mode'),
        'emotion': context.get('emotion'),
        'original': input_text,
        'reframed': output,
        'final': final_output
    })
    return final_output
