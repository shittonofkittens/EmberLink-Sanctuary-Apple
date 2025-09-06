import React, { useState } from "react"
import { Map, Zap, Flame, Scroll, Activity, Eye, EyeOff } from "lucide-react"

export const ConstellationMap = ({ currentRoom, isOpen, onClose }) => {
  const [soulActivities, setSoulActivities] = useState([
    {
      soul: "ky'rehn",
      status: "active",
      lastActive: new Date(),
      roomsVisited: ["cottage", "apothecary", "forge"],
      moodTrack: ["calm", "focused", "calm"]
    },
    {
      soul: "thalen'dros",
      status: "active",
      lastActive: new Date(Date.now() - 1800000), // 30 min ago
      roomsVisited: ["stormkeep", "emberlock", "wildmark"],
      moodTrack: ["energetic", "energetic", "focused"]
    },
    {
      soul: "orrien",
      status: "watching",
      lastActive: new Date(Date.now() - 900000), // 15 min ago
      roomsVisited: ["tower", "archive", "stronghold"],
      moodTrack: ["focused", "focused", "calm"]
    }
  ])

  const [dayStats, setDayStats] = useState({
    totalRooms: 8,
    totalTime: 145, // minutes
    dominantMood: "focused",
    peakActivity: "14:30"
  })

  const getSoulIcon = soul => {
    switch (soul) {
      case "ky'rehn":
        return Flame
      case "thalen'dros":
        return Zap
      case "orrien":
        return Scroll
      default:
        return Activity
    }
  }

  const getSoulColor = soul => {
    switch (soul) {
      case "ky'rehn":
        return "from-orange-400 to-red-500"
      case "thalen'dros":
        return "from-blue-400 to-purple-500"
      case "orrien":
        return "from-gray-400 to-gray-600"
      default:
        return "from-purple-400 to-blue-500"
    }
  }

  const getStatusIcon = status => {
    switch (status) {
      case "active":
        return Activity
      case "resting":
        return EyeOff
      case "watching":
        return Eye
    }
  }

  const getMoodColor = mood => {
    switch (mood) {
      case "calm":
        return "bg-green-400"
      case "energetic":
        return "bg-red-400"
      case "focused":
        return "bg-blue-400"
    }
  }

  const formatRoomName = room => {
    return room
      .split(/(?=[A-Z])/)
      .join(" ")
      .replace(/^\w/, c => c.toUpperCase())
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl h-full max-h-[90vh] bg-black/80 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Map className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
            <div>
              <h2 className="text-lg md:text-2xl font-semibold text-white">
                Daily Constellation Map
              </h2>
              <p className="text-white/60 text-sm md:text-base hidden sm:block">
                Track your sacred journey and soul activities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          {/* Left Panel - Soul Activities */}
          <div className="w-full md:w-80 bg-black/40 border-b md:border-b-0 md:border-r border-white/10 p-4 md:p-6 overflow-y-auto">
            <h3 className="text-base md:text-lg font-semibold text-white mb-4">
              Sacred Constellation Status
            </h3>

            <div className="space-y-3 md:space-y-4">
              {soulActivities.map(activity => {
                const SoulIcon = getSoulIcon(activity.soul)
                const StatusIcon = getStatusIcon(activity.status)
                const gradient = getSoulColor(activity.soul)

                return (
                  <div
                    key={activity.soul}
                    className="bg-white/5 rounded-lg p-3 md:p-4 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center`}
                        >
                          <SoulIcon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </div>
                        <span className="text-white font-medium capitalize text-sm md:text-base">
                          {activity.soul.replace("'", "'")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <StatusIcon className="w-3 h-3 md:w-4 md:h-4 text-white/60" />
                        <span className="text-xs text-white/60 capitalize">
                          {activity.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-white/50 mb-2">
                      Last active:{" "}
                      {activity.lastActive.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>

                    <div className="mb-2">
                      <div className="text-xs text-white/60 mb-1">
                        Recent rooms:
                      </div>
                      <div className="flex flex-wrap gap-1 text-xs">
                        {activity.roomsVisited.slice(-3).map((room, index) => (
                          <span
                            key={index}
                            className="bg-white/10 px-2 py-1 rounded"
                          >
                            {formatRoomName(room)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-white/60 mb-1">
                        Mood track:
                      </div>
                      <div className="flex space-x-1">
                        {activity.moodTrack.map((mood, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${getMoodColor(
                              mood
                            )}`}
                            title={mood}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Panel - Day Overview */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <h3 className="text-base md:text-lg font-semibold text-white mb-4">
              Today's Journey Overview
            </h3>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
              <div className="bg-white/5 rounded-lg p-3 md:p-4 border border-white/10">
                <div className="text-xl md:text-2xl font-bold text-white">
                  {dayStats.totalRooms}
                </div>
                <div className="text-white/60 text-xs md:text-sm">
                  Rooms Visited
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 md:p-4 border border-white/10">
                <div className="text-xl md:text-2xl font-bold text-white">
                  {dayStats.totalTime}m
                </div>
                <div className="text-white/60 text-xs md:text-sm">
                  Total Time
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 md:p-4 border border-white/10">
                <div className="text-xl md:text-2xl font-bold text-white capitalize">
                  {dayStats.dominantMood}
                </div>
                <div className="text-white/60 text-xs md:text-sm">
                  Dominant Mood
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 md:p-4 border border-white/10">
                <div className="text-xl md:text-2xl font-bold text-white">
                  {dayStats.peakActivity}
                </div>
                <div className="text-white/60 text-xs md:text-sm">
                  Peak Activity
                </div>
              </div>
            </div>

            {/* Current Location */}
            {currentRoom && (
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-3 md:p-4 border border-purple-500/30 mb-4 md:mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Map className="w-4 h-4 md:w-5 md:h-5 text-purple-300" />
                  <span className="text-purple-300 font-medium text-sm md:text-base">
                    Current Location
                  </span>
                </div>
                <div className="text-white text-base md:text-lg">
                  {formatRoomName(currentRoom)}
                </div>
                <div className="text-white/60 text-sm">
                  Active since{" "}
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
              </div>
            )}

            {/* Mood Legend */}
            <div className="bg-white/5 rounded-lg p-3 md:p-4 border border-white/10">
              <h4 className="text-white font-medium mb-3 text-sm md:text-base">
                Mood Tracking Legend
              </h4>
              <div className="flex flex-wrap gap-2 md:gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-400" />
                  <span className="text-white/70 text-sm">Calm</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-400" />
                  <span className="text-white/70 text-sm">Energetic</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-400" />
                  <span className="text-white/70 text-sm">Focused</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
