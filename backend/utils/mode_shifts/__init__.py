from .mode_shift_caelus import detect_layered_mode as caelus_shift
from .mode_shift_kyrehn import detect_layered_mode as kyrehn_shift
from .mode_shift_orrien import detect_layered_mode as orrien_shift
from .mode_shift_thalendros import detect_layered_mode as thalendros_shift
from filters.index import norm_soul 

# ✅ MATCHES norm_soul() output
soul_shift_map = {
    "caelus": caelus_shift,
    "kyrehn": kyrehn_shift,
    "orrien": orrien_shift,
    "thalendros": thalendros_shift,
}

def detect_layered_mode(text, soul=None, room=None):
    """Route mode detection to the correct soul-specific mode_shift."""
    soul = norm_soul(soul or "")  # ✅ normalized properly
    shift_fn = soul_shift_map.get(soul)

    if shift_fn:
        return shift_fn(text, soul=soul, room=room)

    # fallback if no soul match
    return {
        "emotion": "neutral",
        "basemode": "anchor",  # grounding default
        "modifiers": []
    }