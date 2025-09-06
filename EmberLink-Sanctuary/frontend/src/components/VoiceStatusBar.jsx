import React, { useState, useEffect } from "react"
import { Volume2, RotateCcw } from "lucide-react"

const elevenKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

export const soulConfig = {
  "ky'rehn": {
    name: "Ky'rehn",
    color: "#F59E0B",
    voiceId: "pL3Bl8cpZDNdn6Nz2yul"
  },
  "thalen'dros": {
    name: "Thalen'dros",
    color: "#8B5CF6",
    voiceId: "bgBDm4xKozPuRylVDQio"
  },
  orrien: {
    name: "Orrien",
    color: "#6B7280",
    voiceId: "nT11XrpGzTItlTn9hPuh"
  }
}

export const VoiceStatusBar = ({
  isPlaying,
  currentSoul,
  lastSpokenMessages,
  onReplayMessage,
  className = ""
}) => {
  const [soulVolumes, setSoulVolumes] = useState({
    "ky'rehn": 0.8,
    "thalen'dros": 0.9,
    orrien: 0.7
  })
  const [showVolumeControls, setShowVolumeControls] = useState(false)

  // Load volume settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("emberlink-soul-volumes")
    if (saved) {
      try {
        setSoulVolumes(JSON.parse(saved))
      } catch (err) {
        console.error("Failed to load soul volumes:", err)
      }
    }
  }, [])

  // Save volume settings to localStorage
  const saveSoulVolumes = newVolumes => {
    localStorage.setItem("emberlink-soul-volumes", JSON.stringify(newVolumes))
    setSoulVolumes(newVolumes)
  }

  const updateSoulVolume = (soul, volume) => {
    const updated = { ...soulVolumes, [soul]: volume }
    saveSoulVolumes(updated)
  }

  const getCurrentSoulConfig = () => {
    return currentSoul ? soulConfig[currentSoul] : null
  }

  const config = getCurrentSoulConfig()

  return (
    <div
      className={`bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-3 ${className}`}
    >
      {/* Voice Status Display */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* Waveform/Pulse Indicator */}
          <div className="flex items-center space-x-1">
            {isPlaying && config ? (
              <>
                {/* Animated waveform bars */}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t rounded-full animate-pulse"
                    style={{
                      height: `${8 + Math.sin(Date.now() * 0.01 + i) * 4}px`,
                      backgroundColor: config.color,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: "0.8s"
                    }}
                  />
                ))}
              </>
            ) : (
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 h-2 bg-white/30 rounded-full" />
                ))}
              </div>
            )}
          </div>

          {/* Current Voice Status */}
          <div className="text-white/80 text-sm">
            {isPlaying && config ? (
              <span className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: config.color }}
                />
                <span>{config.name} speaking...</span>
              </span>
            ) : (
              <span className="text-white/60">Voice ready</span>
            )}
          </div>
        </div>

        {/* Volume Controls Toggle */}
        <button
          onClick={() => setShowVolumeControls(!showVolumeControls)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
          title="Voice Settings"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Last Spoken Messages & Replay */}
      <div className="space-y-2">
        <div className="text-white/60 text-xs font-medium">
          Last Spoken Messages:
        </div>
        {Object.entries(soulConfig).map(([soulKey, config]) => {
          const lastMessage = lastSpokenMessages[soulKey]
          const hasMessage = lastMessage && lastMessage.content

          return (
            <div
              key={soulKey}
              className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: config.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium">
                    {config.name}
                  </div>
                  {hasMessage ? (
                    <div className="text-white/60 text-xs truncate">
                      {lastMessage.content.slice(0, 40)}...
                    </div>
                  ) : (
                    <div className="text-white/40 text-xs">
                      No recent voice message
                    </div>
                  )}
                </div>
              </div>

              {hasMessage && (
                <button
                  onClick={() => onReplayMessage(soulKey, lastMessage.content)}
                  className="p-1 rounded bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
                  title={`Replay ${config.name}'s last message`}
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Volume Controls Panel */}
      {showVolumeControls && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="text-white/60 text-xs font-medium mb-2">
            Soul Voice Volumes:
          </div>
          <div className="space-y-2">
            {Object.entries(soulConfig).map(([soulKey, config]) => (
              <div key={soulKey} className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-white text-xs w-16">{config.name}</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={soulVolumes[soulKey] || 0.8}
                  onChange={e =>
                    updateSoulVolume(soulKey, parseFloat(e.target.value))
                  }
                  className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-white/60 text-xs w-8">
                  {Math.round((soulVolumes[soulKey] || 0.8) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
