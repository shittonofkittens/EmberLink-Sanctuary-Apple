import React, { useState } from "react"
import {
  Phone,
  Video,
  MoreHorizontal,
  Users,
  Zap,
  Flame,
  Scroll,
  Menu,
} from "lucide-react"
import { personalities } from "../data/personalities"
import Sidebar from "./Sidebar"

const getElementIcon = (element) => {
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

export const ChatHeader = ({
  chat,
  currentRoom,
  selectedSouls,
  soulConfig,
  toggleSoul,
  isVoiceMode,
  setIsVoiceMode,
  isJournalMode,
  setIsJournalMode,
  showEmotionTracker,
  setShowEmotionTracker,
  showConversationMode,
  setShowConversationMode,
  setShowHomeScreen,
  setShowSoulArchive,
  setShowAchievements,
  setShowMemoryChest,
  setShowConstellationMap,
  setShowBondVisualizer,
  setShowSelfAwarenessTools,
  setShowDataImportExport,
  setShowNotificationSettings,
  setShowSleepDreamTracker,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getParticipants = () => {
    if (chat?.isGroup) return personalities
    return personalities.filter((p) => chat?.participants?.includes(p.id))
  }

  const participants = getParticipants()

  return (
      <>
        {/* 🔥 Top header bar (fixed at top) */}
        <div className="fixed top-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 z-50">
          {/* Sidebar toggle button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Chat participants */}
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              {chat?.isGroup ? (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 via-blue-400 to-indigo-400 flex items-center justify-center border-2 border-white/20">
                  <Users className="w-6 h-6 text-white" />
                </div>
              ) : (
                participants.map((participant) => {
                  const ElementIcon = getElementIcon(participant.element)
                  return (
                    <div
                      key={participant.id}
                      className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center text-lg relative"
                      style={{
                        background: `linear-gradient(135deg, ${participant.gradientFrom}, ${participant.gradientTo})`,
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
              <h2 className="font-semibold text-white text-lg">{chat?.name}</h2>
              <div className="flex items-center space-x-3">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center space-x-1"
                  >
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

        {/* Soul selector buttons */}
        <div className="flex items-center space-x-2">
          {Object.entries(soulConfig).map(([soulId, config]) => {
            const isSelected = selectedSouls.has(soulId)
            const Icon = config.icon
            return (
              <button
                key={soulId}
                onClick={() => toggleSoul(soulId)}
                className={
                  "p-2 rounded-full transition-all hover:scale-110 " +
                  (isSelected
                    ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                    : "bg-white/20 text-white/70 hover:bg-white/30")
                }
                style={
                  isSelected
                    ? {
                        boxShadow: `0 0 16px ${config.glowColor}50, 0 0 32px ${config.glowColor}30`
                      }
                    : undefined
                }
                aria-label={config.name}
              >
                <Icon className="w-5 h-5" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Sidebar overlay + panel */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[10000] flex">
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onReturnHome={() => setShowHomeScreen(true)}
            currentRoom={currentRoom}
            selectedSoulsCount={selectedSouls.size}
            isHomeScreen={false}
            isVoiceMode={isVoiceMode}
            onToggleVoiceMode={() => setIsVoiceMode(!isVoiceMode)}
            isJournalMode={isJournalMode}
            onToggleJournalMode={() => setIsJournalMode(!isJournalMode)}
            isEmotionTrackerOpen={showEmotionTracker}
            onToggleEmotionTracker={() =>
              setShowEmotionTracker(!showEmotionTracker)
            }
            isConversationMode={showConversationMode}
            onToggleConversationMode={() =>
              setShowConversationMode(!showConversationMode)
            }
            onOpenSoulArchive={() => setShowSoulArchive(true)}
            onOpenAchievements={() => setShowAchievements(true)}
            onOpenMemoryChest={() => setShowMemoryChest(true)}
            onOpenConstellationMap={() => setShowConstellationMap(true)}
            onOpenBondVisualizer={() => setShowBondVisualizer(true)}
            onOpenSelfAwarenessTools={() => setShowSelfAwarenessTools(true)}
            onOpenDataImportExport={() => setShowDataImportExport(true)}
            onOpenNotificationSettings={() =>
              setShowNotificationSettings(true)
            }
            onOpenSleepDreamTracker={() => setShowSleepDreamTracker(true)}
          />
          {/* Overlay click closes sidebar */}
          <div
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}
    </>
  )
}
