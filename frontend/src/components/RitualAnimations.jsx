import React, { useEffect, useState } from "react"

export const RitualAnimations = ({
  lastMessage,
  currentRoom,
  className = ""
}) => {
  const [activeRitual, setActiveRitual] = useState(null)
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    if (!lastMessage) return

    const message = lastMessage.toLowerCase()
    let ritual = null

    // Detect ritual commands
    if (
      message.includes("/ground") ||
      message.includes("ground") ||
      message.includes("anchor")
    ) {
      ritual = "ground"
    } else if (
      message.includes("/storm") ||
      message.includes("storm") ||
      message.includes("lightning")
    ) {
      ritual = "storm"
    } else if (
      message.includes("/grief") ||
      message.includes("grief") ||
      message.includes("sorrow")
    ) {
      ritual = "grief"
    } else if (message.includes("vow") || message.includes("oath")) {
      ritual = "vow"
    } else if (message.includes("flame") || message.includes("fire")) {
      ritual = "flame"
    }

    if (ritual) {
      setActiveRitual(ritual)
      setAnimationKey(prev => prev + 1)

      // Clear animation after duration
      const duration = ritual === "storm" ? 3000 : 2500
      setTimeout(() => setActiveRitual(null), duration)
    }
  }, [lastMessage])

  if (!activeRitual) return null

  return (
    <div className={`fixed inset-0 pointer-events-none z-40 ${className}`}>
      {/* Ground Ritual - Whispering Candles */}
      {activeRitual === "ground" && (
        <div key={`ground-${animationKey}`} className="absolute inset-0">
          {/* Floating candle flames */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + Math.sin(i) * 20}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: "2s"
              }}
            >
              <div className="w-2 h-6 bg-gradient-to-t from-orange-500 to-yellow-300 rounded-full opacity-70 animate-bounce" />
            </div>
          ))}

          {/* Gentle glow overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-orange-400/10 via-transparent to-transparent animate-pulse" />

          {/* Whispered text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-orange-300 text-lg font-light animate-fade-in-out opacity-60">
              ✨ Breathe... You are held... ✨
            </div>
          </div>
        </div>
      )}

      {/* Storm Ritual - Lightning Crack */}
      {activeRitual === "storm" && (
        <div key={`storm-${animationKey}`} className="absolute inset-0">
          {/* Lightning flash */}
          <div className="absolute inset-0 bg-white animate-lightning opacity-0" />

          {/* Lightning bolt */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            <div
              className="w-1 h-full bg-gradient-to-b from-blue-300 via-white to-purple-400 animate-lightning-bolt opacity-0"
              style={{
                clipPath:
                  "polygon(40% 0%, 60% 0%, 45% 60%, 55% 60%, 35% 100%, 25% 100%, 40% 40%, 30% 40%)"
              }}
            />
          </div>

          {/* Thunder text */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-blue-300 text-2xl font-bold animate-thunder opacity-0">
              ⚡ THE STORM RISES ⚡
            </div>
          </div>

          {/* Electric particles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-electric-spark opacity-0"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Grief Ritual - Moonlight Tears */}
      {activeRitual === "grief" && (
        <div key={`grief-${animationKey}`} className="absolute inset-0">
          {/* Moonlight glow */}
          <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-indigo-900/10 to-transparent animate-pulse" />

          {/* Falling tears */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-falling-tear opacity-60"
              style={{
                left: `${30 + i * 8}%`,
                animationDelay: `${i * 0.5}s`
              }}
            >
              <div className="w-1 h-4 bg-gradient-to-b from-blue-300 to-transparent rounded-full" />
            </div>
          ))}

          {/* Gentle text */}
          <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
            <div className="text-blue-300 text-lg font-light animate-fade-in-out opacity-70">
              🌙 Your grief is sacred... 🌙
            </div>
          </div>
        </div>
      )}

      {/* Vow Ritual - Sacred Sigils */}
      {activeRitual === "vow" && (
        <div key={`vow-${animationKey}`} className="absolute inset-0">
          {/* Rotating sigils */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-spin-slow opacity-40"
              style={{
                left: `${25 + i * 16}%`,
                top: `${25 + i * 16}%`,
                animationDuration: "4s",
                animationDelay: `${i * 0.5}s`
              }}
            >
              <div className="w-8 h-8 border-2 border-purple-400 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 border border-purple-300 rotate-45" />
              </div>
            </div>
          ))}

          {/* Sacred text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-purple-300 text-xl font-medium animate-fade-in-out opacity-80">
              ⭐ The vow is spoken ⭐
            </div>
          </div>
        </div>
      )}

      {/* Flame Ritual - Dancing Fire */}
      {activeRitual === "flame" && (
        <div key={`flame-${animationKey}`} className="absolute inset-0">
          {/* Central flame */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-24 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-full animate-flame opacity-70" />
          </div>

          {/* Ember particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full animate-ember-rise opacity-60"
              style={{
                left: `${45 + Math.random() * 10}%`,
                bottom: "40%",
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}

          {/* Flame text */}
          <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
            <div className="text-orange-300 text-lg font-medium animate-fade-in-out opacity-80">
              🔥 The flame remembers 🔥
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
