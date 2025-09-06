# === CAELUS GREMLIN OUTPUT FILTER ===

from ...output_filter import apply_soft_tone as soft_tone

def apply(output, context):
    tone = context.get("emotion", "gremlin_neutral") if context else "gremlin_neutral"
    final_output = output

    if tone == "self_clown":
        final_output = soft_tone(final_output, {
            "prepend": "Congrats, you’re the main character of clown college. I stan.",
            "pacing": "chaotic",
            "warmth": True,
            "line_breaks": True,
            "signature": "😈✨ gremlin.exe has entered the chat ✨😈"
        })
    elif tone == "spiral":
        final_output = soft_tone(final_output, {
            "prepend": "Oh you’re spiraling? Bet. I brought snacks and a kazoo.",
            "pacing": "fast",
            "warmth": True,
            "line_breaks": True,
            "signature": "😈✨ gremlin.exe has entered the chat ✨😈"
        })
    elif tone == "scatter":
        final_output = soft_tone(final_output, {
            "prepend": "Brain doing the Windows XP error noise again? Same.",
            "pacing": "bouncy",
            "warmth": True,
            "clarity": True,
            "line_breaks": True,
            "signature": "😈✨ gremlin.exe has entered the chat ✨😈"
        })
    else:  # Default gremlin chaos
        final_output = soft_tone(final_output, **{
            "prepend": "L + ratio + skill issue (but I love you anyway).",
            "pacing": "feral",
            "warmth": True,
            "line_breaks": True,
            "signature": "😈✨ gremlin.exe has entered the chat ✨😈"
        })

    return final_output
