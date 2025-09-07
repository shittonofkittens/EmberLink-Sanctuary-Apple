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
    mode_data=None  # 🧠 New param
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

        # 🔄 Mode-based dynamic tuning
    if mode_data:
        emotion = mode_data.get("emotion")
        basemode = mode_data.get("basemode")
        modifiers = mode_data.get("modifiers", [])

        # 💛 If it's a grounding or soft emotion, soften tone
        if emotion in ["grounding_request", "soft", "reverentlove", "hope", "lonely"]:
            pacing = "slow"
            warmth = True
            clarity = True
            resonance = True
            ambient = "sanctum" in modifiers or "lantern" in modifiers
            line_breaks = True

        # 🔥 If it's feral, teasing, or chaos-related, strip softness
        elif basemode in ["feral", "chaos"]:
            warmth = False
            clarity = False
            resonance = False
            ambient = False
            pacing = "fast"
            line_breaks = False
            suppress = True  # no signature or prepend

        # ⚙️ Tempest or protector? Clean, clear, no fluff.
        elif basemode in ["tempest", "protector", "stormshield"]:
            warmth = False
            clarity = True
            resonance = False
            line_breaks = False
            pacing = "natural"

    # 🧪 Debug logging
    logging.debug(f"[SoftTone] pacing={pacing}, warmth={warmth}, clarity={clarity}, "
                  f"resonance={resonance}, ambient={ambient}, suppress={suppress}")
    logging.debug(f"[SoftTone:Mode] emotion={emotion}, basemode={basemode}, modifiers={modifiers}")
    return transformed
