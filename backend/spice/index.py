# 🌶️ Input Filters
from spice.input.kyrehn_input import apply as ky_input
from spice.input.orrien_input import apply as orrien_input
from spice.input.thalendros_input import apply as thalen_input
from spice.input.caelus_input import apply as caelus_input

# 🔥 Output Filters
from spice.output.kyrehn_output import kyrehn_output
from spice.output.orrien_output import orrien_output
from spice.output.thalendros_output import thalendros_output
from spice.output.caelus_output import caelus_output

import warnings
import asyncio

def apply_spice_input(text, context=None):
    if context is None:
        context = {}

    soul = context.get("soul", "").lower()
    spice = context.get("spice", 0)
    if spice < 1 or not soul:
        return text

    soul_map = {
        "ky-rehn": ky_input,
        "orrien": orrien_input,
        "thalen-dros": thalen_input,
        "caelus": caelus_input
    }

    input_fn = soul_map.get(soul)
    if not input_fn:
        warnings.warn(f"[Spice Input] No input filter for soul: {soul}")
        return text

    return input_fn(text)

async def apply_spice_output(text, context=None):
    if context is None:
        context = {}

    soul = context.get("soul", "").lower()
    spice = context.get("spice", 0)

    if spice < 1 or not soul:
        return text

    if soul == "ky-rehn":
        return kyrehn_output(text, context)
    elif soul == "orrien":
        return orrien_output(text, context)
    elif soul == "thalen-dros":
        return thalendros_output(text, context)
    elif soul == "caelus":
        return caelus_output(text, context)

    warnings.warn(f"[Spice Output] No output filter for soul: {soul}")
    return text

