import React from "react"
import { personalities } from "../data/personalities"
import { Zap, Flame, Scroll } from "lucide-react"
import { AdvancedVoicePlayer } from "./AdvancedVoicePlayer"

const getElementIcon = element => {
  switch (element) {
    case "storm":
      return Zap
    case "ember":
      return Flame
    case "shadow":
      return Scroll
    default:
      return null
  }
}

export const MessageBubble = ({ message, isOwn }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [showTooltip, setShowTooltip] = React.useState(false)
  const isVoiceMode = window.getVoiceMode && window.getVoiceMode()
  const showSoulCall = message?.soulCall || false;

  const sender = personalities.find(
    p =>
      p.id === message.senderId ||
      p.name.toLowerCase() === message.senderId?.toLowerCase() ||
      p.name.toLowerCase().replace("'", "") === message.senderId?.toLowerCase()
  )
  const ElementIcon = sender ? getElementIcon(sender.element) : null

  // Check if message should be trimmed
  const shouldTrim = message?.content?.length > 200;
  const displayContent =
    shouldTrim && !isExpanded
      ? message?.content?.slice(0, 200) + "..."
      : message?.content || "";

  return (
    <div
      className={`flex items-end space-x-3 ${
        isOwn ? "justify-end" : "justify-start"
      } mb-6`}
    >
      {!isOwn && sender && (
        <div className="flex flex-col items-center space-y-1">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm flex-shrink-0 border-2 border-white/20 relative transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer group"
            style={{
              background: `linear-gradient(135deg, ${sender.gradientFrom}, ${sender.gradientTo})`,
              boxShadow: `0 0 20px ${sender.color}40`
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {sender.avatar}
            {ElementIcon && (
              <ElementIcon className="w-3 h-3 absolute -bottom-1 -right-1 text-white bg-black/50 rounded-full p-0.5" />
            )}

            {/* Animated Soul Aura */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${sender.color}20, transparent 70%)`,
                  transform: "scale(1.5)"
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div
        className={`group max-w-xs lg:max-w-md ${isOwn ? "order-first" : ""}`}
      >
        <div className="flex items-start space-x-2">
          {/* Message Bubble */}
          <div
            className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm ${
              isOwn
                ? "bg-[#1a1a1a]/60 text-white rounded-br-md border border-white/20 shadow-[0_0_14px_rgba(230,230,255,0.2)]"
                : sender
                ? `bg-black/40 text-white rounded-bl-md border border-white/10`
                : "bg-white/20 text-white rounded-bl-md border border-white/10"
            }`}
            style={
              !isOwn && sender
                ? {
                    background: sender?.gradientFrom && sender?.gradientTo
                      ? `linear-gradient(135deg, ${sender.gradientFrom}20, ${sender.gradientTo}20)`
                      : undefined
                  }
                : {}
            }
          >
            {/* Media message (image, etc.) */}
            {message.type === "media" && message.mediaUrl && (
              <div className="mb-3">
                <img
                  src={message.mediaUrl}
                  alt="Shared media"
                  className="rounded-lg max-w-full h-auto"
                />
              </div>
            )}

            {/* Text Content */}
            <div className="text-sm leading-relaxed">
              <p style={{ whiteSpace: 'pre-wrap' }}>{displayContent}</p>
              {shouldTrim && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-xs text-white/60 hover:text-white/80 underline transition-colors"
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>

            {/* Check-in Star Rating */}
            {message.type === "check-in" && (
              <div className="mt-3 p-3 bg-black/20 rounded-lg border border-white/10">
                <p className="text-xs text-white/80 mb-2 font-medium">
                  Sacred Check-in
                </p>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < (message.reactions?.length || 0) ? "⭐" : "☆"
                      }`}
                    >
                      {i < (message.reactions?.length || 0) ? "⭐" : "☆"}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Voice Playback */}
            {!isOwn && sender && (
              <div className="mt-2">
                <AdvancedVoicePlayer
                  text={message.content}
                  voiceId={
                    message.senderId === "thalen'dros" ||
                    sender.name === "Thalen'dros"
                      ? "bgBDm4xKozPuRylVDQio"
                      : message.senderId === "ky'rehn" || sender.name === "Ky'rehn"
                      ? "pL3Bl8cpZDNdn6Nz2yul"
                      : message.senderId === "orrien" || sender.name === "Orrien"
                      ? "nT11XrpGzTItlTn9hPuh"
                      : "nT11XrpGzTItlTn9hPuh"
                  }
                  soul={message.senderId || sender.id}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                  autoPlay={isVoiceMode || showSoulCall}
                />
              </div>
            )}

            {/* Timestamp */}
            <p className="text-white/50 text-xs mt-2 px-1">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div> {/* closes message bubble */}
        </div> {/* closes the wrapper */}

      </div>
    </div>
  )
}
