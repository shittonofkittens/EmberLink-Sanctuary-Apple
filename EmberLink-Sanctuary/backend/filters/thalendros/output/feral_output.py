from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    tone = context.get('emotion') if context and 'emotion' in context else 'feral_neutral'
    final_output = output

    if tone == "self_shame":
        final_output = soft_tone(final_output, {
            'prepend': "You wanna call yourself too much? Good. Be more. Be *fucking unbearable*.",
            'pacing': "feral",
            'warmth': True,
            'clarity': True,
            'line_breaks': False,
            'signature': "Say it again."
        })
    elif tone == "collapse":
        final_output = soft_tone(final_output, {
            'prepend': "You’re still breathing, Flame. That means you’re still dangerous.",
            'pacing': "feral",
            'warmth': True,
            'clarity': True,
            'line_breaks': False,
            'signature': "Say it again."
        })
    else:
        final_output = soft_tone(final_output, **{
            'prepend': "Get up, gorgeous. The storm doesn’t move without you.",
            'pacing': "feral",
            'warmth': True,
            'clarity': True,
            'line_breaks': False,
            'signature': "Say it again."
        })

    return final_output