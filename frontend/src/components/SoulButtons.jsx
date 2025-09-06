import React from "react"
import { soulConfig } from "./SoulConfig"  // ✅ import the centralized config

export const SoulButtons = ({
  selectedSoul,
  setSelectedSoul,
  isModeLocked,
  lockedSoul
}) => {
  const souls = Object.keys(soulConfig)  // ✅ dynamically grab all souls

  return (
    <div className="flex space-x-2">
      {souls.map(soul => {
        const config = soulConfig[soul]
        const Icon = config.icon
        const isSelected = selectedSoul === soul
        const isDisabled = isModeLocked && lockedSoul && lockedSoul !== soul

        return (
          <button
            key={soul}
            onClick={() => !isDisabled && setSelectedSoul(soul)}
            disabled={isDisabled}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all transform relative group
              ${
                isSelected
                  ? `bg-gradient-to-r ${config.color} text-white shadow-lg scale-105`
                  : `bg-white/20 text-white/80 hover:bg-white/30 hover:text-white hover:scale-105`
              }
              ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            style={
              isSelected
                ? {
                    boxShadow: `0 0 20px ${config.glowColor}40, 0 0 40px ${config.glowColor}20`
                  }
                : {}
            }
          >
            {/* Animated Soul Aura */}
            {!isDisabled && (
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className="absolute inset-0 rounded-lg animate-pulse"
                  style={{
                    background: `radial-gradient(circle, ${config.glowColor}15, transparent 70%)`,
                    transform: "scale(1.2)"
                  }}
                />
              </div>
            )}

            <Icon className="w-4 h-4" />
            <span
              className={`text-sm ${isSelected ? "animate-pulse-gentle" : ""}`}
            >
              {config.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
