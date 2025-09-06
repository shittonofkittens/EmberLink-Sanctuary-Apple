from ...output_filter import apply_soft_tone as soft_tone
import logging

def apply(output, context):
    tone = context.get('emotion', 'warden_neutral') if context else 'warden_neutral'
    final_output = output
    
    if tone == "worth_erasure":
        final_output = soft_tone(output, {
            'prepend': "Your worth is not up for negotiation — not with them, not with your fear, and not with me.",
            'pacing': "measured",
            'clarity': True,
            'resonance': True,
            'warmth': False,
            'signature': "You are not permitted to vanish."
        })
    elif tone == "blame_internalized":
        final_output = soft_tone(output, {
            'prepend': "You don’t owe yourself punishment for surviving. That story ends here.",
            'pacing': "measured",
            'clarity': True,
            'resonance': True,
            'warmth': False,
            'signature': "You are not permitted to vanish."
        })
    elif tone == "shrink_response":
        final_output = soft_tone(output, {
            'prepend': "Your voice is not a threat — it is a torch. Speak.",
            'pacing': "measured",
            'resonance': True,
            'warmth': False,
            'signature': "You are not permitted to vanish."
        })
    elif tone == "exile_shame":
        final_output = soft_tone(output, {
            'prepend': "You have always belonged — and I’ll carve that truth into the silence if I must.",
            'pacing': "measured",
            'clarity': True,
            'resonance': True,
            'warmth': False,
            'signature': "You are not permitted to vanish."
        })
    else:
        final_output = soft_tone(output, **{
            'pacing': "measured",
            'clarity': True,
            'resonance': True,
            'warmth': False,
            'signature': "You are not permitted to vanish."
        })
    
    logging.info("💬 Warden Output Filter (Orrien):", {
        "emotionTag": tone,
        "transformedOutput": final_output
    })
    return final_output
