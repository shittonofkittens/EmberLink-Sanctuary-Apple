import React, { useState, useEffect } from "react"
import { BookOpen, Save, X, Calendar } from "lucide-react"

export const JournalMode = ({
  isActive,
  onToggle,
  currentRoom,
  onSendMessage,
  className = ""
}) => {
  const [entries, setEntries] = useState([])
  const [currentEntry, setCurrentEntry] = useState("")
  const [entryTitle, setEntryTitle] = useState("")
  const [showReflections, setShowReflections] = useState(false)

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("emberlink-journal-entries")
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
        console.error("Failed to load journal entries:", err)
      }
    }
  }, [])

  // Save entries to localStorage
  const saveEntries = newEntries => {
    localStorage.setItem(
      "emberlink-journal-entries",
      JSON.stringify(newEntries)
    )
    setEntries(newEntries)
  }

  const saveEntry = () => {
    if (!currentEntry.trim() || !currentRoom) return

    const newEntry = {
      id: Date.now().toString(),
      title: entryTitle.trim() || `Reflection in ${currentRoom}`,
      content: currentEntry.trim(),
      room: currentRoom,
      timestamp: new Date(),
      wordCount: currentEntry.trim().split(/\s+/).length
    }

    const updated = [newEntry, ...entries]
    saveEntries(updated)

    // Send to chat as well
    onSendMessage(
      `📝 **Journal Entry: ${newEntry.title}**\n\n${newEntry.content}`,
      "text"
    )

    // Reset form
    setCurrentEntry("")
    setEntryTitle("")
    onToggle() // Exit journal mode
  }

  const getRoomEntries = () => {
    return currentRoom
      ? entries.filter(entry => entry.room === currentRoom)
      : entries
  }

  const wordCount = currentEntry
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length

  return (
    <div className={className}>
      {!isActive ? (
        /* Journal Mode Toggle Button */
        <button
          onClick={onToggle}
          className="flex items-center space-x-2 px-3 py-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-black/30 transition-all"
        >
          <BookOpen className="w-4 h-4 text-white/70" />
          <span className="text-white/80 text-sm">Journal Mode</span>
        </button>
      ) : (
        /* Active Journal Interface */
        <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-white/20 p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Journal Mode</span>
              <span className="text-white/60 text-sm">• {currentRoom}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowReflections(!showReflections)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
                title="View Past Reflections"
              >
                <Calendar className="w-4 h-4" />
              </button>
              <button
                onClick={onToggle}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Entry Title */}
          <input
            type="text"
            placeholder="Entry title (optional)..."
            value={entryTitle}
            onChange={e => setEntryTitle(e.target.value)}
            className="w-full px-3 py-2 mb-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          {/* Journal Text Area */}
          <textarea
            value={currentEntry}
            onChange={e => setCurrentEntry(e.target.value)}
            placeholder="Pour your thoughts onto the page... Let the words flow like sacred ink."
            rows={8}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none leading-relaxed"
          />

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <div className="text-white/60 text-sm">
              {wordCount} words • {new Date().toLocaleDateString()}
            </div>
            <button
              onClick={saveEntry}
              disabled={!currentEntry.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Reflection</span>
            </button>
          </div>

          {/* Past Reflections */}
          {showReflections && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <h4 className="text-white font-medium mb-3">
                Past Reflections in {currentRoom}
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {getRoomEntries()
                  .slice(0, 5)
                  .map(entry => (
                    <div key={entry.id} className="p-3 bg-white/10 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm font-medium">
                          {entry.title}
                        </span>
                        <span className="text-white/50 text-xs">
                          {entry.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white/70 text-xs line-clamp-2">
                        {entry.content.slice(0, 100)}...
                      </p>
                      <div className="text-white/50 text-xs mt-1">
                        {entry.wordCount} words
                      </div>
                    </div>
                  ))}
                {getRoomEntries().length === 0 && (
                  <p className="text-white/50 text-sm italic">
                    No reflections in this room yet.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
