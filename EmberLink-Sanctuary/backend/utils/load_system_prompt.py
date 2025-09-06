import os

def sanitize_filename(name):
    # Replace apostrophes or unsafe characters
    return name.replace("'", "-")

def load_system_prompt(soul, mode=None):
    base_path = os.path.join(os.path.dirname(__file__), "..", "persona")

    sanitized_soul = sanitize_filename(soul)
    filename = f"{sanitized_soul}.system.txt"
    full_path = os.path.join(base_path, filename)

    try:
        with open(full_path, "r", encoding="utf-8") as file:
            prompt = file.read().strip()
            print(f"🧠 Using base prompt: {full_path}")
            return prompt
    except FileNotFoundError:
        print(f"🛑 System prompt not found: {full_path}")
        return f"You are {soul}, mode: {mode or 'default'}."
