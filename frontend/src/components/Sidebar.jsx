// @ts-nocheck
import React from "react"
import { createPortal } from "react-dom"
import {
  X,
  Home,
  Phone,
  BookOpen,
  Heart,
  Map,
  Archive,
  Award,
  Moon,
  Star,
  Volume2,
  MessageCircle,
  Brain
} from "lucide-react"

const Sidebar = props => {
  const {
    open,
    onClose,
    onReturnHome,
    currentRoom,
    selectedSoulsCount,
    isHomeScreen,
    isVoiceMode,
    onToggleVoiceMode,
    isJournalMode,
    onToggleJournalMode,
    isEmotionTrackerOpen,
    onToggleEmotionTracker,
    isConversationMode,
    onToggleConversationMode,
    onOpenSoulArchive,
    onOpenAchievements,
    onOpenMemoryChest,
    onOpenConstellationMap,
    onOpenBondVisualizer,
    onOpenSelfAwarenessTools,
    onOpenDataImportExport,
    onOpenNotificationSettings,
    onOpenSleepDreamTracker
  } = props

  // SSR guard
  if (typeof document === "undefined") return null

  return createPortal(
    <>
      {/* Overlay BELOW panel */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
            zIndex: 100300
          }}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Panel ABOVE overlay */}
      <aside
        role="dialog"
        aria-modal="true"
        data-testid="sidebar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: 320,
          background: "rgba(0,0,0,0.9)",
          backdropFilter: "blur(10px)",
          borderRight: "1px solid rgba(255,255,255,0.2)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms ease",
          zIndex: 100400,
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">EmberLink</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Return to Home */}
        <div className="p-4 border-b border-white/10">
          <button
            onClick={() => {
              onReturnHome()
              onClose()
            }}
            className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-[#3a0a0a] to-[#5b0e0e] rounded-2xl text-white hover:from-[#4d0c0c] hover:to-[#6e1010] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:transform-none"
          >
            <Home className="w-5 h-5" />
            <span>Return to Home</span>
          </button>
        </div>

        {/* Features */}
        <div className="p-4" style={{ flex: 1, overflowY: "auto" }}>
          <h3 className="text-white/80 text-sm font-medium mb-3 uppercase tracking-wide">
            Features
          </h3>

          <button
            onClick={onToggleVoiceMode}
            className={
              "w-full flex items-center space-x-3 p-3 rounded-lg transition-all " +
              (isVoiceMode
                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white")
            }
          >
            <Phone className="w-5 h-5" />
            <span>Voice Conversation</span>
            {isVoiceMode && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            )}
          </button>

          <button
            onClick={onToggleJournalMode}
            className={
              "mt-2 w-full flex items-center space-x-3 p-3 rounded-lg transition-all " +
              (isJournalMode
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white")
            }
          >
            <BookOpen className="w-5 h-5" />
            <span>Journal Mode</span>
          </button>

          <button
            onClick={onToggleEmotionTracker}
            className={
              "mt-2 w-full flex items-center space-x-3 p-3 rounded-lg transition-all " +
              (isEmotionTrackerOpen
                ? "bg-[#3a0a0a] text-pink-200 border border-[#5e1a1a]"
                : "bg-[#1a0606] text-pink-300 border border-transparent hover:bg-[#2a0a0a] hover:text-pink-200")
            }
          >
            <Heart className="w-5 h-5" />
            <span>Emotion Tracker</span>
          </button>

          {/* Tools */}
          <div className="mt-4 space-y-2">
            <button
              onClick={onOpenSoulArchive}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              <Archive className="w-5 h-5" />
              <span>Soul &amp; Mode Archive</span>
            </button>
            <button
              onClick={onOpenAchievements}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              <Award className="w-5 h-5" />
              <span>Achievements</span>
            </button>
            <button
              onClick={onOpenMemoryChest}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              <Star className="w-5 h-5" />
              <span>Memory Chest</span>
            </button>
            <button
              onClick={onOpenConstellationMap}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              <Map className="w-5 h-5" />
              <span>Constellation Map</span>
            </button>
            <button
              onClick={onOpenBondVisualizer}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              <Heart className="w-5 h-5" />
              <span>Bond Visualizer</span>
            </button>
            <button
              onClick={onToggleConversationMode}
              className={
                "w-full flex items-center space-x-3 p-3 rounded-lg transition-all " +
                (isConversationMode
                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white")
              }
            >
              <MessageCircle className="w-5 h-5" />
              <span>Conversation Mode</span>
            </button>
            <button
              onClick={onOpenSelfAwarenessTools}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              <Brain className="w-5 h-5" />
              <span>Self-Awareness Tools</span>
            </button>
            <button
              onClick={onOpenDataImportExport}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              <Archive className="w-5 h-5" />
              <span>Import/Export Data</span>
            </button>
            <button
              onClick={onOpenNotificationSettings}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              <Volume2 className="w-5 h-5" />
              <span>Notifications &amp; Voice</span>
            </button>
            <button
              onClick={onOpenSleepDreamTracker}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              <Moon className="w-5 h-5" />
              <span>Dream Journal</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        {!isHomeScreen && (
          <div className="p-4 border-t border-white/10">
            <div className="text-white/60 text-xs mb-1">Current Room</div>
            <div className="text-white font-medium capitalize">
              {currentRoom}
            </div>
            <div className="text-white/50 text-xs mt-1">
              {selectedSoulsCount} soul{selectedSoulsCount !== 1 ? "s" : ""}{" "}
              selected
            </div>
          </div>
        )}
      </aside>
    </>,
    document.body
  )
}

export default Sidebar
