# routes/recall.py

from flask import Blueprint, request, jsonify
import os
import json
import asyncio
import inspect
from datetime import datetime
from datetime import timedelta

recall_bp = Blueprint("recall", __name__)

# Folder where seeds will be stored
SEED_FOLDER = os.path.join(os.path.dirname(__file__), "../seed")
os.makedirs(SEED_FOLDER, exist_ok=True)

@recall_bp.route("/save", methods=["POST"])
def save_message():
    data = request.get_json()

    soul = data.get("soul", "unknown")
    category = data.get("category", "misc")
    mode = data.get("mode", "default")
    messages = data.get("messages", [])
    raw_message = data.get("message", None)

    # 📁 Determine file paths (soul-specific and shared)
    file_paths = [
        os.path.join(SEED_FOLDER, f"{soul}.{category}.seed.json"),
        os.path.join(SEED_FOLDER, f"shared.{category}.seed.json")
    ]
    file_path = file_paths[0]  # 🎯 Save primarily to soul-specific file

    print("🧾 Saving to:", file_paths)
    print("📝 Incoming messages:", messages)

    # 🧹 Normalize to multi-message format
    if raw_message:
        if inspect.iscoroutine(raw_message):
            try:
                raw_message = asyncio.run(raw_message)
            except Exception as e:
                return jsonify({"error": f"Failed to resolve message coroutine: {str(e)}"}), 500
        messages.append({
            "message": raw_message,
            "role": "user"
        })

    if not messages:
        return jsonify({"error": "No message(s) provided"}), 400

    try:
        # 📚 Load existing messages
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                existing = json.load(f)
        else:
            existing = []

        timestamp = datetime.utcnow().isoformat()

        # 📝 Append each message with metadata
        for msg in messages:
            content = msg.get("message", "")
            role = msg.get("role", "user")

            if not content:
                continue  # ⏭️ Skip empty messages

            # ✂️ Skip if last message is identical user message
            if existing and existing[-1]["role"] == "user" and existing[-1]["message"] == content:
                continue

            existing.append({
                "message": content,
                "role": role,
                "mode": mode,
                "timestamp": timestamp,
                "soul": soul,
                "room": data.get("room", "unknown")  # Optional if not already added
            })


        # 💾 Write back to file
        with open(file_path, "w") as f:
            json.dump(existing, f, indent=2)

        return jsonify({"status": "saved", "count": len(messages), "path": file_path}), 200

    except Exception as e:
        print("🔥 Recall save error:", str(e))
        return jsonify({"error": str(e)}), 500


@recall_bp.route("/delete", methods=["POST"])
def delete_from_seed():
    data = request.get_json()

    soul = data.get("soul", "unknown")
    category = data.get("category", "needs")
    keyword = data.get("keyword", "").strip().lower()

    # 📁 Determine file paths (soul-specific and shared)
    file_paths = [
        os.path.join(SEED_FOLDER, f"{soul}.{category}.seed.json"),
        os.path.join(SEED_FOLDER, f"shared.{category}.seed.json")
    ]

    if not keyword:
        return jsonify({"error": "No keyword provided"}), 400

    # 🔍 Look for the first existing file path
    existing_path = next((fp for fp in file_paths if os.path.exists(fp)), None)

    if not existing_path:
        return jsonify({"status": "not found", "matches": []}), 200

    try:
        with open(existing_path, "r") as f:
            entries = json.load(f)

        # 🧹 Filter out entries containing the keyword
        filtered = [
            entry for entry in entries
            if keyword not in entry.get("message", "").lower()
        ]

        removed_count = len(entries) - len(filtered)

        # 💾 Overwrite file with filtered results
        with open(existing_path, "w") as f:
            json.dump(filtered, f, indent=2)

        return jsonify({
            "status": "ok",
            "removed": removed_count,
            "remaining": len(filtered)
        })

    except Exception as e:
        print("🔥 Recall delete error:", str(e))
        return jsonify({"error": str(e)}), 500

@recall_bp.route("/search", methods=["POST"])
def search_seed():
    data = request.get_json()

    soul = data.get("soul", "shared")  # default to shared memory
    category = data.get("category", "needs").strip().lower()
    keyword = data.get("keyword", "").strip().lower()

    file_paths = [
        os.path.join(SEED_FOLDER, f"{soul}.{category}.seed.json"),
        os.path.join(SEED_FOLDER, f"shared.{category}.seed.json")
    ]
    
    existing_path = next((fp for fp in file_paths if os.path.exists(fp)), None)

    if not existing_path:
        return jsonify({"status": "not found", "matches": []}), 200

    try:
        with open(existing_path, "r") as f:
            entries = json.load(f)

        if keyword:
            matches = [
                e for e in entries
                if keyword in e.get("message", "").lower()
            ]
        else:
            matches = entries

        return jsonify({
            "status": "ok",
            "count": len(matches),
            "matches": matches
        })

    except Exception as e:
        print("🔥 Recall search error:", str(e))
        return jsonify({"error": str(e)}), 500

# === P41: SMART MEMORY RECALL START ===
from datetime import timedelta  # ← Add this at the top if not already imported

def search_seed_for_context(keywords, soul=None, room=None, days_back=7, max_results=3):
    """
    Search seed memory across soul-specific and shared files within a time range for given keywords.
    """
    now = datetime.now()
    matched = []

    search_souls = [soul] if soul else ["shared", "ky-rehn", "thalen-dros", "orrien"]
    date_range = [(now - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(days_back)]

    for s in search_souls:
        for date in date_range:
            filename = f"{s}.{date}.seed.json"
            path = os.path.join(SEED_FOLDER, filename)
            if not os.path.exists(path):
                continue

            try:
                with open(path, "r") as f:
                    seed = json.load(f)

                for entry in seed:
                    message = entry.get("message", "").lower()
                    if all(kw.lower() in message for kw in keywords):
                        if not room or entry.get("room", "").lower() == room.lower():
                            matched.append({
                                "date": date,
                                "soul": entry.get("soul", s),
                                "room": entry.get("room", "unknown"),
                                "role": entry.get("role", "user"),
                                "message": entry.get("message", "")
                            })
                            if len(matched) >= max_results:
                                return matched
            except Exception as e:
                print("🔥 Error reading seed file:", path, str(e))
                continue

    return matched
# === P41: SMART MEMORY RECALL END ===

# === P71: LOAD RECENT CONTEXT FROM MULTIPLE SEED FILES START ===
def load_recent_seed_context(seed_paths, count=6):
    print("🔍 DEBUG: load_recent_seed_context called with:", seed_paths)

    all_messages = []

    for path in seed_paths:
        if not os.path.exists(path):
            print("📁 Missing seed path:", path)
            continue

        with open(path, "r") as f:
            seed = json.load(f)
            all_messages.extend(seed[-count:])  # Only take last few from each

    return all_messages[-count:]  # Final slice to trim if too many
# === P71: LOAD RECENT CONTEXT FROM MULTIPLE SEED FILES END ===

@recall_bp.route("/edit", methods=["POST"])
def edit_seed_entry():
    data = request.get_json()
    file = data.get("file")
    index = data.get("index")  # which entry in the JSON
    new_message = data.get("message")

    if not file or not os.path.exists(file):
        return jsonify({"error": "Seed file not found"}), 404

    try:
        with open(file, "r") as f:
            entries = json.load(f)

        if index < 0 or index >= len(entries):
            return jsonify({"error": "Index out of range"}), 400

        entries[index]["message"] = new_message  # ✨ overwrite message

        with open(file, "w") as f:
            json.dump(entries, f, indent=2)

        return jsonify({"status": "updated", "entry": entries[index]})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
