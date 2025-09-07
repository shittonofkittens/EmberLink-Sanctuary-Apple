import { useState, useCallback } from "react"

export function useRooms() {
  const [roomId, setRoomId] = useState(null)
  const [pinnedRooms, setPinnedRooms] = useState([])

  const enterRoom = useCallback((id) => {
    setRoomId(id)
  }, [])

  const leaveRoom = useCallback(() => {
    setRoomId(null)
  }, [])

  const togglePinRoom = useCallback((id) => {
    setPinnedRooms(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }, [])

  return {
    roomId,
    pinnedRooms,
    enterRoom,
    leaveRoom,
    togglePinRoom
  }
}
