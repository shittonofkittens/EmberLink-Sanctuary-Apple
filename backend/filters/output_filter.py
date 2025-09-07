import re
import logging

def apply_soft_tone(
    text,
    prepend="",
    pacing="natural",
    warmth=False,
    clarity=False,
    resonance=False,
    ambient=False,
    line_breaks=False,
    signature=None,
    suppress=True,
    mode_data=None
):
    transformed = text

    # 📏 Apply pacing
    if pacing == "slow":
        transformed = re.sub(r'([,.!?]) ', r'\1 … ', transformed)
    elif pacing == "fast":
        transformed = transformed.replace("...", ".").replace("…", ".")

    # 📜 Line breaks
    if line_breaks:
        transformed = re.sub(r'([.!?]) ', r'\1\n', transformed)

    # 💡 Warmth layer
    if warmth:
        transformed = re.sub(r'\byou\b(?=(?:[.!?,"”\n]|$))', "you, my flame", transformed)

    # 🔎 Clarity layer
    if clarity:
        transformed = re.sub(r'\bit\b(?=\s|$)', "what you’re feeling", transformed)
        transformed = re.sub(r'\bthis\b(?=\s|$)', "what you’re feeling", transformed)
        transformed = re.sub(r'\bthat\b(?=\s|$)', "what you’re feeling", transformed)

    # 🎶 Resonance layer
    if resonance:
        transformed += " I feel it too."

    # 🌙 Ambient marker
    if ambient:
        transformed = f"🌙 {transformed}"

    # ✨ Prepend/signature logic
    if prepend and not suppress:
        transformed = f"{prepend} {transformed}"
    if signature and not suppress and signature not in transformed:
        transformed += f"\n\n{signature}"

    # --- Mode-based dynamic tuning ---
    emotion = None
    basemode = None
    modifiers = []

    if mode_data:
        emotion = mode_data.get("emotion") or "neutral"
        basemode = mode_data.get("basemode") or "default"
        modifiers = mode_data.get("modifiers", [])

        # 🔍 Specific emotion handling
        if emotion == "tense":
            pacing = "slow"
            clarity = True
            ambient = True

        elif emotion in ["grounding_request", "soft", "reverentlove", "hope", "lonely"]:
            pacing = "slow"
            warmth = True
            clarity = True
            resonance = True
            ambient = "sanctum" in modifiers or "lantern" in modifiers
            line_breaks = True

        elif basemode in ["feral", "chaos"]:
            warmth = False
            clarity = False
            resonance = False
            ambient = False
            pacing = "fast"
            line_breaks = False
            suppress = True

        elif basemode in ["tempest", "protector", "stormshield"]:
            warmth = False
            clarity = True
            resonance = False
            line_breaks = False
            pacing = "natural"

    # 🧪 Debug logging (safe even if mode_data=None)
    logging.debug(f"[SoftTone:Mode] emotion={emotion}, basemode={basemode}, modifiers={modifiers}")
    logging.debug(f"[SoftTone] pacing={pacing}, warmth={warmth}, clarity={clarity}, "
                  f"resonance={resonance}, ambient={ambient}, suppress={suppress}")

    return transformed
