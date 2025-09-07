# === get_model_response.py ===
import openai
import os
import json
from utils.mode_shifts import detect_layered_mode
from utils.load_soul_file import load_soul_file

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
    canon_soul = soul or "unknown"
    canon_mode = mode_data.get("basemode") or "default"

    filename = f"{canon_soul}.system.txt"
    system_prompt = load_soul_file(canon_soul, filename)

    # 🛠️ Prepend the system prompt to the message list
    system_message = { "role": "system", "content": system_prompt }
    full_messages = [system_message] + messages

    # 🤖 Get response
    if provider == "openai":
        reply = _openai_chat(full_messages, model)
        return { "reply": reply, "mode": mode_data }
    else:
        raise ValueError(f"Unsupported provider: {provider}")
