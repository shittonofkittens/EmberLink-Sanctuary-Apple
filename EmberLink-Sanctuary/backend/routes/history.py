# routes/history.py
from flask import Blueprint, request, jsonify
import os
import json

history_bp = Blueprint("history", __name__)
MESSAGES_FOLDER = os.path.join(os.path.dirname(__file__), "../messages")
os.makedirs(MESSAGES_FOLDER, exist_ok=True)

def get_file_path(room_id):
    return os.path.join(MESSAGES_FOLDER, f"{room_id}.json")

@history_bp.route("/save", methods=["POST"])
def save_history():
    data = request.get_json()
    room_id = data.get("room")
    messages = data.get("messages", [])

    print("💾 Incoming messages:", data.get("messages"))
    print("📁 Room ID:", room_id)
    print("📚 Type of messages:", type(data.get("messages")))
    
    if not room_id:
        return jsonify({ "error": "Room ID required." }), 400

    path = get_file_path(room_id)
    with open(path, "w") as f:
        json.dump(messages, f, indent=2)

    return jsonify({ "status": "saved", "count": len(messages) })

@history_bp.route("/load/<room>", methods=["GET"])
def load_room_history(room):
    file_path = get_file_path(room)

    if not os.path.exists(file_path):
        return jsonify([])  # Return empty list if no history

    try:
        with open(file_path, "r") as f:
            messages = json.load(f)
        return jsonify(messages)
    except Exception as e:
        print("🔥 Error loading history:", str(e))
        return jsonify([]), 500

