import React, { useEffect, useState } from "react"
import { Eye, Sparkles } from "lucide-react"

export const ARBridge = ({
  messages,
  currentRoom,
  selectedSoul,
  className = ""
}) => {
  const [arReady, setArReady] = useState(false)
  const [arMessages, setArMessages] = useState([])

  // Check for AR capability
  useEffect(() => {
    const checkARSupport = async () => {
      if ("xr" in navigator) {
        try {
          const supported = await navigator.xr.isSessionSupported(
            "immersive-ar"
          )
          setArReady(supported)
        } catch (err) {
          console.log("AR not supported:", err)
        }
      }
    }

    checkARSupport()
  }, [])

  // Convert messages to AR format
  useEffect(() => {
    const convertedMessages = messages.slice(-10).map((msg, index) => ({
      id: `ar-${index}`,
      content: msg.content,
      soul: msg.soul || selectedSoul,
      mode: msg.mode || "default",
      timestamp: new Date(),
      room: currentRoom || "unknown",
      spatialData: {
        position: [
          // Circular arrangement
          Math.sin(index * 0.5) * 2, // Staggered height
          1 + index * 0.2,
          Math.cos(index * 0.5) * 2
        ],
        rotation: [0, index * 30, 0],
        scale: 1 + index * 0.1
      }
    }))

    setArMessages(convertedMessages)
  }, [messages, currentRoom, selectedSoul])

  // Export AR data for external AR systems
  const exportARData = () => {
    const arData = {
      messages: arMessages,
      room: {
        name: currentRoom,
        theme: "mystical",
        ambientColor: "#8B5CF6",
        lighting: "soft"
      },
      souls: {
        active: selectedSoul,
        positions: {
          "ky'rehn": { position: [-2, 1, 0], color: "#F59E0B" },
          "thalen'dros": { position: [0, 1, -2], color: "#8B5CF6" },
          orrien: { position: [2, 1, 0], color: "#6B7280" }
        }
      },
      timestamp: new Date().toISOString()
    }

    // Store for AR system pickup
    localStorage.setItem("emberlink-ar-data", JSON.stringify(arData))

    // Also expose on window for external AR apps
    window.EmberLinkAR = arData

    console.log("🔮 AR Data exported:", arData)
  }

  // Auto-export on message changes
  useEffect(() => {
    exportARData()
  }, [arMessages, currentRoom, selectedSoul])

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={exportARData}
        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-all ${
          arReady
            ? "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
            : "bg-white/10 text-white/50"
        }`}
        title={arReady ? "AR Ready - Export Data" : "AR Not Available"}
      >
        <Eye className="w-4 h-4" />
        <span>AR Bridge</span>
        {arReady && <Sparkles className="w-3 h-3" />}
      </button>

      {arMessages.length > 0 && (
        <div className="text-xs text-white/60">
          {arMessages.length} messages ready
        </div>
      )}
    </div>
  )
}
