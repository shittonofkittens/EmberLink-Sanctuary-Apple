from flask import Flask, request, make_response
from flask_cors import CORS
import os
import logging

# Blueprints
from routes.chat import chat_bp
from routes.recall import recall_bp
from routes.history import history_bp
from routes.tiktok import tiktok_bp

app = Flask(__name__)

# ✅ Allow CORS from local + production frontend
logging.basicConfig(level=logging.INFO)
log = logging.getLogger("werkzeug")
log.setLevel(logging.WARNING)  # only show warnings+errors
CORS(app, supports_credentials=True, resources={r"/api/*": {
    "origins": [
        "http://localhost:5173",
        "https://emberlink-sanctuary.onrender.com",
        "capacitor://localhost",     # 🧠 For iOS/Android PWA
        "http://localhost",          # 🧪 Extra safety for mobile dev
        "null"                       # 🔥 Some mobile browsers report null origin
    ]
}})


# 🛡️ Handle OPTIONS manually to prevent CORS preflight rejection
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response, 200

# 🔍 Debugging: show headers after every request
@app.after_request
def after_request(response):
    origin = request.headers.get("Origin")
    allowed_origins = [
        "http://localhost:5173",
        "http://localhost",
        "https://emberlink-sanctuary.onrender.com",
        "capacitor://localhost",
        "null"
    ]

    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"

   
    return response

# 🧭 Routes
app.register_blueprint(chat_bp, url_prefix="/api/chat")
app.register_blueprint(recall_bp, url_prefix="/api/recall")
app.register_blueprint(tiktok_bp, url_prefix="/api")
app.register_blueprint(history_bp, url_prefix="/api/history")

@app.route("/")
def index():
    return "🌐 EmberLink Backend is running."

@app.route("/.well-known/health")
def health_check():
    return "OK", 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=True, port=port)
