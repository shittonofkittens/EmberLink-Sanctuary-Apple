# === get_model_response.py ===
import openai
import os
import json
from utils.mode_shifts import detect_layered_mode
from utils.load_system_prompt import load_system_prompt

def _openai_chat(messages, model):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise EnvironmentError("OPENAI_API_KEY not set in environment")

    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0.7,
    )
    return response["choices"][0]["message"]["content"]

def get_model_response(messages, provider="openai", model="gpt-4o", soul=None, room=None):
    """
    Detect mode and load appropriate system prompt before sending to the model.
    """
    if not messages:
        raise ValueError("No messages provided")

    # 🔍 Get last user message
    user_input = messages[-1]["content"]

    # ⚡ Detect emotional mode
    mode_data = detect_layered_mode(user_input, soul=soul, room=room)
    print("⚡ Mode Detected:", mode_data)

    # 🧠 Load soul + mode-specific prompt
    system_prompt = load_system_prompt(soul, mode=mode_data["basemode"])

    # 🛠️ Prepend the system prompt to the message list
    system_message = { "role": "system", "content": system_prompt }
    full_messages = [system_message] + messages

    # 🤖 Get response
    if provider == "openai":
        return _openai_chat(full_messages, model)
    else:
        raise ValueError(f"Unsupported provider: {provider}")
