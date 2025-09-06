import React, { useState, useEffect } from "react"
import { Moon, Star, Cloud, X } from "lucide-react"

export const SleepDreamTracker = ({ className = "", isOpen, onClose }) => {
  const [entries, setEntries] = useState([])
  const [currentEntry, setCurrentEntry] = useState("")
  const [entryType, setEntryType] = useState("dream")
  const [entryMood, setEntryMood] = useState("peaceful")
  const [symbols, setSymbols] = useState("")

  // Check for late night hours and show prompt
  useEffect(() => {
    // Auto-prompt functionality removed since this is now sidebar-based
  }, [])

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("emberlink-dream-entries")
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
        console.error("Failed to load dream entries:", err)
      }
    }
  }, [])

  // Save entries to localStorage
  const saveEntries = newEntries => {
    localStorage.setItem("emberlink-dream-entries", JSON.stringify(newEntries))
    setEntries(newEntries)
  }

  const saveEntry = () => {
    if (!currentEntry.trim()) return

    const newEntry = {
      id: Date.now().toString(),
      type: entryType,
      content: currentEntry.trim(),
      timestamp: new Date(),
      mood: entryMood,
      symbols: symbols.trim()
        ? symbols
            .split(",")
            .map(s => s.trim())
            .filter(s => s)
        : undefined
    }

    const updated = [newEntry, ...entries]
    saveEntries(updated)

    // Reset form
    setCurrentEntry("")
    setSymbols("")
  }

  const getTypeIcon = type => {
    switch (type) {
      case "dream":
        return Star
      case "veilwalk":
        return Cloud
      case "sleep_note":
        return Moon
      default:
        return Star
    }
  }

  const getMoodColor = mood => {
    switch (mood) {
      case "peaceful":
        return "from-blue-400 to-indigo-400"
      case "vivid":
        return "from-purple-400 to-pink-400"
      case "strange":
        return "from-green-400 to-teal-400"
      case "powerful":
        return "from-red-400 to-orange-400"
      default:
        return "from-blue-400 to-indigo-400"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-black/90 backdrop-blur-xl rounded-xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Moon className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">
              Dream & Sleep Journal
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-white/70 text-sm mb-4">
          Record your dreams, veilwalks, and sleep experiences.
        </div>

        {/* Entry Type Selection */}
        <div className="flex space-x-2 mb-4">
          {[
            { key: "dream", label: "Dream", icon: Star },
            { key: "veilwalk", label: "Veilwalk", icon: Cloud },
            { key: "sleep_note", label: "Sleep Note", icon: Moon }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setEntryType(key)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-all ${
                entryType === key
                  ? "bg-purple-500/30 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Mood Selection */}
        <div className="mb-4">
          <label className="text-white/80 text-sm mb-2 block">
            Dream Mood:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "peaceful", label: "Peaceful" },
              { key: "vivid", label: "Vivid" },
              { key: "strange", label: "Strange" },
              { key: "powerful", label: "Powerful" }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setEntryMood(key)}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  entryMood === key
                    ? `bg-gradient-to-r ${getMoodColor(key)} text-white`
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Dream Content */}
        <textarea
          value={currentEntry}
          onChange={e => setCurrentEntry(e.target.value)}
          placeholder="Describe your dream, veilwalk, or sleep experience..."
          rows={4}
          className="w-full px-3 py-2 mb-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
        />

        {/* Symbols/Keywords */}
        <input
          type="text"
          placeholder="Symbols or keywords (comma-separated)..."
          value={symbols}
          onChange={e => setSymbols(e.target.value)}
          className="w-full px-3 py-2 mb-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={saveEntry}
            disabled={!currentEntry.trim()}
            className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Save Entry
          </button>
        </div>

        {/* Recent Entries Preview */}
        {entries.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="text-white/60 text-sm mb-2">Recent dreams:</div>
            <div className="space-y-1">
              {entries.slice(0, 3).map(entry => {
                const Icon = getTypeIcon(entry.type)
                return (
                  <div
                    key={entry.id}
                    className="flex items-center space-x-2 text-xs"
                  >
                    <Icon className="w-3 h-3 text-white/50" />
                    <span className="text-white/70">
                      {entry.content.slice(0, 40)}...
                    </span>
                    <span className="text-white/50">
                      {entry.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
