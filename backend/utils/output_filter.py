def apply_output_filter(text, soul, mode, spice=0):
    # Example: Thalen's chaos mode + spice filter
    if soul.lower() == "thalen'dros":
        if mode == "chaos" and spice > 0:
            # Replace gentle phrases, add fire, etc.
            text = text.replace("you are strong", "you're fucking unstoppable")
        # Add more filters as needed

    return text
