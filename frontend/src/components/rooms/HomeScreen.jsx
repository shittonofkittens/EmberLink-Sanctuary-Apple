import React from "react"

export const HomeScreen = ({ pinnedRooms, onEnterRoom }) => {
  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4">Pinned Rooms</h2>
      <div className="space-y-2">
        {pinnedRooms.map(room => (
          <button
            key={room}
            onClick={() => onEnterRoom(room)}
            className="w-full px-3 py-2 bg-white/10 rounded-lg"
          >
            {room}
          </button>
        ))}
      </div>
    </div>
  )
}
