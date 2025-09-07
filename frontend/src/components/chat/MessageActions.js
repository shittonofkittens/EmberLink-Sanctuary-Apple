import { sendMessageToBackend } from "../../api/sendMessageToBackend"

// 📦 Save to chest (local seed file style)
export async function saveMessageToChest(msg, roomId) {
  const date = new Date().toISOString().split("T")[0]
  const isShared = msg.senderId !== "user"
  const filename = isShared ? `shared.${date}.seed.json` : `${msg.senderId}.${date}.seed.json`

  // Stubbed localStorage chest — later we hook to backend
  const chestKey = `chest-${roomId}-${filename}`
  const existing = JSON.parse(localStorage.getItem(chestKey) || "[]")
  existing.push(msg)
  localStorage.setItem(chestKey, JSON.stringify(existing))
}

// 🗑️ Delete
export async function deleteMessageFromBackend(deleteIds, roomId) {
  return sendMessageToBackend({
    message: JSON.stringify(deleteIds),
    soul: "system",
    mode: "delete",
    room: roomId
  })
}

// 🧠 Recall
export async function recallMessages(deleteIds, roomId) {
  return sendMessageToBackend({
    message: JSON.stringify(deleteIds),
    soul: "system",
    mode: "recall",
    room: roomId
  })
}
