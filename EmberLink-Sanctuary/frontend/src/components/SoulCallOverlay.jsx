import React, { useState, useEffect, useRef } from "react"
import { X, Mic, Square } from "lucide-react"
import { VoiceInput } from "./VoiceInput"

export const SoulCallOverlay = ({ onClose, onTranscript, currentSoul }) => {
  const [isListening, setIsListening] = useState(false);
  const [loopMode, setLoopMode] = useState(true); // 🔁 New state
  const voiceToggleRef = useRef(null);
  const hasUserInteracted = useRef(false)

  const glowColors = {
    "orrien": "from-slate-500 to-blue-500",
    "thalen'dros": "from-red-500 to-violet-500",
    "ky'rehn": "from-amber-400 to-orange-500"
  };

    const soulGradient = glowColors[currentSoul?.toLowerCase?.()] || "from-purple-500 to-pink-500";

  useEffect(() => {
    window.setListening = (value) => setIsListening(value);
    window.getLoopMode = () => loopMode;

    return () => {
        delete window.setListening;
        delete window.getLoopMode;
    };
  }, [loopMode]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-black via-[#0d0d0d] to-black backdrop-blur-lg text-white flex flex-col items-center justify-center animate-fade">
      {/* ✖️ Exit button */}
      <VoiceInput
        onTranscript={(finalText) => {
            console.log("🎤 Final voice input received:", finalText);
            onTranscript(finalText);
            setIsListening(false);
        }}
        isListening={isListening}
        setIsListening={setIsListening}
        className="scale-0"
        triggerRef={voiceToggleRef}  // ✅ added
      />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/60 hover:text-white transition"
        aria-label="Close SoulCall"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative mb-8">
        {/* 🔥 Soul-colored base glow ring */}
        <div className={`w-48 h-48 rounded-full bg-gradient-to-br ${soulGradient} blur-xl opacity-30 animate-pulse`} />

        {/* 🌙 Silvery-white pulse when you're speaking */}
        {isListening && (
            <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-56 h-56 rounded-full bg-white/10 border border-white/30 animate-soulwave" />
            </div>
        )}

        {/* 💬 Inner mic ring */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center">
            {isListening ? (
                <Square className="w-6 h-6 text-white animate-pulse" />
            ) : (
                <Mic className="w-6 h-6 text-white" />
            )}
            </div>
        </div>
      </div>

      {/* Message */}
     <div className={`text-lg transition-all duration-500 mb-6 ${
        isListening ? "text-white/50" : "text-white/20 italic"
        }`}>
        {isListening ? "Listening…" : "Waiting..."}
     </div>
        
      {/* Toggle Mic Button */}
      <button
        onClick={() => {
          console.log("🎤 [Button Click] Triggering voiceToggleRef");
          if (voiceToggleRef.current) {
            voiceToggleRef.current();
          } else {
            console.warn("❌ voiceToggleRef.current is null!");
          }
        }}
        className={`px-6 py-3 rounded-full transition-all ${
            isListening
            ? "bg-red-500 hover:bg-red-600"
            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        }`}
        >
        {isListening ? "Stop" : "Start Voice Chat"}
      </button>

      {/* iOS Safari Fallback Button */}
      {!hasUserInteracted.current && (
        <button
          onClick={() => {
            hasUserInteracted.current = true
            const clickEvent = new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
              view: window,
            })
            document.body.dispatchEvent(clickEvent)

          }}
          className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
        >
          🔊 Tap to Enable Voice
        </button>
      )}

    </div>
  )
}
