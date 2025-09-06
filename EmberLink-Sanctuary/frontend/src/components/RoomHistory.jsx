import React, { useState, useEffect } from "react"
import { MapPin, Clock, ArrowRight } from "lucide-react"

export const RoomHistory = ({ currentRoom, onRoomSelect }) => {
  const [roomHistory, setRoomHistory] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)

  // Load room history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("emberlink-room-history")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setRoomHistory(
          parsed.map(visit => ({
            ...visit,
            timestamp: new Date(visit.timestamp)
          }))
        )
      } catch (err) {
        console.error("Failed to load room history:", err)
      }
    }
  }, [])

  // Track room visits
  useEffect(() => {
    if (currentRoom) {
      const now = new Date()
      const today = now.toDateString()

      setRoomHistory(prev => {
        // Update duration of last visit if it was today
        const updated = [...prev]
        if (updated.length > 0) {
          const lastVisit = updated[0]
          if (
            lastVisit.timestamp.toDateString() === today &&
            lastVisit.room !== currentRoom
          ) {
            lastVisit.duration = Math.floor(
              (now.getTime() - lastVisit.timestamp.getTime()) / 1000 / 60
            ) // minutes
          }
        }

        // Add new visit if it's a different room
        if (updated.length === 0 || updated[0].room !== currentRoom) {
          updated.unshift({
            room: currentRoom,
            timestamp: now
          })
        }

        // Keep only last 10 visits
        const trimmed = updated.slice(0, 10)

        // Save to localStorage
        localStorage.setItem("emberlink-room-history", JSON.stringify(trimmed))

        return trimmed
      })
    }
  }, [currentRoom])

  const formatRoomName = room => {
    return room
      .split(/(?=[A-Z])/)
      .join(" ")
      .replace(/^\w/, c => c.toUpperCase())
  }

  const getRecentPath = () => {
    const today = new Date().toDateString()
    const todayVisits = roomHistory
      .filter(visit => visit.timestamp.toDateString() === today)
      .slice(0, 4)
      .reverse()

    return todayVisits
  }

  const recentPath = getRecentPath()

  if (recentPath.length === 0) return null

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-3 mb-4 mx-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-white/80 hover:text-white transition-colors"
      >
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">Today's Journey</span>
        </div>
        <div className="flex items-center space-x-1 text-xs">
          {recentPath.slice(-3).map((visit, index) => (
            <React.Fragment key={visit.timestamp.getTime()}>
              {index > 0 && <ArrowRight className="w-3 h-3 text-white/40" />}
              <span className="text-white/60">
                {formatRoomName(visit.room)}
              </span>
            </React.Fragment>
          ))}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="space-y-2">
            {roomHistory.slice(0, 8).map((visit, index) => (
              <button
                key={visit.timestamp.getTime()}
                onClick={() => onRoomSelect(visit.room)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-all ${
                  visit.room === currentRoom
                    ? "bg-purple-500/20 text-purple-300"
                    : "hover:bg-white/10 text-white/70 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>{formatRoomName(visit.room)}</span>
                  {index === 0 && visit.room === currentRoom && (
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">
                      Current
                    </span>
                  )}
                </div>
                <div className="text-xs text-white/50">
                  {visit.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                  {visit.duration && (
                    <span className="ml-1">({visit.duration}m)</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
