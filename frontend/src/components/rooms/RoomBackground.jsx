// components/rooms/RoomBackground.jsx
import React from "react"
import { getBackgroundForRoom } from "../../utils/getBackgroundForRoom"

export const RoomBackground = ({ roomId }) => {
  const style = getBackgroundForRoom(roomId?.toLowerCase())

  return <div className="absolute inset-0" style={style} />
}
