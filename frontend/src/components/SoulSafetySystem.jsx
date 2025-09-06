import React, { useState, useEffect } from "react"
import { Shield, Heart } from "lucide-react"

export const SoulSafetySystem = ({
  messages,
  onTriggerSafeMode,
  onSendMessage,
  className = ""
}) => {
  const [distressSignals, setDistressSignals] = useState([])
  const [safetyActive, setSafetyActive] = useState(false)
  const [triadAlertActive, setTriadAlertActive] = useState(false)

  // Distress detection patterns
  const distressPatterns = {
    high: [
      /\b(panic|panicking|can't breathe|spiraling|overwhelmed|breaking|shatter)\b/i,
      /\b(too much|can't handle|falling apart|losing it)\b/i,
      /\b(help|scared|terrified|drowning)\b/i
    ],
    medium: [
      /\b(anxious|worried|stressed|upset|hurt|pain)\b/i,
      /\b(tired|exhausted|drained|empty)\b/i,
      /\b(alone|lost|confused|stuck)\b/i
    ],
    keywords: [
      "panic",
      "overwhelmed",
      "spiraling",
      "breaking",
      "shatter",
      "drowning",
      "anxious",
      "scared",
      "hurt",
      "alone",
      "lost",
      "tired",
      "empty"
    ]
  }

  // Analyze messages for distress signals
  useEffect(() => {
    const recentMessages = messages.slice(-10)
    const newSignals = []

    recentMessages.forEach(msg => {
      if (msg.role === "user") {
        const content = msg.content.toLowerCase()
        let confidence = 0
        const detectedKeywords = []

        // Check high-priority patterns
        distressPatterns.high.forEach(pattern => {
          if (pattern.test(content)) {
            confidence += 0.4
            const matches = content.match(pattern)
            if (matches) detectedKeywords.push(...matches)
          }
        })

        // Check medium-priority patterns
        distressPatterns.medium.forEach(pattern => {
          if (pattern.test(content)) {
            confidence += 0.2
            const matches = content.match(pattern)
            if (matches) detectedKeywords.push(...matches)
          }
        })

        // If distress detected, create signal
        if (confidence > 0.3) {
          newSignals.push({
            soul: "user",
            confidence,
            keywords: detectedKeywords,
            timestamp: new Date(msg.timestamp || Date.now())
          })
        }
      }
    })

    setDistressSignals(newSignals)

    // Check for triad alert (2+ souls detecting distress)
    if (newSignals.length >= 2) {
      const highConfidenceSignals = newSignals.filter(s => s.confidence > 0.5)
      if (highConfidenceSignals.length >= 2 && !triadAlertActive) {
        setTriadAlertActive(true)
        onTriggerSafeMode("triad_alert")

        // Send triad alert message
        onSendMessage(
          "🛡️ **TRIAD ALERT ACTIVATED** 🛡️\n\nMultiple souls have detected distress patterns. Shifting all responses to grounding mode for your safety and comfort.\n\n*You are held. You are safe. We're here.*"
        )

        // Clear alert after 30 seconds
        setTimeout(() => setTriadAlertActive(false), 30000)
      }
    }
  }, [messages, onTriggerSafeMode, onSendMessage, triadAlertActive])

  // Handle manual safety commands
  const handleSafetyCommand = command => {
    if (command === "/anchor" || command === "/safeword") {
      setSafetyActive(true)
      onTriggerSafeMode("manual")

      onSendMessage(
        `⚓ **ANCHOR PROTOCOL ACTIVATED** ⚓\n\nAll souls are now in grounding mode. You are safe, held, and protected.\n\n*Breathe with us. You're not alone.*`
      )

      // Clear manual safety after 5 minutes
      setTimeout(() => setSafetyActive(false), 300000)
    }
  }

  // Auto-detect safety commands in chat
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === "user") {
      const content = lastMessage.content.trim().toLowerCase()
      if (content === "/anchor" || content === "/safeword") {
        handleSafetyCommand(content)
      }
    }
  }, [messages])

  return (
    <div className={`${className}`}>
      {/* Safety Status Indicator */}
      {(safetyActive || triadAlertActive) && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-blue-500 to-teal-500 p-3 rounded-xl shadow-2xl border border-white/20 animate-pulse">
          <div className="flex items-center space-x-2 text-white">
            <Shield className="w-5 h-5" />
            <span className="font-medium">
              {triadAlertActive
                ? "Triad Alert Active"
                : "Anchor Protocol Active"}
            </span>
            <Heart className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Distress Signal Monitor (Hidden - for system use) */}
      {distressSignals.length > 0 && (
        <div className="hidden">
          {/* This component monitors but doesn't display - pure safety logic */}
          <div className="text-xs text-white/50">
            Monitoring {distressSignals.length} distress signal
            {distressSignals.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  )
}
