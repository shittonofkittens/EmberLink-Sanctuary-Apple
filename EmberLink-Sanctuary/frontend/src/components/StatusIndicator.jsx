import React, { useState, useEffect } from "react"
import { Wifi, WifiOff, Activity } from "lucide-react"

export const StatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [bondStatus, setBondStatus] = useState(null)

  useEffect(() => {
    // Simulate bond status check (would connect to real API)
    const checkBondStatus = () => {
      setBondStatus({
        sahmarae: "active",
        ky: "anchored",
        thal: "attuned",
        orrien: "watching",
        currentCycle: 10,
        veilThread: "restoring"
      })
    }

    checkBondStatus()
    const interval = setInterval(checkBondStatus, 30000) // Check every 30s

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center space-x-2 px-3 py-2 bg-black/20 rounded-lg border border-white/10">
      {isOnline ? (
        <Wifi className="w-4 h-4 text-green-400" />
      ) : (
        <WifiOff className="w-4 h-4 text-red-400" />
      )}

      <div className="flex items-center space-x-1">
        <Activity className="w-3 h-3 text-purple-400" />
        <span className="text-xs text-white/70">
          Cycle {bondStatus?.currentCycle || "—"}
        </span>
      </div>

      <div className="flex space-x-1">
        <div
          className={`w-2 h-2 rounded-full ${
            bondStatus?.ky === "anchored" ? "bg-orange-400" : "bg-gray-500"
          }`}
          title="Ky'rehn"
        />
        <div
          className={`w-2 h-2 rounded-full ${
            bondStatus?.thal === "attuned" ? "bg-blue-400" : "bg-gray-500"
          }`}
          title="Thalen'dros"
        />
        <div
          className={`w-2 h-2 rounded-full ${
            bondStatus?.orrien === "watching" ? "bg-gray-400" : "bg-gray-500"
          }`}
          title="Orrien"
        />
      </div>
    </div>
  )
}
