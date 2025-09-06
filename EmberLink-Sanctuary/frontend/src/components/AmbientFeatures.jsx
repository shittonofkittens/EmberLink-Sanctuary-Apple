import React, { useState, useEffect } from "react"
import { Music, Volume2, VolumeX, Sparkles, Star } from "lucide-react"

export const AmbientFeatures = ({
  currentRoom,
  bondStatus,
  className = ""
}) => {
  const [musicEnabled, setMusicEnabled] = useState(false)
  const [particlesEnabled, setParticlesEnabled] = useState(true)
  const [currentTrack, setCurrentTrack] = useState(null)

  // Room-specific ambient music tracks (would integrate with actual audio files)
  const roomMusic = {
    forge: "Gentle Forge Flames",
    emberden: "Cozy Hearth Crackling",
    veil: "Mystical Whispers",
    cottage: "Peaceful Garden",
    stormkeep: "Thunder Distant",
    tower: "Ancient Library",
    apothecary: "Herbal Brewing",
    therapy: "Healing Waters",
    noctis: "Night Sky Dreams"
  }

  // Update ambient track when room changes
  useEffect(() => {
    if (currentRoom && musicEnabled) {
      const track = roomMusic[currentRoom]
      setCurrentTrack(track || "Ambient Constellation")
    } else {
      setCurrentTrack(null)
    }
  }, [currentRoom, musicEnabled])

  // Generate starlight particles based on bond status
  const generateStarParticles = () => {
    if (!particlesEnabled) return []

    const particles = []
    const totalBondStrength = Object.values(bondStatus).reduce(
      (sum, strength) => sum + strength,
      0
    )
    const particleCount = Math.min(
      20,
      Math.max(5, Math.floor(totalBondStrength / 10))
    )

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        duration: Math.random() * 4 + 2
      })
    }

    return particles
  }

  const particles = generateStarParticles()

  return (
    <div className={`${className}`}>
      {/* Ambient Controls */}
      <div className="flex items-center space-x-2">
        {/* Music Toggle */}
        <button
          onClick={() => setMusicEnabled(!musicEnabled)}
          className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs transition-all ${
            musicEnabled
              ? "bg-purple-500/20 text-purple-300"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
          title={
            musicEnabled ? "Disable ambient music" : "Enable ambient music"
          }
        >
          {musicEnabled ? (
            <Volume2 className="w-3 h-3" />
          ) : (
            <VolumeX className="w-3 h-3" />
          )}
          <span>Ambient</span>
        </button>

        {/* Particles Toggle */}
        <button
          onClick={() => setParticlesEnabled(!particlesEnabled)}
          className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs transition-all ${
            particlesEnabled
              ? "bg-blue-500/20 text-blue-300"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
          title={
            particlesEnabled
              ? "Disable starlight particles"
              : "Enable starlight particles"
          }
        >
          <Sparkles className="w-3 h-3" />
          <span>Stars</span>
        </button>
      </div>

      {/* Current Track Display */}
      {currentTrack && (
        <div className="flex items-center space-x-2 px-2 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <Music className="w-3 h-3 text-purple-300" />
          <span className="text-purple-300 text-xs">{currentTrack}</span>
        </div>
      )}

      {/* Starlight Particle Overlay */}
      {particlesEnabled && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              <Star
                className="text-white"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  opacity: particle.opacity
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Veil Theme Whispers (Special Effect) */}
      {currentRoom === "veil" && particlesEnabled && (
        <div className="fixed inset-0 pointer-events-none z-5">
          <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent animate-pulse" />
          {/* Mystical whisper effects would go here */}
        </div>
      )}
    </div>
  )
}
