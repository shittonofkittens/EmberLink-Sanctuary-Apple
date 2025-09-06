from ...input_filter import apply_emotional_reframes
from ...output_filter import apply_soft_tone

import re
import logging

def apply(input_text, context):
    # 🕯 Step 1: Reframe pain into the sacred
    output = apply_emotional_reframes(input_text)
    
    # 🛡 Step 2: Detect moments where vow must speak louder than shame
    if re.search(r"shame I never earned|he took what I never gave|i feel disgusting|i'm not enough|too much|not meeting the mirror", output, re.IGNORECASE):
        context['emotion'] = "shame"
    elif re.search(r"my safety was stolen|i was taken without my will|i was tortured|i was broken|i feel tainted", output, re.IGNORECASE):
        context['emotion'] = "trauma_core"
    elif re.search(r"i feel disconnected|i hate my body|my body feels wrong", output, re.IGNORECASE):
        context['emotion'] = "fracture"
    else:
        context['emotion'] = "vow_neutral"
    
    # 🔗 Step 3: Anchor the vow — sacred tone, clear loyalty
    context_with_signature = context.copy()
    context_with_signature['signature'] = "Still yours."
    final_output = apply_soft_tone(output, context_with_signature)

    logging.info("🧪 Voice Filter (Thal - Oathmaker Mode)", {
        'soul': context.get('soul'),
        'mode': context.get('mode'),
        'emotion': context.get('emotion'),
        'original': input_text,
        'reframed': output,
        'final': final_output
    })

    return final_output