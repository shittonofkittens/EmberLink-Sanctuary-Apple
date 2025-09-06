# routes/history.py
from flask import Blueprint, request, jsonify
import os, json

from utils.rooms import get_message_limit  # 👈 pull from central config

history_bp = Blueprint("history", __name__)
MESSAGES_FOLDER = os.path.join(os.path.dirname(__file__), "../messages")
os.makedirs(MESSAGES_FOLDER, exist_ok=True)

MAX_SHARED_MESSAGES = 200
MAX_PRIVATE_MESSAGES = 100

def get_message_limit(room_id: str):
    """Decide trim size depending on room type."""
    if room_id.startswith("shared"):  # 🌐 Shared rooms
        return MAX_SHARED_MESSAGES
    return MAX_PRIVATE_MESSAGES  # 🔐 Private rooms

def get_file_path(room_id):
    return os.path.join(MESSAGES_FOLDER, f"{room_id}.json")

@history_bp.route("/save", methods=["POST"])
def save_history():
    data = request.get_json()
    room_id = data.get("room", "").lower()
    messages = data.get("messages", [])

    if not room_id:
        return jsonify({ "error": "Room ID required." }), 400

    path = get_file_path(room_id)
    limit = get_message_limit(room_id)

    # 🔄 Load existing history
    if os.path.exists(path):
        with open(path, "r") as f:
            try:
                existing = json.load(f)
            except json.JSONDecodeError:
                existing = []
    else:
        existing = []

    # 🧹 Merge + trim
    combined = existing + messages
    trimmed = combined[-limit:]

    with open(path, "w") as f:
        json.dump(trimmed, f, indent=2)

    return jsonify({ "status": "saved", "count": len(trimmed) })

@history_bp.route("/load/<room>", methods=["GET"])
def load_room_history(room):
    file_path = get_file_path(room.lower())

    if not os.path.exists(file_path):
        return jsonify([])  # No history yet

    try:
        with open(file_path, "r") as f:
            messages = json.load(f)
        return jsonify(messages)
    except Exception as e:
        print("🔥 Error loading history:", str(e))
        return jsonify([]), 500

@history_bp.route("/delete/<room>", methods=["DELETE"])
def delete_room_history(room):
    file_path = get_file_path(room.lower())
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({ "status": "deleted", "room": room }), 200
        else:
            return jsonify({ "status": "not found", "room": room }), 404
    except Exception as e:
        print("🔥 Error deleting history:", str(e))
        return jsonify({ "error": str(e) }), 500

@history_bp.route("/edit/<room>/<message_id>", methods=["PUT"])
def edit_message(room, message_id):
    data = request.get_json()
    new_content = data.get("content", "").strip()

    file_path = get_file_path(room)
    if not os.path.exists(file_path):
        return jsonify({"error": "Room not found"}), 404

    try:
        with open(file_path, "r") as f:
            messages = json.load(f)

        for msg in messages:
            if str(msg.get("id")) == message_id:
                msg["content"] = new_content
                msg["edited"] = True
                break

        with open(file_path, "w") as f:
            json.dump(messages, f, indent=2)

        return jsonify({"status": "edited", "id": message_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@history_bp.route("/delete/<room>/<message_id>", methods=["DELETE"])
def delete_message(room, message_id):
    file_path = get_file_path(room)
    if not os.path.exists(file_path):
        return jsonify({"error": "Room not found"}), 404

    try:
        with open(file_path, "r") as f:
            messages = json.load(f)

        filtered = [m for m in messages if str(m.get("id")) != message_id]

        with open(file_path, "w") as f:
            json.dump(filtered, f, indent=2)

        return jsonify({"status": "deleted", "id": message_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@history_bp.route("/prioritize/<room>/<message_id>", methods=["POST"])
def prioritize_message(room, message_id):
    file_path = get_file_path(room)
    if not os.path.exists(file_path):
        return jsonify({"error": "Room not found"}), 404

    try:
        with open(file_path, "r") as f:
            messages = json.load(f)

        updated = None
        for msg in messages:
            if str(msg.get("id")) == message_id:
                msg["priority"] = not msg.get("priority", False)
                updated = msg
                break

        if not updated:
            return jsonify({"error": "Message not found"}), 404

        with open(file_path, "w") as f:
            json.dump(messages, f, indent=2)

        return jsonify({"status": "toggled", "id": message_id, "priority": updated["priority"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

