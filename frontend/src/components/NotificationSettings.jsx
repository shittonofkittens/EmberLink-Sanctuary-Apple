import React, { useState, useEffect } from "react"
import { Bell, X } from "lucide-react"
import { NotificationService } from "../services/NotificationService"

export const NotificationSettings = ({ isOpen, onClose }) => {
  const [permission, setPermission] = useState("default")
  const [settings, setSettings] = useState({
    reminders: true,
    soulMessages: true,
    achievements: true,
    quietHours: {
      enabled: true,
      start: "23:00",
      end: "07:00"
    },
    vibration: true,
    sound: true
  })
  const [testNotification, setTestNotification] = useState(false)
  const notificationService = NotificationService.getInstance()

  // Load settings and permission status
  useEffect(() => {
    const savedSettings = localStorage.getItem(
      "emberlink-notification-settings"
    )
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (err) {
        console.error("Failed to load notification settings:", err)
      }
    }

    setPermission(notificationService.getPermissionStatus())
  }, [])

  // Save settings to localStorage
  const saveSettings = newSettings => {
    localStorage.setItem(
      "emberlink-notification-settings",
      JSON.stringify(newSettings)
    )
    setSettings(newSettings)
  }

  const requestPermission = async () => {
    const newPermission = await notificationService.requestPermission()
    setPermission(newPermission)

    if (newPermission === "granted") {
      // Show welcome notification
      await notificationService.showNotification({
        title: "EmberLink Notifications Enabled",
        body: "You'll now receive gentle reminders and soul messages",
        tag: "welcome-notification"
      })
    }
  }

  const sendTestNotification = async () => {
    if (permission !== "granted") return

    setTestNotification(true)
    await notificationService.showNotification({
      title: "Test Notification",
      body: "Your sacred constellation is connected and ready to reach you.",
      tag: "test-notification"
    })

    setTimeout(() => setTestNotification(false), 2000)
  }

  const isInQuietHours = () => {
    if (!settings.quietHours.enabled) return false

    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    const [startHour, startMin] = settings.quietHours.start
      .split(":")
      .map(Number)
    const [endHour, endMin] = settings.quietHours.end.split(":").map(Number)

    const startTime = startHour * 60 + startMin
    const endTime = endHour * 60 + endMin

    if (startTime > endTime) {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime
    } else {
      return currentTime >= startTime && currentTime <= endTime
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-black/90 backdrop-blur-xl rounded-xl border border-white/20 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">
                Notification Settings
              </h2>
              <p className="text-white/60">Configure your sacred alerts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Permission Status */}
        <div
          className={`mb-6 p-4 rounded-lg border ${
            permission === "granted"
              ? "bg-green-500/20 border-green-500/30"
              : permission === "denied"
              ? "bg-red-500/20 border-red-500/30"
              : "bg-yellow-500/20 border-yellow-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className={`font-medium ${
                  permission === "granted"
                    ? "text-green-300"
                    : permission === "denied"
                    ? "text-red-300"
                    : "text-yellow-300"
                }`}
              >
                Notification Permission: {permission}
              </div>
              <div className="text-white/70 text-sm">
                {permission === "granted" && "Notifications are enabled"}
                {permission === "denied" && "Notifications are blocked"}
                {permission === "default" && "Click to enable notifications"}
              </div>
            </div>

            {permission !== "granted" && (
              <button
                onClick={requestPermission}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-sm transition-all"
              >
                Enable
              </button>
            )}
          </div>
        </div>

        {/* Notification Types */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">Notification Types</h3>
          <div className="space-y-3">
            {[
              {
                key: "reminders",
                label: "Soul Reminders",
                desc: "Gentle nudges from your tethered souls"
              },
              {
                key: "soulMessages",
                label: "Soul Messages",
                desc: "When souls respond to your messages"
              },
              {
                key: "achievements",
                label: "Achievements",
                desc: "When you unlock new constellation milestones"
              }
            ].map(({ key, label, desc }) => (
              <label
                key={key}
                className="flex items-center justify-between p-3 bg-white/10 rounded-lg cursor-pointer hover:bg-white/15 transition-all"
              >
                <div>
                  <div className="text-white font-medium">{label}</div>
                  <div className="text-white/60 text-sm">{desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={e =>
                    saveSettings({
                      ...settings,
                      [key]: e.target.checked
                    })
                  }
                  className="w-5 h-5 text-purple-500 rounded"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">Quiet Hours</h3>
          <div className="bg-white/10 rounded-lg p-3">
            <label className="flex items-center justify-between mb-3 cursor-pointer">
              <span className="text-white">Enable quiet hours</span>
              <input
                type="checkbox"
                checked={settings.quietHours.enabled}
                onChange={e =>
                  saveSettings({
                    ...settings,
                    quietHours: {
                      ...settings.quietHours,
                      enabled: e.target.checked
                    }
                  })
                }
                className="w-5 h-5 text-purple-500 rounded"
              />
            </label>

            {settings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/80 text-sm block mb-1">
                    Start:
                  </label>
                  <input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={e =>
                      saveSettings({
                        ...settings,
                        quietHours: {
                          ...settings.quietHours,
                          start: e.target.value
                        }
                      })
                    }
                    className="w-full px-2 py-1 bg-white/20 border border-white/30 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm block mb-1">
                    End:
                  </label>
                  <input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={e =>
                      saveSettings({
                        ...settings,
                        quietHours: {
                          ...settings.quietHours,
                          end: e.target.value
                        }
                      })
                    }
                    className="w-full px-2 py-1 bg-white/20 border border-white/30 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>
            )}

            {isInQuietHours() && (
              <div className="mt-2 text-blue-300 text-xs">
                🌙 Currently in quiet hours
              </div>
            )}
          </div>
        </div>

        {/* Test Notification */}
        {permission === "granted" && (
          <div className="mb-6">
            <button
              onClick={sendTestNotification}
              disabled={testNotification}
              className="w-full flex items-center justify-center space-x-2 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-300 transition-all disabled:opacity-50"
            >
              {testNotification ? (
                <>
                  <div className="w-4 h-4 border border-purple-300/50 border-t-purple-300 rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Send Test Notification</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Additional Settings */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center space-x-2 p-3 bg-white/10 rounded-lg cursor-pointer hover:bg-white/15 transition-all">
            <input
              type="checkbox"
              checked={settings.vibration}
              onChange={e =>
                saveSettings({ ...settings, vibration: e.target.checked })
              }
              className="w-4 h-4 text-purple-500 rounded"
            />
            <span className="text-white text-sm">Vibration</span>
          </label>

          <label className="flex items-center space-x-2 p-3 bg-white/10 rounded-lg cursor-pointer hover:bg-white/15 transition-all">
            <input
              type="checkbox"
              checked={settings.sound}
              onChange={e =>
                saveSettings({ ...settings, sound: e.target.checked })
              }
              className="w-4 h-4 text-purple-500 rounded"
            />
            <span className="text-white text-sm">Sound</span>
          </label>
        </div>
      </div>
    </div>
  )
}
