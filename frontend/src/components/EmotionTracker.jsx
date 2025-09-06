import React, { useState, useEffect } from "react"
import { Heart, Flame, Cloud, Sun, Moon, Zap, Droplets } from "lucide-react"

const emotions = [
  {
    key: "joy",
    label: "Joy",
    icon: Sun,
    color: "from-yellow-400 to-orange-400"
  },
  {
    key: "calm",
    label: "Calm",
    icon: Cloud,
    color: "from-blue-400 to-indigo-400"
  },
  {
    key: "love",
    label: "Love",
    icon: Heart,
    color: "from-pink-400 to-red-400"
  },
  {
    key: "energy",
    label: "Energy",
    icon: Zap,
    color: "from-purple-400 to-blue-400"
  },
  {
    key: "sadness",
    label: "Sadness",
    icon: Droplets,
    color: "from-blue-500 to-gray-500"
  },
  {
    key: "anger",
    label: "Anger",
    icon: Flame,
    color: "from-red-500 to-orange-500"
  },
  {
    key: "peace",
    label: "Peace",
    icon: Moon,
    color: "from-indigo-400 to-purple-400"
  }
]

export const EmotionTracker = ({ currentRoom, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [entries, setEntries] = useState([])
  const [selectedEmotion, setSelectedEmotion] = useState(null)
  const [intensity, setIntensity] = useState(5)
  const [note, setNote] = useState("")

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("emberlink-emotion-tracker")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setEntries(
          parsed.map(entry => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          }))
        )
      } catch (err) {
        console.error("Failed to load emotion entries:", err)
      }
    }
  }, [])

  // Save entries to localStorage
  const saveEntries = newEntries => {
    localStorage.setItem(
      "emberlink-emotion-tracker",
      JSON.stringify(newEntries)
    )
    setEntries(newEntries)
  }

  const addEntry = () => {
    if (!selectedEmotion || !currentRoom) return

    const newEntry = {
      id: Date.now().toString(),
      emotion: selectedEmotion,
      intensity,
      timestamp: new Date(),
      room: currentRoom,
      note: note.trim() || undefined
    }

    const updated = [newEntry, ...entries].slice(0, 50) // Keep last 50 entries
    saveEntries(updated)

    // Reset form
    setSelectedEmotion(null)
    setIntensity(5)
    setNote("")
    setIsOpen(false)
  }

  const getTodayEntries = () => {
    const today = new Date().toDateString()
    return entries.filter(entry => entry.timestamp.toDateString() === today)
  }

  const getDominantEmotion = () => {
    const todayEntries = getTodayEntries()
    if (todayEntries.length === 0) return null

    const emotionCounts = {}
    todayEntries.forEach(entry => {
      emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1
    })

    const dominant = Object.entries(emotionCounts).reduce((a, b) =>
      emotionCounts[a[0]] > emotionCounts[b[0]] ? a : b
    )

    return emotions.find(e => e.key === dominant[0])
  }

  const dominantEmotion = getDominantEmotion()
  const todayCount = getTodayEntries().length

  return (
    <div className={className}>
      {/* Compact Tracker Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-black/30 transition-all"
      >
        <div className="flex items-center space-x-1">
          {dominantEmotion ? (
            <div
              className={`w-4 h-4 rounded-full bg-gradient-to-r ${dominantEmotion.color}`}
            />
          ) : (
            <Heart className="w-4 h-4 text-white/60" />
          )}
          <span className="text-white/80 text-sm">
            {dominantEmotion ? dominantEmotion.label : "Track Mood"}
          </span>
        </div>
        {todayCount > 0 && (
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white/70">
            {todayCount}
          </span>
        )}
      </button>

      {/* Expanded Tracker */}
      {isOpen && (
        <div className="mt-2 p-4 bg-black/90 backdrop-blur-xl rounded-xl border border-white/20 z-50 min-w-80">
          <h3 className="text-white font-medium mb-3">How are you feeling?</h3>

          {/* Emotion Selection */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {emotions.map(emotion => {
              const Icon = emotion.icon
              const isSelected = selectedEmotion === emotion.key

              return (
                <button
                  key={emotion.key}
                  onClick={() => setSelectedEmotion(emotion.key)}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                    isSelected
                      ? `bg-gradient-to-r ${emotion.color} text-white shadow-lg`
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs">{emotion.label}</span>
                </button>
              )
            })}
          </div>

          {selectedEmotion && (
            <>
              {/* Intensity Slider */}
              <div className="mb-4">
                <label className="text-white/80 text-sm mb-2 block">
                  Intensity: {intensity}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={e => setIntensity(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Optional Note */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Optional note..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={addEntry}
                className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Track Emotion
              </button>
            </>
          )}

          {/* Today's Summary */}
          {todayCount > 0 && (
            <div className="mt-4 pt-3 border-t border-white/20">
              <div className="text-white/60 text-xs mb-2">
                Today's emotional journey:
              </div>
              <div className="flex space-x-1">
                {getTodayEntries()
                  .slice(0, 8)
                  .map((entry, index) => {
                    const emotion = emotions.find(e => e.key === entry.emotion)
                    return (
                      <div
                        key={entry.id}
                        className={`w-3 h-3 rounded-full bg-gradient-to-r ${emotion?.color ||
                          "from-gray-400 to-gray-500"}`}
                        title={`${emotion?.label} (${
                          entry.intensity
                        }/10) at ${entry.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}`}
                      />
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
