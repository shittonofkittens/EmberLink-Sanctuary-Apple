import React from "react"
import { Heart, Zap, Sparkles } from "lucide-react"

export const RoomMoodToggle = ({
  currentMood,
  onMoodChange,
  className = ""
}) => {
  const moods = [
    {
      key: "cozy",
      label: "Cozy",
      icon: Heart,
      color: "from-orange-400 to-pink-400",
      description: "Warm, intimate, gentle"
    },
    {
      key: "chaotic",
      label: "Chaotic",
      icon: Zap,
      color: "from-purple-400 to-blue-400",
      description: "Wild, energetic, unpredictable"
    },
    {
      key: "sacred",
      label: "Sacred",
      icon: Sparkles,
      color: "from-indigo-400 to-purple-400",
      description: "Reverent, mystical, profound"
    }
  ]

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {moods.map(mood => {
        const Icon = mood.icon
        const isActive = currentMood === mood.key

        return (
          <button
            key={mood.key}
            onClick={() => onMoodChange(mood.key)}
            className={`
              flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105
              ${
                isActive
                  ? `bg-gradient-to-r ${mood.color} text-white shadow-lg`
                  : "bg-white/20 text-white/70 hover:bg-white/30 hover:text-white"
              }
            `}
            title={mood.description}
          >
            <Icon className="w-4 h-4" />
            <span>{mood.label}</span>
          </button>
        )
      })}
    </div>
  )
}
