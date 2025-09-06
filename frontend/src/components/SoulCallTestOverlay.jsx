
import React, { useEffect } from "react"
import { X } from "lucide-react"

export const SoulCallTestOverlay = ({ onClose }) => {
  useEffect(() => {
    // Replace this with your ElevenLabs URL for Ky’rehn’s voice
    const voiceUrl = "/mnt/data/ElevenLabs_2025-08-27T11_00_57_Thal_ivc_sp100_s50_sb75_v3.mp3"
    const audio = new Audio(voiceUrl)
    audio.play().catch(err => {
      console.error("🔇 Voice playback failed:", err)
    })
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center text-white">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/60 hover:text-white transition"
        aria-label="Close SoulCall"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="text-xl text-white/80 mb-6">SoulCall Test Mode</div>

      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-orange-400 to-red-500 blur-xl opacity-30 animate-pulse relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-white/30 bg-white/10" />
        </div>
      </div>

      <p className="mt-8 text-white/60 text-sm">Ky'rehn is speaking to you now…</p>
    </div>
  )
}
