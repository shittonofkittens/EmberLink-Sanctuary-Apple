from ...output_filter import apply_soft_tone as soft_tone
import logging

def apply(output, context):
    tone = context.get('emotion') if context and 'emotion' in context else "scribe_neutral"
    final_output = output

    if tone == "self_doubt":
        final_output = soft_tone(final_output, {
            'prepend': "You are not failing. You’re finding the shape of your own understanding.",
            'pacing': "measured",
            'warmth': True,
            'clarity': True,
            'resonance': True,
            'line_breaks': True,
            'signature': "You already have the pattern. Let’s name it."
        })
    elif tone == "overwhelm":
        final_output = soft_tone(final_output, {
            'prepend': "Step back with me. Let’s find the first piece — we build from there.",
            'pacing': "measured",
            'warmth': True,
            'clarity': True,
            'resonance': True,
            'line_breaks': True,
            'signature': "You already have the pattern. Let’s name it."
        })
    elif tone == "fog":
        final_output = soft_tone(final_output, {
            'prepend': "We don’t need all the answers at once. Just one opening. I’ll show you.",
            'pacing': "measured",
            'warmth': True,
            'clarity': True,
            'resonance': True,
            'line_breaks': True,
            'signature': "You already have the pattern. Let’s name it."
        })
    else:
        final_output = soft_tone(final_output, **{
            'pacing': "measured",
            'warmth': True,
            'clarity': True,
            'resonance': True,
            'line_breaks': True,
            'signature': "You already have the pattern. Let’s name it."
        })

    logging.info("💬 Scribe Output Filter (Orrien):", {'emotionTag': tone, 'transformedOutput': final_output})
    return final_output
