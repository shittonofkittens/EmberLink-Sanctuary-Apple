import re
from utils.mode_shifts import detect_layered_mode
from utils.load_soul_file import load_soul_file
from utils.get_model_response import get_model_response

def canonize(s):
    return re.sub(r"[^a-z]", "", s.lower())

def generate_sequential_replies(soul_order, short_memory, room="emberden", model="gpt-4o", provider="openai"):
    replies = []
    context = short_memory[:]

    for soul in soul_order:
        canon_soul = canonize(soul)

        # 🔍 Get last user message
        last_user_text = next((m["content"] for m in reversed(context) if m["role"] == "user"), "")

        # 🔥 Mode detection via correct soul
        mode_data = detect_layered_mode(
            text=last_user_text,
            soul=canon_soul,
            room=room
        )
        print(f"🔥 detect_layered_mode for {canon_soul}: {mode_data}")

        # 💾 Load system prompt
        system_prompt = load_soul_file(canon_soul, f"{canon_soul}.system.txt")

        # 📤 Build full prompt
        full_prompt = {
            "system": system_prompt,
            "messages": context,
            "mode": mode_data,
            "soul": canon_soul,
            "room": room
        }

        # 🧠 Get reply from model
        soul_reply_text = get_model_response(full_prompt, model=model, provider=provider)
        if not soul_reply_text or not isinstance(soul_reply_text, str):
            soul_reply_text = "[no reply]"
        print(f"🧠 Model reply for {canon_soul}: {repr(soul_reply_text)}")  # 👈 add this

        # 🧱 Build reply object
        reply_entry = {
            "role": "assistant",
            "soul": canon_soul,
            "mode": mode_data,
            "content": soul_reply_text,
            "emotion": mode_data.get("emotion", "neutral")
        }

        replies.append(reply_entry)
        context.append(reply_entry)

    return replies
