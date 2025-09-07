// hooks/useMessages.js
import { useState, useCallback } from "react"
import { saveMessageToChest, deleteMessageFromBackend, recallMessages } from "../components/chat/MessageActions"
import { formatMessage } from "../utils/messageUtils"

export function useMessages(roomId) {
  const [messages, setMessages] = useState([])

  const sendMessage = useCallback(
    (content, { senderId = "user", type = "text" } = {}) => {
      if (!content?.trim()) return

      const newMsg = formatMessage({
        id: Date.now().toString(),
        senderId,
        content,
        type,
      })

      setMessages(prev => [...prev, newMsg])
      softSave(newMsg)
      return newMsg
    },
    []
  )

  const softSave = useCallback((msg) => {
    // Could later buffer to localStorage before chest persistence
    console.log("💾 Soft saved:", msg)
  }, [])

  const saveToChest = useCallback(async (msg) => {
    try {
      await saveMessageToChest(msg, roomId)
      console.log("📦 Saved to chest:", msg)
    } catch (err) {
      console.error("❌ Failed to save to chest:", err)
    }
  }, [roomId])

  const forgetMessage = useCallback(async (msgId) => {
    try {
      await deleteMessageFromBackend([msgId], roomId)
      setMessages(prev => prev.filter(m => m.id !== msgId))
      console.log("🗑️ Deleted message:", msgId)
    } catch (err) {
      console.error("❌ Failed to delete:", err)
    }
  }, [roomId])

  const recallMessage = useCallback(async (deleteIds) => {
    try {
      const recalled = await recallMessages(deleteIds, roomId)
      if (recalled?.length) {
        setMessages(prev => [...prev, ...recalled.map(formatMessage)])
      }
      return recalled
    } catch (err) {
      console.error("❌ Failed to recall:", err)
    }
  }, [roomId])

  return {
    messages,
    setMessages,
    sendMessage,
    softSave,
    saveToChest,
    forgetMessage,
    recallMessage
  }
}
