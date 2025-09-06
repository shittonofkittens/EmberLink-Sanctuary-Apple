import React from "react"
import {
  Phone,
  Video,
  MoreHorizontal,
  Users,
  Zap,
  Flame,
  Scroll
} from "lucide-react"
import { personalities } from "../data/personalities"

const getElementIcon = element => {
  switch (element) {
    case "storm":
      return Zap
    case "ember":
      return Flame
    case "shadow":
      return Scroll
    default:
      return Users
  }
}

export const ChatHeader = ({ chat }) => {
  const getParticipants = () => {
    if (chat.isGroup) return personalities
    return personalities.filter(p => chat.participants.includes(p.id))
  }

  const participants = getParticipants()

  return (
    <div className="h-20 bg-black/20 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex -space-x-2">
          {chat.isGroup ? (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 via-blue-400 to-indigo-400 flex items-center justify-center border-2 border-white/20">
              <Users className="w-6 h-6 text-white" />
            </div>
          ) : (
            participants.map(participant => {
              const ElementIcon = getElementIcon(participant.element)
              return (
                <div
                  key={participant.id}
                  className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center text-lg relative"
                  style={{
                    background: `linear-gradient(135deg, ${participant.gradientFrom}, ${participant.gradientTo})`
                  }}
                >
                  {participant.avatar}
                  <ElementIcon className="w-3 h-3 absolute -bottom-1 -right-1 text-white bg-black/50 rounded-full p-0.5" />
                </div>
              )
            })
          )}
        </div>
        <div>
          <h2 className="font-semibold text-white text-lg">{chat.name}</h2>
          <div className="flex items-center space-x-3">
            {participants.map((participant, index) => (
              <div key={participant.id} className="flex items-center space-x-1">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    participant.status === "online"
                      ? "bg-green-400"
                      : participant.status === "typing"
                      ? "bg-yellow-400"
                      : "bg-gray-400"
                  }`}
                />
                <span className="text-white/70 text-sm">
                  {participant.status === "typing"
                    ? "weaving words..."
                    : participant.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all">
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all">
          <Video className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
