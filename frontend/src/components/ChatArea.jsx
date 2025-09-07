// ChatArea.jsx
import React, { useState, useRef, useEffect } from "react"
import { sendMessageToBackend } from "../api/sendMessageToBackend"
import { API_ENDPOINTS } from "../api/serverConfig"
import { ChatHeader } from "./ChatHeader"
import { MessageBubble } from "./MessageBubble"
import { MessageInput } from "./MessageInput"

export const ChatArea = ({ chat }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  // Scroll helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.historyLoad(chat.id))
        if (!res.ok) throw new Error("Failed to load history")

        const data = await res.json()
        setMessages(data.messages || [])
      } catch (err) {
        console.error("⚠️ Failed to load chat history:", err)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [chat.id])

  // Handle sending user messages
  const handleSendMessage = async (content, type = "text") => {
    if (!content?.trim()) return

    const finalContent = content.trim()

    // Add to local state immediately
    const userMessage = {
      id: Date.now().toString(),
      senderId: "user",
      content: finalContent,
      timestamp: new Date(),
      type
    }
    setMessages(prev => [...prev, userMessage])

    // Send to backend
    try {
      const response = await sendMessageToBackend({
        message: finalContent,
        soul: chat.isGroup ? null : chat.participants[0],
        mode: null,
        room: chat.id
      })

      const aiMessage = {
        id: Date.now().toString() + "-ai",
        senderId: response.soul || "system",
        content: response.reply,
        timestamp: new Date(),
        type: "text",
        mode: response.mode
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      console.error("🛑 Failed to send message:", err)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader chat={chat} />

      <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
        {loading ? (
          <div className="text-center text-white/50">Loading history...</div>
        ) : (
          messages.map(message => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === "user"}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  )
}
