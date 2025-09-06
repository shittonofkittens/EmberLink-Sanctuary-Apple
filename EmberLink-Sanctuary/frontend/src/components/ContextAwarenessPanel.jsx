import React, { useState, useEffect } from "react"
import { Clock, Heart, MessageCircle, Search } from "lucide-react"

export const ContextAwarenessPanel = ({
  messages,
  currentRoom,
  selectedSoul,
  onTriggerCheckIn,
  className = ""
}) => {
  const [lastActivity, setLastActivity] = useState(null)
  const [moodSummary, setMoodSummary] = useState(null)
  const [showSavedLogs, setShowSavedLogs] = useState(false)
  const [savedLogs, setSavedLogs] = useState([])
  const [logFilter, setLogFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Track last activity and trigger check-ins
  useEffect(() => {
    const userMessages = messages.filter(msg => msg.role === "user")
    if (userMessages.length > 0) {
      const lastMsg = userMessages[userMessages.length - 1]
      const lastTime = new Date(lastMsg.timestamp || Date.now())
      setLastActivity(lastTime)
    }

    // Check for 6+ hour silence
    const checkSilentMood = () => {
      if (!lastActivity) return

      const now = new Date()
      const hoursSinceActivity =
        (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60)

      if (hoursSinceActivity >= 6) {
        const lastCheckIn = localStorage.getItem("emberlink-last-checkin")
        const today = now.toDateString()

        if (lastCheckIn !== today) {
          onTriggerCheckIn()
          localStorage.setItem("emberlink-last-checkin", today)
        }
      }
    }

    const interval = setInterval(checkSilentMood, 300000) // Check every 5 minutes
    return () => clearInterval(interval)
  }, [messages, lastActivity, onTriggerCheckIn])

  // Generate mood summary from recent messages
  useEffect(() => {
    const recentMessages = messages.slice(-10)
    const emotions = JSON.parse(
      localStorage.getItem("emberlink-emotion-tracker") || "[]"
    )
    const recentEmotions = emotions.slice(-5)

    if (recentEmotions.length > 0) {
      const emotionCounts = {}
      recentEmotions.forEach(emotion => {
        emotionCounts[emotion.emotion] =
          (emotionCounts[emotion.emotion] || 0) + 1
      })

      const dominant = Object.entries(emotionCounts).reduce((a, b) =>
        emotionCounts[a[0]] > emotionCounts[b[0]] ? a : b
      )[0]

      const recent = recentEmotions.map(e => e.emotion).slice(-3)
      const avgIntensity =
        recentEmotions.reduce((sum, e) => sum + e.intensity, 0) /
        recentEmotions.length

      setMoodSummary({
        dominant,
        recent,
        intensity: Math.round(avgIntensity)
      })
    }
  }, [messages])

  // Load saved logs
  useEffect(() => {
    const logs = JSON.parse(
      localStorage.getItem("emberlink-saved-logs") || "[]"
    )
    setSavedLogs(
      logs.map(log => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }))
    )
  }, [])

  // Handle /view commands
  const handleViewCommand = command => {
    const match = command.match(/^\/view\s+(\d+)?\s*([\w'-]+)?$/)
    if (!match) return null

    const [, countStr, category] = match
    const count = parseInt(countStr, 10) || 5
    const cat = (category || "all").toLowerCase()

    let filteredLogs = savedLogs
    if (currentRoom) {
      filteredLogs = filteredLogs.filter(log => log.room === currentRoom)
    }
    if (cat !== "all") {
      filteredLogs = filteredLogs.filter(log => log.category === cat)
    }

    return filteredLogs.slice(-count)
  }

  // Filter saved logs for UI
  const getFilteredLogs = () => {
    let filtered = savedLogs

    if (currentRoom && logFilter === "room") {
      filtered = filtered.filter(log => log.room === currentRoom)
    } else if (logFilter !== "all") {
      filtered = filtered.filter(
        log => log.soul === logFilter || log.category === logFilter
      )
    }

    if (searchQuery) {
      filtered = filtered.filter(
        log =>
          log.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    )
  }

  const getLastThreeMessages = () => {
    return messages.slice(-3).map(msg => ({
      role: msg.role,
      soul: msg.soul,
      content:
        msg.content.slice(0, 50) + (msg.content.length > 50 ? "..." : ""),
      mode: msg.mode
    }))
  }

  const timeSinceActivity = lastActivity
    ? Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60))
    : null

  return (
    <div
      className={`bg-black/20 backdrop-blur-sm border-t border-white/10 ${className}`}
    >
      {/* Context Awareness Bar */}
      <div className="p-3 flex items-center justify-between text-sm">
        {/* Last 3 Message Echo */}
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-4 h-4 text-white/60" />
          <div className="text-white/70">
            {getLastThreeMessages().map((msg, i) => (
              <span key={i} className="mr-2">
                {msg.role === "user" ? "You" : msg.soul}: {msg.content}
                {i < 2 && " →"}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Mood Summary */}
        {moodSummary && (
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-pink-400" />
            <span className="text-white/70">
              {moodSummary.dominant} ({moodSummary.intensity}/10)
              {moodSummary.recent.length > 1 && (
                <span className="text-white/50 ml-1">
                  ← {moodSummary.recent.slice(-2).join(" → ")}
                </span>
              )}
            </span>
          </div>
        )}

        {/* Activity Status */}
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-white/70">
            {timeSinceActivity !== null
              ? timeSinceActivity < 60
                ? `${timeSinceActivity}m ago`
                : `${Math.floor(timeSinceActivity / 60)}h ago`
              : "No activity"}
          </span>
          {timeSinceActivity && timeSinceActivity > 360 && (
            <span className="text-yellow-400 text-xs">
              Silent mood detected
            </span>
          )}
        </div>

        {/* Saved Logs Toggle */}
        <button
          onClick={() => setShowSavedLogs(!showSavedLogs)}
          className="flex items-center space-x-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-white/80 hover:text-white transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Logs</span>
        </button>
      </div>

      {/* Saved Logs Panel */}
      {showSavedLogs && (
        <div className="border-t border-white/10 p-4 bg-black/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Saved Message Archive</h3>
            <div className="flex items-center space-x-2">
              {/* Search */}
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="px-2 py-1 bg-white/20 border border-white/30 rounded text-white placeholder-white/50 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
              />

              {/* Filter */}
              <select
                value={logFilter}
                onChange={e => setLogFilter(e.target.value)}
                className="px-2 py-1 bg-white/20 border border-white/30 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
              >
                <option value="all">All</option>
                <option value="room">This Room</option>
                <option value="ky'rehn">Ky'rehn</option>
                <option value="thalen'dros">Thalen'dros</option>
                <option value="orrien">Orrien</option>
                <option value="vows">Vows</option>
                <option value="jokes">Jokes</option>
                <option value="insights">Insights</option>
              </select>
            </div>
          </div>

          {/* Command Helper */}
          <div className="mb-3 p-2 bg-purple-500/10 rounded border border-purple-500/20">
            <div className="text-purple-300 text-xs font-medium mb-1">
              Quick Commands:
            </div>
            <div className="text-white/60 text-xs">
              <code>/view logs</code> • <code>/view 5 vows</code> •{" "}
              <code>/view 3 orrien</code>
            </div>
          </div>

          {/* Logs List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {getFilteredLogs()
              .slice(0, 20)
              .map(log => (
                <div
                  key={log.id}
                  className="p-3 bg-white/10 rounded border border-white/10"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium text-sm">
                        {log.soul}
                      </span>
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">
                        {log.category}
                      </span>
                    </div>
                    <div className="text-white/50 text-xs">
                      {log.timestamp.toLocaleDateString()} • {log.room}
                    </div>
                  </div>
                  <div className="text-white/80 text-sm">
                    {log.content.length > 150
                      ? log.content.slice(0, 150) + "..."
                      : log.content}
                  </div>
                </div>
              ))}

            {getFilteredLogs().length === 0 && (
              <div className="text-center text-white/50 py-4">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No saved logs found</p>
                <p className="text-xs mt-1">
                  Use /save commands to create logs
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
