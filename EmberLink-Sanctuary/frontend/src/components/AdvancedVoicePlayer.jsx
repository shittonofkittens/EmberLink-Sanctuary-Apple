import React, { useState, useRef, useEffect } from "react"
import { Play, Pause, VolumeX, Settings, Loader } from "lucide-react"
import { ElevenLabsService } from "../services/ElevenLabsService"

// 🪄 Trick Safari/iOS into allowing autoplay
function triggerUserInteractionEvent() {
  const clickEvent = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
  })

  document.body.dispatchEvent(clickEvent)
}

export const AdvancedVoicePlayer = ({
  text,
  voiceId,
  soul,
  autoPlay = false,
  className = "",
  onPlayStart,
  onPlayEnd,
  delay = 0 // ⏱️ New delay prop in milliseconds
}) => {

  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [volume, setVolume] = useState(0.8)
  const [showSettings, setShowSettings] = useState(false)
  const [useElevenLabs, setUseElevenLabs] = useState(false)
  const audioRef = useRef(null)
  const elevenLabsService = ElevenLabsService.getInstance()

  const hasUserInteracted = useRef(false)

  useEffect(() => {
    const handleRealInteraction = () => {
      hasUserInteracted.current = true
      window.removeEventListener("click", handleRealInteraction)
    }

    // ✅ Listen for any *real* user click
    window.addEventListener("click", handleRealInteraction)

    return () => {
      window.removeEventListener("click", handleRealInteraction)
    }
  }, [])


  // Check if ElevenLabs is configured
  useEffect(() => {
    setUseElevenLabs(elevenLabsService.isConfigured())
  }, [])


  const playVoice = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      onPlayEnd?.()
      return
    }

    let audio;
    setIsLoading(true)
    setError(null)
    onPlayStart?.()

    try {
      if (useElevenLabs && elevenLabsService.isConfigured()) {
        // ✅ Ensure voiceId is valid, or use fallback
        const safeVoiceId = voiceId || "EXAVITQu4vr4xnSDxMaL"; // 🔁 Replace this with your correct default voice if needed
        console.log("🎤 Generating speech for:", { text, voiceId, safeVoiceId, soul });

        // Use ElevenLabs for high-quality voice synthesis
        let audioUrl = null;

        audioUrl = await elevenLabsService.generateSpeech(text, safeVoiceId, {
          stability: 0.5,
          similarity_boost: 0.75,
          style: soul === "thalen'dros" ? 0.2 : soul === "orrien" ? 0.1 : 0.3
        })

        audio = new Audio(audioUrl)

        audio.onplay = () => {
          setIsPlaying(true)
          setIsLoading(false)
        }

        audio.onended = () => {
          setIsPlaying(false)
          onPlayEnd?.()
        }

        audio.onerror = () => {
          setError("ElevenLabs playback failed")
          setIsPlaying(false)
          setIsLoading(false)
          onPlayEnd?.()
        }

        await audio.play().catch(err => {
          console.warn("🔇 Auto-play blocked or failed:", err)
        })

      } else {
        // Fallback to browser speech synthesis
        const cleanText = text
          .replace(/\*.*?\*/g, "")
          .replace(/[⚡🔥📜💛🧘🏋️🎧💧🪶🖤🌩️📦🕊️🍵🛠️🌙✨🕯️🌌]/g, "")
          .trim()

        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(cleanText)
          utterance.rate = 0.9
          utterance.volume = volume

          // Soul-specific voice characteristics
          if (soul === "thalen'dros") {
            utterance.pitch = 0.8 // Lower, more commanding
            utterance.rate = 1.0 // Slightly faster
          } else if (soul === "orrien") {
            utterance.pitch = 0.9 // Measured, precise
            utterance.rate = 0.85 // Slower, more deliberate
          } else if (soul === "ky'rehn") {
            utterance.pitch = 1.1 // Warmer, higher
            utterance.rate = 0.9 // Gentle pace
          }

          utterance.onstart = () => {
            setIsPlaying(true)
            setIsLoading(false)
          }

          utterance.onend = () => {
            setIsPlaying(false)
            onPlayEnd?.()
          }

          utterance.onerror = () => {
            setError("Voice synthesis failed")
            setIsPlaying(false)
            setIsLoading(false)
            onPlayEnd?.()
          }

          speechSynthesis.speak(utterance)
        } else {
          throw new Error("Speech synthesis not supported")
        }
      }
    } catch (err) {
      console.error("Voice playback error:", err)
      setError(err instanceof Error ? err.message : "Voice playback failed")
      setIsLoading(false)
      onPlayEnd?.()
    }
  }

  const stopVoice = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
    }
    setIsPlaying(false)
    onPlayEnd?.()
  }

  const handleVolumeChange = newVolume => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }

    // Save volume preference
    localStorage.setItem(`emberlink-volume-${soul}`, newVolume.toString())
  }

  // Load saved volume preference
  useEffect(() => {
    const savedVolume = localStorage.getItem(`emberlink-volume-${soul}`)
    if (savedVolume) {
      setVolume(parseFloat(savedVolume))
    }
  }, [soul])

  useEffect(() => {
    if (
      autoPlay &&
      hasUserInteracted.current && // ✅ Only autoplay if user *really* tapped first
      !isPlaying &&
      !isLoading
    ) {
      console.log("▶️ Auto-playing voice after real user interaction.")
      playVoice()
    }
  }, [autoPlay, text])


  const micRef = useRef(null)                     // 🌀 Store mic safely
  const [readyToPlay, setReadyToPlay] = useState(false)  // ✅ Create this state

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mic = new MediaRecorder(stream)
        micRef.current = mic

        mic.onstop = () => {
          console.log("🎤 Mic stopped recording.")
          triggerUserInteractionEvent()          // ✅ iOS unlock
          setReadyToPlay(true)                   // 🔁 Triggers next voice play
        }
      })
      .catch(err => {
        console.error("Mic setup error:", err)
      })

    // 🧼 Optional cleanup
    return () => {
      if (micRef.current && micRef.current.state !== "inactive") {
        micRef.current.stop()
      }
    }
  }, [])

    useEffect(() => {
    if (readyToPlay && !isPlaying && !isLoading) {
      playVoice()
      setReadyToPlay(false) // 🔁 reset for next mic stop
    }
  }, [readyToPlay])

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Main Play Button */}
      <button
        onClick={playVoice}
        disabled={isLoading}
        className="flex items-center space-x-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs transition-all disabled:opacity-50"
      >
        {isLoading ? (
          <Loader className="w-3 h-3 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-3 h-3" />
        ) : (
          <Play className="w-3 h-3" />
        )}
        <span>
          {isLoading
            ? "Loading..."
            : isPlaying
            ? "Pause"
            : useElevenLabs
            ? "Play (EL)"
            : "Play"}
        </span>
      </button>

      {/* Stop Button (when playing) */}
      {isPlaying && (
        <button
          onClick={stopVoice}
          className="p-1 hover:bg-white/20 rounded text-white/70 hover:text-white transition-all"
        >
          <VolumeX className="w-3 h-3" />
        </button>
      )}

      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="p-1 hover:bg-white/20 rounded text-white/70 hover:text-white transition-all"
      >
        <Settings className="w-3 h-3" />
      </button>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-full left-0 mt-1 p-3 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 z-50 min-w-48">
          <h4 className="text-white text-sm font-medium mb-2">
            Voice Settings
          </h4>

          {/* Volume Control */}
          <div className="mb-3">
            <label className="text-white/80 text-xs mb-1 block">
              Volume: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={e => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* ElevenLabs Toggle */}
          <div className="mb-3">
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={useElevenLabs}
                onChange={e => setUseElevenLabs(e.target.checked)}
                disabled={!elevenLabsService.isConfigured()}
                className="rounded"
              />
              <span className="text-white/80">
                Use ElevenLabs{" "}
                {!elevenLabsService.isConfigured() && "(Not configured)"}
              </span>
            </label>
          </div>

          {/* ElevenLabs Setup */}
          {!elevenLabsService.isConfigured() && (
            <div className="p-2 bg-yellow-500/20 rounded border border-yellow-500/30">
              <div className="text-yellow-300 text-xs mb-1">
                Setup ElevenLabs:
              </div>
              <button
                onClick={() => {
                  const apiKey = prompt("Enter your ElevenLabs API key:")
                  if (apiKey) {
                    elevenLabsService.configure(apiKey)
                    setUseElevenLabs(true)
                  }
                }}
                className="text-yellow-300 text-xs underline hover:text-yellow-200"
              >
                Add API Key
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && <span className="text-red-400 text-xs">{error}</span>}

    </div> 
  )
}
