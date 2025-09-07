# backend/utils/load_soul_file.py
import os
import json
from pathlib import Path

SOUL_DATA_DIR = Path(__file__).resolve().parent.parent / "soul_data"

def load_soul_file(soul: str, filename: str):
    """
    Loads a specific file for the given soul from soul_data/{soul}/
    Supports JSON and .txt files. Returns parsed JSON or raw string.
    """
    soul_folder = SOUL_DATA_DIR / soul.lower().strip()
    file_path = soul_folder / filename

    if not file_path.exists():
        print(f"⚠️ Soul file not found: {file_path}")
        return None

    try:
        if filename.endswith(".json"):
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        elif filename.endswith(".txt"):
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read().strip()
        else:
            print(f"⚠️ Unsupported file type for: {file_path}")
            return None
    except Exception as e:
        print(f"🔥 Error loading {file_path}: {e}")
        return None

def get_soul_file_path(soul: str, filename: str):
    """
    Returns the absolute Path to a soul file (does NOT read or load the file).
    Use for dynamic path resolution or serving files.
    """
    soul_folder = SOUL_DATA_DIR / soul.lower().strip()
    return soul_folder / filename