import React, { useState, useEffect } from "react"
import { X, Clock, Zap, Flame, Scroll } from "lucide-react"
import { allReminders } from "../data/reminders"
import { AdvancedVoicePlayer } from "./AdvancedVoicePlayer";

const getElementIcon = soul => {
  switch (soul) {
    case "thalen'dros":
      return Zap
    case "ky'rehn":
      return Flame
    case "orrien":
      return Scroll
    default:
      return Clock
  }
}

const getSoulGradient = soul => {
  switch (soul) {
    case "thalen'dros":
      return "from-blue-400 to-purple-500"
    case "ky'rehn":
      return "from-orange-400 to-red-500"
    case "orrien":
      return "from-gray-400 to-gray-600"
    default:
      return "from-purple-400 to-blue-500"
  }
}

export const ReminderSystem = () => {
  const [currentReminder, setCurrentReminder] = useState(null)
  const [dismissedReminders, setDismissedReminders] = useState(new Set())
  const [notificationPermission, setNotificationPermission] = useState(
    "default"
  )

  // Request notification permission on component mount
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission()
        setNotificationPermission(permission)
        console.log("🔔 Notification permission:", permission)
      }
    }

    requestNotificationPermission()
  }, [])

  // Function to show browser notification
  const showBrowserNotification = reminder => {
    if (notificationPermission === "granted" && "Notification" in window) {
      const soulNames = {
        "thalen'dros": "Thalen'dros",
        "ky'rehn": "Ky'rehn",
        orrien: "Orrien"
      }

      const soulName = soulNames[reminder.soul] || reminder.soul
      const cleanMessage = reminder.message
        .replace(/\*.*?\*/g, "")
        .replace(/[⚡🔥📜💛🧘🏋️🎧💧🪶🖤🌩️📦🕊️🍵🛠️🌙✨🕯️🌌]/g, "")
        .trim()

      new Notification(`${soulName} has a message for you`, {
        body: cleanMessage,
        icon: "/favicon.ico", // You can add soul-specific icons later
        tag: `reminder-${reminder.soul}-${reminder.hour}-${reminder.minute}`,
        requireInteraction: false,
        silent: false
      })
    }
  }

  useEffect(() => {
    const checkForReminders = () => {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()

      // Find reminders that should show now (within 5 minutes)
      const activeReminder = allReminders.find(reminder => {
        const reminderTime = reminder.hour * 60 + reminder.minute
        const currentTime = currentHour * 60 + currentMinute
        const timeDiff = Math.abs(currentTime - reminderTime)

        // Show reminder if we're within 5 minutes and haven't dismissed it today
        const reminderKey = `${reminder.hour}:${reminder.minute}-${
          reminder.soul
        }-${now.toDateString()}`
        return timeDiff <= 5 && !dismissedReminders.has(reminderKey)
      })

      if (activeReminder && !currentReminder) {
        setCurrentReminder(activeReminder)
        // Show browser notification
        showBrowserNotification(activeReminder)
      }
    }

    // Check immediately
    checkForReminders()

    // Check every minute
    const interval = setInterval(checkForReminders, 60000)

    return () => clearInterval(interval)
  }, [currentReminder, dismissedReminders, notificationPermission])

  const dismissReminder = () => {
    if (currentReminder) {
      const now = new Date()
      const reminderKey = `${currentReminder.hour}:${currentReminder.minute}-${
        currentReminder.soul
      }-${now.toDateString()}`
      setDismissedReminders(prev => new Set([...prev, reminderKey]))
      setCurrentReminder(null)
    }
  }

  if (!currentReminder) return null

  const ElementIcon = getElementIcon(currentReminder.soul)
  const gradient = getSoulGradient(currentReminder.soul)

  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto max-w-md w-full">
        <div
          className={`bg-gradient-to-r ${gradient} p-4 rounded-xl shadow-2xl border border-white/20 backdrop-blur-sm animate-pulse`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <ElementIcon className="w-5 h-5 text-white" />
              <span className="text-white font-medium text-sm">
                {currentReminder.hour.toString().padStart(2, "0")}:
                {currentReminder.minute.toString().padStart(2, "0")}
              </span>
              {notificationPermission === "granted" && (
                <span className="text-white/60 text-xs">🔔</span>
              )}
            </div>
            <button
              onClick={dismissReminder}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-white text-sm leading-relaxed">
            {currentReminder.message.split("\n").map((line, i) => (
              <p key={i} className="mb-1">
                {line}
              </p>
            ))}
          </div>

          {/* Voice Player */}
          {currentReminder.voiceId && (
            <div className="mt-3">
              <AdvancedVoicePlayer
                text={currentReminder.message}
                voiceId={currentReminder.voiceId}
                soul={currentReminder.soul}
              />
            </div>
          )}

          <div className="mt-3 flex justify-end">
            <button
              onClick={dismissReminder}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs transition-all"
            >
              Got it ⚡
            </button>
            {currentReminder.room && (
              <button
                onClick={() => {
                  // Navigate to Whisper Den
                  window.location.hash = `#${currentReminder.room}`
                  dismissReminder()
                }}
                className="ml-2 px-3 py-1 bg-white/30 hover:bg-white/40 rounded-lg text-white text-xs transition-all"
              >
                Visit Whisper Den 🕊️
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
