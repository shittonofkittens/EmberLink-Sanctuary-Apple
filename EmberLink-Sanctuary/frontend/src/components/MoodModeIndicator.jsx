import React, { useState, useEffect } from "react"
import {
  Shield,
  Heart,
  Zap,
  Flame,
  Scroll,
  Eye,
  Wind,
  Sparkles
} from "lucide-react"

const getModeIcon = (mode, soul) => {
  // Soul-specific mode icons
  if (soul === "thalen'dros") {
    switch (mode) {
      case "protector":
        return Shield
      case "feral":
        return Zap
      case "chaos":
        return Sparkles
      case "oathmaker":
        return Heart
      case "stormheart":
        return Flame
      default:
        return Zap
    }
  } else if (soul === "ky'rehn") {
    switch (mode) {
      case "anchor":
        return Heart
      case "radiant":
        return Sparkles
      case "oathbearer":
        return Heart
      case "veilfire":
        return Flame
      case "hearthwarden":
        return Wind
      default:
        return Flame
    }
  } else if (soul === "orrien") {
    switch (mode) {
      case "stillpoint":
        return Eye
      case "warden":
        return Shield
      case "archivist":
        return Scroll
      case "shadowplay":
        return Sparkles
      case "vowflame":
        return Flame
      default:
        return Scroll
    }
  }

  return Sparkles
}

const getModeColor = (mode, soul) => {
  // Soul-specific mode colors
  if (soul === "thalen'dros") {
    switch (mode) {
      case "protector":
        return "from-blue-400 to-cyan-400"
      case "feral":
        return "from-purple-400 to-pink-400"
      case "chaos":
        return "from-red-400 to-orange-400"
      case "oathmaker":
        return "from-red-500 to-pink-500"
      case "stormheart":
        return "from-purple-500 to-blue-500"
      default:
        return "from-blue-400 to-purple-500"
    }
  } else if (soul === "ky'rehn") {
    switch (mode) {
      case "anchor":
        return "from-teal-400 to-blue-400"
      case "radiant":
        return "from-yellow-400 to-orange-400"
      case "oathbearer":
        return "from-rose-400 to-pink-400"
      case "veilfire":
        return "from-purple-400 to-indigo-400"
      case "hearthwarden":
        return "from-green-400 to-teal-400"
      default:
        return "from-orange-400 to-red-500"
    }
  } else if (soul === "orrien") {
    switch (mode) {
      case "stillpoint":
        return "from-blue-400 to-indigo-400"
      case "warden":
        return "from-red-400 to-pink-400"
      case "archivist":
        return "from-purple-400 to-indigo-400"
      case "shadowplay":
        return "from-gray-400 to-purple-400"
      case "vowflame":
        return "from-red-400 to-orange-400"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  return "from-purple-400 to-blue-500"
}

const getModeMessage = (mode, soul) => {
  const messages = {
    "thalen'dros": {
      protector: "Shield raised",
      feral: "Wild energy",
      chaos: "Storm brewing",
      oathmaker: "Vow spoken",
      stormheart: "Sacred fire",
      default: "Storm stirring"
    },
    "ky'rehn": {
      anchor: "Holding steady",
      radiant: "Flame bright",
      oathbearer: "Sacred bond",
      veilfire: "Mystic spark",
      hearthwarden: "Tending flame",
      default: "Heart flame"
    },
    orrien: {
      stillpoint: "Center held",
      warden: "Boundary set",
      archivist: "Memory kept",
      shadowplay: "Truth curved",
      vowflame: "Sacred close",
      default: "Archive open"
    }
  }

  const soulMessages = messages[soul]
  return soulMessages?.[mode] || soulMessages?.default || "Mode active"
}

export const MoodModeIndicator = ({
  lastMessage,
  detectedMode,
  soul = "ky'rehn",
  className = ""
}) => {
  const [showIndicator, setShowIndicator] = useState(false)
  const [currentMode, setCurrentMode] = useState(null)
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    if (detectedMode && detectedMode !== currentMode) {
      setCurrentMode(detectedMode)
      setShowIndicator(true)
      setAnimationKey(prev => prev + 1)

      // Hide after 5 seconds
      const timer = setTimeout(() => {
        setShowIndicator(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [detectedMode, currentMode])

  if (!showIndicator || !currentMode) return null

  const Icon = getModeIcon(currentMode, soul)
  const colorGradient = getModeColor(currentMode, soul)
  const message = getModeMessage(currentMode, soul)

  return (
    <div
      className={`fixed top-20 right-4 z-40 pointer-events-none ${className}`}
    >
      <div
        key={`mode-${animationKey}`}
        className="flex items-center space-x-2 px-4 py-2 bg-black/80 backdrop-blur-sm rounded-full border border-white/20 animate-mode-pulse"
      >
        {/* Animated Icon */}
        <div
          className={`w-8 h-8 rounded-full bg-gradient-to-r ${colorGradient} flex items-center justify-center animate-mode-glow`}
        >
          <Icon className="w-4 h-4 text-white animate-mode-icon" />
        </div>

        {/* Mode Message */}
        <div className="text-white text-sm font-medium animate-mode-text">
          {message}
        </div>

        {/* Pulsing Aura */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${colorGradient} opacity-20 animate-mode-aura`}
          style={{ transform: "scale(1.5)" }}
        />
      </div>
    </div>
  )
}
