import React, { useRef, useEffect } from "react"
import { MessageBubble } from "./MessageBubble"

export const MessageLog = ({ messages }) => {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
      {messages.map(msg => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isOwn={msg.senderId === "user"}
        />
      ))}
      <div ref={endRef} />
    </div>
  )
}
