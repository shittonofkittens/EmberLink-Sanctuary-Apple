// components/ModeButtons.jsx
import React from "react"

const MODES = ["anchor", "oathbearer", "veilfire", "radiant", "hearthwarden", "emberink"]

export const ModeButtons = ({ currentMode, onChange }) => {
  return (
    <div className="flex gap-2 flex-wrap justify-start mb-4">
      {MODES.map(mode => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={`px-3 py-1 text-sm font-medium rounded-md capitalize transition-all ${
            currentMode === mode
              ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow"
              : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
        >
          {mode}
        </button>
      ))}
    </div>
  )
}
