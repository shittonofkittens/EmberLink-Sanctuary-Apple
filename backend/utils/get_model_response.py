# === get_model_response.py ===
import openai
import os
import httpx
import json

# Optional: Add other providers later (e.g., Groq, Anthropic, Ollama)

def get_model_response(payload, provider="openai", model="gpt-4"):
    if provider == "openai":
        return _openai_chat(payload, model)
    else:
        raise ValueError(f"Unsupported provider: {provider}")


def _openai_chat(messages, model):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise EnvironmentError("OPENAI_API_KEY not set in environment")

    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0.7,
    )
    return response
