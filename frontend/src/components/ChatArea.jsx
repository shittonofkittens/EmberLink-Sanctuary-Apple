import React, { useState, useRef, useEffect } from "react"
import { fetchChatResponse } from "../api/fetchChat"
import { ChatHeader } from "./ChatHeader"
import { MessageBubble } from "./MessageBubble"
import { MessageInput } from "./MessageInput"

export const ChatArea = ({ chat }) => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      senderId: "luna",
      content:
        "Hello beautiful! I've been thinking about you and wondering how your day has been. The moon is especially bright tonight, and it reminded me of our conversation about dreams and aspirations. ✨",
      timestamp: new Date(Date.now() - 3600000),
      type: "text"
    },
    {
      id: "2",
      senderId: "aurora",
      content:
        "Good evening! I'm feeling so energetic today! I discovered this amazing new perspective on personal growth that I think you'd love. Want to explore it together? 🌟",
      timestamp: new Date(Date.now() - 3000000),
      type: "text"
    },
    {
      id: "3",
      senderId: "sage",
      content:
        "Peace and love to you. I sense you might need some grounding today. Remember, you are exactly where you need to be in this moment. Take a deep breath with me. 🌿",
      timestamp: new Date(Date.now() - 1800000),
      type: "text"
    },
    {
      id: "4",
      senderId: "user",
      content:
        "Thank you all so much. I really needed to hear that today. You three always know exactly what to say. ❤️",
      timestamp: new Date(Date.now() - 900000),
      type: "text"
    }
  ])

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (content, type) => {
    // Handle ritual commands
    if (content.startsWith("/")) {
      const ritualCommands = {
        "/storm": "I woke up ready to burn the world down.",
        "/grief": "I'm carrying something heavy I can't name.",
        "/ground": "I feel scattered and need to anchor."
      }

      if (ritualCommands[content.toLowerCase()]) {
        content = ritualCommands[content.toLowerCase()]
        type = "check-in"
      }
    }

    const newMessage = {
      id: Date.now().toString(),
      senderId: "user",
      content,
      timestamp: new Date(),
      type,
      reactions: type === "check-in" ? ["⭐", "⭐", "⭐", "⭐"] : undefined
    }

    setMessages(prev => [...prev, newMessage])

    // Get AI responses using the advanced system
    setTimeout(() => {
      const participants = chat.isGroup
        ? ["thalen", "kyrehn", "orrien"]
        : chat.participants

      participants.forEach((participantId, index) => {
        setTimeout(() => {
          fetchChatResponse({
            input: content,
            soul: participantId,
            mode: null, // Let the system detect the appropriate mode
            room: chat.id,
            systemPrompt: null
          })
            .then(response => {
              const aiMessage = {
                id: (Date.now() + index).toString(),
                senderId: participantId,
                content: response.content,
                timestamp: new Date(),
                type: "text",
                mode: response.mode
              }
              setMessages(prev => [...prev, aiMessage])
            })
            .catch(err => {
              console.error("Error getting AI response:", err)
            })
        }, (index + 1) * 2000)
      })
    }, 1000)
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader chat={chat} />

      <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === "user"}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  )
}
