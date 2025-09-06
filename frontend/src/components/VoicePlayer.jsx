import React, { useState, useRef } from "react";
import { Play, Pause, VolumeX } from "lucide-react";

const elevenKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

export const VoicePlayer = ({ text, voiceId, className = "" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  const cleanTextForSpeech = (text) => {
    return text
      .replace(/\*.*?\*/g, "") // remove *actions*
      .replace(/[⚡🔥📜💛🧘🏋️🎧💧🪶🖤🌩️📦🕊️🍵🛠️🌙✨🕯️🌌🜁🥣⚔️🔍📡🔁📓]/g, "") // remove emojis
      .replace(/\s+/g, " ")
      .trim();
  };

  const stopVoice = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const playVoice = async () => {
    if (isPlaying) {
      stopVoice();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cleanText = cleanTextForSpeech(text);

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
        method: "POST",
        headers: {
          "xi-api-key": elevenKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.7,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to fetch voice stream");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplaying = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        setError("Playback failed");
        setIsPlaying(false);
        setIsLoading(false);
      };

      audio.play();

    } catch (err) {
      console.error("🎙️ Voice playback error:", err);
      setError("Voice playback failed");
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={playVoice}
        disabled={isLoading}
        className="flex items-center space-x-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs transition-all disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-3 h-3" />
        ) : (
          <Play className="w-3 h-3" />
        )}
        <span>
          {isLoading ? "Loading..." : isPlaying ? "Pause" : "Play Voice"}
        </span>
      </button>

      {isPlaying && (
        <button
          onClick={stopVoice}
          className="p-1 hover:bg-white/20 rounded text-white/70 hover:text-white transition-all"
        >
          <VolumeX className="w-3 h-3" />
        </button>
      )}

      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
};
