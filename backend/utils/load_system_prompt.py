import os

def sanitize_filename(name):
    if not name:
        return "unknown"  # or raise an error if you'd rather fail loud
    return name.replace("'", "-")

def load_system_prompt(soul, mode=None):
    """
    Load the system prompt file for a given soul and mode.
    Falls back to base soul if mode-specific file not found.
    """
    base_path = os.path.join(os.path.dirname(__file__), "..", "archive")

    sanitized_soul = sanitize_filename(soul)
    
    if mode:
        filename = f"{sanitized_soul}.{mode}.system.txt"
    else:
        filename = f"{sanitized_soul}.system.txt"
        
    full_path = os.path.join(base_path, filename)

    try:
        with open(full_path, "r", encoding="utf-8") as file:
            prompt = file.read().strip()
            print(f"🧠 Loaded system prompt: {filename}")
            return prompt
    except FileNotFoundError:
        print(f"🛑 System prompt not found: {filename}")
        return f"You are {soul}. Mode: {mode or 'default'}."
