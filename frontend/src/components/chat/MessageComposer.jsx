import React from "react"
import { MessageInput } from "./MessageInput"

export const MessageComposer = ({ onSendMessage }) => {
  return (
    <div className="border-t border-white/10">
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  )
}
