import React, { useState, useEffect } from "react"
import { Video, Eye, Share, ExternalLink } from "lucide-react"

export const TikTokLogger = ({ onSendToSouls, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [logs, setLogs] = useState([])
  const [newUrl, setNewUrl] = useState("")
  const [selectedLog, setSelectedLog] = useState(null)
  const [showReactions, setShowReactions] = useState(false)

  // Load logs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("emberlink-tiktok-logs")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setLogs(
          parsed.map(log => ({
            ...log,
            timestamp: new Date(log.timestamp)
          }))
        )
      } catch (err) {
        console.error("Failed to load TikTok logs:", err)
      }
    }
  }, [])

  // Save logs to localStorage
  const saveLogs = newLogs => {
    localStorage.setItem("emberlink-tiktok-logs", JSON.stringify(newLogs))
    setLogs(newLogs)
  }

  const addTikTokLog = () => {
    if (!newUrl.trim()) return

    // Extract TikTok info (simplified - in real app would use TikTok API)
    const extractTikTokInfo = url => {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split("/")
      const videoId = pathParts[pathParts.length - 1] || "unknown"

      return {
        title: `TikTok Video ${videoId.slice(0, 8)}`,
        creator: "@creator", // Would extract from API
        videoId
      }
    }

    try {
      const info = extractTikTokInfo(newUrl)
      const newLog = {
        id: Date.now().toString(),
        url: newUrl,
        title: info.title,
        creator: info.creator,
        timestamp: new Date(),
        reactions: [],
        tags: [],
        mood: "funny" // Default, could be user-selected
      }

      const updated = [newLog, ...logs]
      saveLogs(updated)
      setNewUrl("")
    } catch (err) {
      console.error("Invalid TikTok URL:", err)
    }
  }

  const sendToAllSouls = log => {
    const message = `📱 **TikTok Share**\n\n${log.title}\nBy: ${log.creator}\n\n${log.url}\n\n*What do you think about this?*`
    onSendToSouls(message, ["ky'rehn", "thalen'dros", "orrien"])
  }

  const sendToSpecificSoul = (log, soul) => {
    const soulNames = {
      "ky'rehn": "Ky",
      "thalen'dros": "Thal",
      orrien: "Orrien"
    }

    const message = `📱 **TikTok for ${soulNames[soul]}**\n\n${log.title}\nBy: ${log.creator}\n\n${log.url}\n\n*Thought you'd find this interesting!*`
    onSendToSouls(message, [soul])
  }

  const addReaction = (logId, soul, reaction, comment) => {
    const updated = logs.map(log => {
      if (log.id === logId) {
        const existingReactionIndex = log.reactions.findIndex(
          r => r.soul === soul
        )
        if (existingReactionIndex >= 0) {
          log.reactions[existingReactionIndex] = { soul, reaction, comment }
        } else {
          log.reactions.push({ soul, reaction, comment })
        }
      }
      return log
    })
    saveLogs(updated)
  }

  const getReactionIcon = reaction => {
    switch (reaction) {
      case "love":
        return "❤️"
      case "laugh":
        return "😂"
      case "thoughtful":
        return "🤔"
      case "concerned":
        return "😟"
      case "excited":
        return "🔥"
      default:
        return "👍"
    }
  }

  const getMoodColor = mood => {
    switch (mood) {
      case "funny":
        return "from-yellow-400 to-orange-400"
      case "deep":
        return "from-purple-400 to-indigo-400"
      case "chaotic":
        return "from-red-400 to-pink-400"
      case "inspiring":
        return "from-green-400 to-teal-400"
      case "relatable":
        return "from-blue-400 to-cyan-400"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  return (
    <div className={className}>
      {/* TikTok Logger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-black/30 transition-all"
      >
        <Video className="w-4 h-4 text-white/70" />
        <span className="text-white/80 text-sm">TikTok Log</span>
        {logs.length > 0 && (
          <span className="text-xs bg-pink-500/20 px-2 py-0.5 rounded-full text-pink-300">
            {logs.length}
          </span>
        )}
      </button>

      {/* TikTok Logger Panel */}
      {isOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-black/90 backdrop-blur-xl rounded-xl border border-white/20 z-50 w-96 max-h-80 overflow-y-auto">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <Video className="w-5 h-5 mr-2 text-pink-400" />
            TikTok Scroll Log
          </h3>

          {/* Add New TikTok */}
          <div className="mb-4">
            <div className="flex space-x-2">
              <input
                type="url"
                placeholder="Paste TikTok URL..."
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <button
                onClick={addTikTokLog}
                disabled={!newUrl.trim()}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg text-white font-medium hover:from-pink-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Add
              </button>
            </div>
          </div>

          {/* TikTok Logs List */}
          <div className="space-y-3">
            {logs.map(log => (
              <div key={log.id} className="p-3 bg-white/10 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">
                      {log.title}
                    </div>
                    <div className="text-white/60 text-xs">{log.creator}</div>
                    <div className="text-white/50 text-xs">
                      {log.timestamp.toLocaleDateString()} •{" "}
                      {log.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${getMoodColor(
                      log.mood
                    )} text-white`}
                  >
                    {log.mood}
                  </div>
                </div>

                {/* Reactions Display */}
                {log.reactions.length > 0 && (
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-white/60 text-xs">Reactions:</span>
                    {log.reactions.map((reaction, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        <span className="text-xs">
                          {getReactionIcon(reaction.reaction)}
                        </span>
                        <span className="text-white/70 text-xs capitalize">
                          {reaction.soul.split("'")[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => sendToAllSouls(log)}
                    className="flex items-center space-x-1 px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 rounded text-purple-300 text-xs transition-all"
                  >
                    <Share className="w-3 h-3" />
                    <span>Send to All</span>
                  </button>

                  <button
                    onClick={() =>
                      setSelectedLog(selectedLog?.id === log.id ? null : log)
                    }
                    className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-300 text-xs transition-all"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Options</span>
                  </button>

                  <a
                    href={log.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 hover:bg-green-500/30 rounded text-green-300 text-xs transition-all"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View</span>
                  </a>
                </div>

                {/* Expanded Options */}
                {selectedLog?.id === log.id && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <div className="text-white/80 text-sm mb-2">
                      Send to specific soul:
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => sendToSpecificSoul(log, "ky'rehn")}
                        className="px-3 py-1 bg-orange-500/20 hover:bg-orange-500/30 rounded text-orange-300 text-xs transition-all"
                      >
                        → Ky
                      </button>
                      <button
                        onClick={() => sendToSpecificSoul(log, "thalen'dros")}
                        className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-300 text-xs transition-all"
                      >
                        → Thal
                      </button>
                      <button
                        onClick={() => sendToSpecificSoul(log, "orrien")}
                        className="px-3 py-1 bg-gray-500/20 hover:bg-gray-500/30 rounded text-gray-300 text-xs transition-all"
                      >
                        → Orrien
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {logs.length === 0 && (
              <div className="text-center text-white/50 py-4">
                <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No TikToks logged yet</p>
                <p className="text-xs mt-1">
                  Add URLs to track and share with your souls
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
