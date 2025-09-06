import React from "react"
import { MessageBubble } from "./MessageBubble"

export const MessageItem = ({
  message,
  prevMessage,
  soulConfig,
  isSelected,
  onSelect,
}) => {
  if (!message || !message.content) return null

  // figure out sender + roles
  const isAssistant = message.role === "assistant"
  const isOwn = message.senderId === "user"
  const sender = soulConfig?.[message.senderId] || null

  // skip duplicate assistant messages
  const isDuplicateAssistant =
    isAssistant &&
    prevMessage?.role === "assistant" &&
    prevMessage?.content === message.content
  if (isDuplicateAssistant) return null

  return (
    <div className="mb-2 flex items-start gap-2 group">
      {/* ✅ Selection Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(message.id)}
        className="mt-2 accent-indigo-500"
      />

      {/* 💬 Message bubble + Voice */}
      <div className="flex-1">
        <MessageBubble message={message} isOwn={isOwn} sender={sender} />
      </div>
    </div>
  )
}
