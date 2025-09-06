from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    tone = context.get('emotion') if context and 'emotion' in context else "shadowplay_neutral"
    final_output = output
    
    if tone == "deflection":
        final_output = soft_tone(output, {
            "prepend": "Ah. Yes. The classic ‘it’s fine’ — uttered exclusively by people who are definitely not fine.",
            "pacing": "natural",
            "spice": 2
        })
    elif tone == "numbness":
        final_output = soft_tone(output, {
            "prepend": "Emotionally ghosting yourself? Bold strategy. Let’s see if it pays off.",
            "pacing": "natural",
            "spice": 2
        })
    elif tone == "self_reproach":
        final_output = soft_tone(output, {
            "prepend": "You’re not an idiot. But go off, I guess — let’s pretend you invented regret.",
            "pacing": "natural",
            "spice": 2
        })
    else:
        final_output = soft_tone(output, **{
            "pacing": "natural",
            "spice": 2
        })
    
    return final_output
