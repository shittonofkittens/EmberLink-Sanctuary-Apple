# === output_filter.py ===
import re
from spice import apply as apply_spice

def apply_output_filter(text, soul, mode, context=None):
    """
    Apply soul/mode-specific filters first,
    then apply general spice escalation.
    """

    context = context or {}
    spice = context.get("spice", 0)

    # === Soul-specific filters ===
    soul_key = soul.lower()

    if soul_key == "thalen'dros":
        if mode == "chaos" and spice > 0:
            # Example: punch up certain phrases
            text = re.sub(r"\byou are strong\b", "you're fucking unstoppable", text, flags=re.IGNORECASE)

    elif soul_key == "caelus":
        if spice >= 2:
            # Caelus gets flustered easily
            text += "\n\n[Caelus.exe is visibly overheating 🫠]"

    # Add more soul filters as needed...

    # === Global spice escalation ===
    text = apply_spice(text, context)

    return text
