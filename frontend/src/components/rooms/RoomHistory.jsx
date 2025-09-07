import React from "react"

export const RoomHistory = ({ roomId }) => {
  return (
    <div className="p-4 text-sm text-white/50">
      <p>History for room: {roomId}</p>
    </div>
  )
}
