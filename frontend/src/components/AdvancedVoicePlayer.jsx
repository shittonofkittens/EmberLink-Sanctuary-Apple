import React, { useState, useRef, useEffect } from "react"
import { Play, Pause, VolumeX, Settings, Loader } from "lucide-react"
import { ElevenLabsService } from "../services/ElevenLabsService"
import { CoquiService } from "../services/CoquiService"

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
  delay = 0,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [volume, setVolume] = useState(0.8)
  const [showSettings, setShowSettings] = useState(false)

  const [useElevenLabs, setUseElevenLabs] = useState(false)
  const [useCoqui, setUseCoqui] = useState(false)

  const audioRef = useRef(null)
  const elevenLabsService = ElevenLabsService.getInstance()
  const coquiService = CoquiService.getInstance()
  const hasUserInteracted = useRef(false)

  // ✅ Handle first real user interaction
  useEffect(() => {
    const handleRealInteraction = () => {
      hasUserInteracted.current = true
      window.removeEventListener("click", handleRealInteraction)
    }
    window.addEventListener("click", handleRealInteraction)
    return () => window.removeEventListener("click", handleRealInteraction)
  }, [])

  // ✅ Update availability
  useEffect(() => {
    setUseElevenLabs(elevenLabsService.isConfigured())
    setUseCoqui(coquiService.isConfigured())
  }, [])

  const playVoice = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      onPlayEnd?.()
      return
    }

    let audio
    setIsLoading(true)
    setError(null)
    onPlayStart?.()

    try {
      if (useCoqui) {
        console.log("🐸 Using Coqui TTS:", { text, voiceId, soul })
        const audioUrl = await coquiService.generateSpeech(text, voiceId || "default")
        audio = new Audio(audioUrl)

      } else if (useElevenLabs) {
        console.log("🎤 Using ElevenLabs:", { text, voiceId, soul })
        const safeVoiceId = voiceId || "EXAVITQu4vr4xnSDxMaL"
        const audioUrl = await elevenLabsService.generateSpeech(text, safeVoiceId, {
          stability: 0.5,
          similarity_boost: 0.75,
          style: soul === "thalen'dros" ? 0.2 : soul === "orrien" ? 0.1 : 0.3,
        })
        audio = new Audio(audioUrl)

      } else {
        // Browser fallback
        const cleanText = text
          .replace(/\*.*?\*/g, "")
          .replace(/[⚡🔥📜💛🧘🏋️🎧💧🪶🖤🌩️📦🕊️🍵🛠️🌙✨🕯️🌌]/g, "")
          .trim()

        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(cleanText)
          utterance.rate = 0.9
          utterance.volume = volume

          if (soul === "thalen'dros") {
            utterance.pitch = 0.8
            utterance.rate = 1.0
          } else if (soul === "orrien") {
            utterance.pitch = 0.9
            utterance.rate = 0.85
          } else if (soul === "ky'rehn") {
            utterance.pitch = 1.1
            utterance.rate = 0.9
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
          return
        } else {
          throw new Error("Speech synthesis not supported")
        }
      }

      if (audio) {
        audioRef.current = audio
        audio.volume = volume

        audio.onplay = () => {
          setIsPlaying(true)
          setIsLoading(false)
        }
        audio.onended = () => {
          setIsPlaying(false)
          onPlayEnd?.()
        }
        audio.onerror = () => {
          setError("Audio playback failed")
          setIsPlaying(false)
          setIsLoading(false)
          onPlayEnd?.()
        }

        await audio.play().catch((err) => {
          console.warn("🔇 Auto-play blocked or failed:", err)
        })
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

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume)
    if (audioRef.current) audioRef.current.volume = newVolume
    localStorage.setItem(`emberlink-volume-${soul}`, newVolume.toString())
  }

  // Load saved volume
  useEffect(() => {
    const savedVolume = localStorage.getItem(`emberlink-volume-${soul}`)
    if (savedVolume) setVolume(parseFloat(savedVolume))
  }, [soul])

  useEffect(() => {
    if (autoPlay && hasUserInteracted.current && !isPlaying && !isLoading) {
      console.log("▶️ Auto-playing voice after real user interaction.")
      playVoice()
    }
  }, [autoPlay, text])

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
            : useCoqui
            ? "Play (Coqui)"
            : useElevenLabs
            ? "Play (EL)"
            : "Play"}
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

      <button
        onClick={() => setShowSettings(!showSettings)}
        className="p-1 hover:bg-white/20 rounded text-white/70 hover:text-white transition-all"
      >
        <Settings className="w-3 h-3" />
      </button>

      {showSettings && (
        <div className="absolute top-full left-0 mt-1 p-3 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 z-50 min-w-48">
          <h4 className="text-white text-sm font-medium mb-2">Voice Settings</h4>

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
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* ElevenLabs Toggle */}
          <div className="mb-3">
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={useElevenLabs}
                onChange={(e) => setUseElevenLabs(e.target.checked)}
                disabled={!elevenLabsService.isConfigured()}
                className="rounded"
              />
              <span className="text-white/80">
                Use ElevenLabs{" "}
                {!elevenLabsService.isConfigured() && "(Not configured)"}
              </span>
            </label>
          </div>

          {/* Coqui Toggle */}
          <div className="mb-3">
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={useCoqui}
                onChange={(e) => setUseCoqui(e.target.checked)}
                disabled={!coquiService.isConfigured()}
                className="rounded"
              />
              <span className="text-white/80">
                Use Coqui {!coquiService.isConfigured() && "(Not configured)"}
              </span>
            </label>
          </div>
        </div>
      )}

      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  )
}
