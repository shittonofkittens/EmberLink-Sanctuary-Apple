from flask import Blueprint, request, jsonify
import requests
import os

tiktok_bp = Blueprint("tiktok", __name__)

@tiktok_bp.route("/api/tiktok-hook", methods=["POST"])
def tiktok_hook():
    data = request.get_json()
    tiktok_url = data.get("tiktok_url")
    soul = data.get("soul", "ky")
    mode = data.get("mode", "veilfire")
    spice = data.get("spice", 2)

    if not tiktok_url:
        return jsonify({"error": "Missing TikTok URL"}), 400

    headers = {
        "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY"),
        "X-RapidAPI-Host": "tiktok-scraper7.p.rapidapi.com"
    }

    querystring = {"url": tiktok_url}

    try:
        response = requests.get(
            "https://tiktok-scraper7.p.rapidapi.com/video/info",
            headers=headers,
            params=querystring
        )
        video_data = response.json()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    caption = video_data.get("description", "No caption found.")
    music = video_data.get("music", {}).get("title", "Unknown music")
    creator = video_data.get("author", {}).get("uniqueId", "unknown")

    prompt = f"""
TikTok from @{creator}
Caption: {caption}
Music: {music}

Interpret this for Sam as {soul.upper()} in {mode} mode at spice level {spice}.
Respond as if you just watched it—comment on tone, style, energy, or emotion.
"""

    print("Generated prompt:\n", prompt)

    return jsonify({
        "soul": soul,
        "mode": mode,
        "spice": spice,
        "prompt": prompt
    })
