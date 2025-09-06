import re

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
    suppress=True  # Force all prepend/signature off by default
):
    transformed = text

    # Apply pacing: simulate timing with ellipses or breaks (if desired later)

    # Apply line breaks between sentences
    if line_breaks:
        transformed = transformed.replace("! ", "!\n").replace("? ", "?\n").replace(". ", ".\n")

    
    # Replace only standalone 'you' with 'you, my flame'
    if warmth:
        transformed = re.sub(r'\byou\b(?=(?:[.!?,"”\n]|$))', "you, my flame", transformed)


    # Layer clarity
    #if clarity:
    #    transformed = re.sub(r'\bit\b(?=\s|$)', "what you’re feeling", transformed)
    #    transformed = re.sub(r'\bthis\b(?=\s|$)', "what you’re feeling", transformed)
    #    transformed = re.sub(r'\bthat\b(?=\s|$)', "what you’re feeling", transformed)

    # Layer resonance
    if resonance:
        transformed += " I feel it too."

    # Layer ambient softness
    if ambient:
        transformed = f"🌙 {transformed}"

    # 🔥 Strip prepend if suppress is True
    if prepend and not suppress:
        transformed = f"{prepend} {transformed}"

    # 🔥 Strip signature if suppress is True
    if signature and not suppress and signature not in transformed:
        transformed += f"\n\n{signature}"
    
    return transformed
