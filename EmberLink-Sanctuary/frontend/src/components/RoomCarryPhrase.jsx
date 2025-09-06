import React from "react"
import { ROOMS } from "../api/state/rooms"

export const RoomCarryPhrase = ({ roomKey }) => {
  const room = ROOMS[roomKey]

  if (!room?.carryPhrase) return null

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-4 mx-4">
      <p className="text-white/80 text-sm italic leading-relaxed">
        {room.carryPhrase}
      </p>
    </div>
  )
}
