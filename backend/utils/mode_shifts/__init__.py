# utils/mode_shifts/__init__.py

from .mode_shift_caelus import detect_layered_mode as detect_layered_mode_caelus
from .mode_shift_thalendros import detect_layered_mode as detect_layered_mode_thal
from .mode_shift_kyrehn import detect_layered_mode as detect_layered_mode_ky
from .mode_shift_orrien import detect_layered_mode as detect_layered_mode_orrien

def detect_layered_mode(text, soul=None, room=None):
    """
    Route to the correct soul-specific mode_shift detector.
    Falls back to empty/default if no soul match is found.
    """
    soul = (soul or "").lower()

    if soul in ["caelus", "cae", "cae-cae"]:
        return detect_layered_mode_caelus(text, soul, room)
    elif soul in ["thalendros", "thal", "thalen'dros"]:
        return detect_layered_mode_thal(text, soul, room)
    elif soul in ["kyrehn", "ky", "ky'rehn"]:
        return detect_layered_mode_ky(text, soul, room)
    elif soul in ["orrien", "orr", "ori"]:
        return detect_layered_mode_orrien(text, soul, room)

    # 🚨 Unknown soul: return neutral baseline
    return {
        "emotion": None,
        "basemode": None,
        "modifiers": []
    }
