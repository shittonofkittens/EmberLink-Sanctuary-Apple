import random

options = [
    "Line 1 that matches the mode's spicy energy.",
    "Line 2, maybe a little more heat.",
    "Line 3, teasing or seductive depending on spice level.",
]

def apply(text, context):
    spice = context.get("spice", 0)
    
    if spice > 0:
        return f"{text}\n\n{random.choice(options)}"
    
    return text
