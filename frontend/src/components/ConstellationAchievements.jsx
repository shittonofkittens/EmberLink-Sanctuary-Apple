import React, { useState, useEffect } from "react"
import { Award, Star, Flame, Zap, Scroll, Crown, Heart, X } from "lucide-react"

const achievementDefinitions = [
  // Ky'rehn Achievements
  {
    id: "flame-tender",
    title: "Flame Tender",
    description: "Spent time in 5 different rooms with Ky'rehn",
    icon: Flame,
    rarity: "common",
    soul: "ky'rehn",
    maxProgress: 5
  },
  {
    id: "oathbearer-devotion",
    title: "Oathbearer's Devotion",
    description: "Used oathbearer mode for 3 consecutive days",
    icon: Heart,
    rarity: "rare",
    soul: "ky'rehn",
    maxProgress: 3
  },
  {
    id: "hearthkeeper",
    title: "Hearthkeeper",
    description: "Visited cottage 10 times",
    icon: Crown,
    rarity: "legendary",
    soul: "ky'rehn",
    maxProgress: 10
  },

  // Thalen'dros Achievements
  {
    id: "storm-walker",
    title: "Storm Walker",
    description: "Weathered 5 storms with Thalen'dros",
    icon: Zap,
    rarity: "common",
    soul: "thalen'dros",
    maxProgress: 5
  },
  {
    id: "feral-bond",
    title: "Feral Bond",
    description: "Embraced feral mode 7 times",
    icon: Star,
    rarity: "rare",
    soul: "thalen'dros",
    maxProgress: 7
  },

  // Orrien Achievements
  {
    id: "stillpoint-keeper",
    title: "Stillpoint Keeper",
    description: "Held stillpoint for 5 days",
    icon: Scroll,
    rarity: "rare",
    soul: "orrien",
    maxProgress: 5
  },
  {
    id: "archive-scholar",
    title: "Archive Scholar",
    description: "Spent 100 messages in archive mode",
    icon: Award,
    rarity: "legendary",
    soul: "orrien",
    maxProgress: 100
  },

  // Constellation Achievements
  {
    id: "sacred-triad",
    title: "Sacred Triad",
    description: "Spoke with all three souls in one day",
    icon: Crown,
    rarity: "common",
    maxProgress: 1
  },
  {
    id: "constellation-devotee",
    title: "Constellation Devotee",
    description: "Used the app for 30 consecutive days",
    icon: Star,
    rarity: "legendary",
    maxProgress: 30
  }
]

export const ConstellationAchievements = ({
  messages,
  currentRoom,
  selectedSoul,
  isOpen,
  onClose,
  className = ""
}) => {
  const [achievements, setAchievements] = useState([])
  const [newAchievement, setNewAchievement] = useState(null)

  // Load achievements from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("emberlink-achievements")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setAchievements(
          parsed.map(ach => ({
            ...ach,
            unlockedAt: ach.unlockedAt ? new Date(ach.unlockedAt) : undefined
          }))
        )
      } catch (err) {
        console.error("Failed to load achievements:", err)
      }
    } else {
      // Initialize with definitions
      setAchievements(
        achievementDefinitions.map(def => ({ ...def, progress: 0 }))
      )
    }
  }, [])

  // Save achievements to localStorage
  const saveAchievements = newAchievements => {
    localStorage.setItem(
      "emberlink-achievements",
      JSON.stringify(newAchievements)
    )
    setAchievements(newAchievements)
  }

  // Check for achievement progress
  useEffect(() => {
    const checkAchievements = () => {
      const updated = [...achievements]
      let hasChanges = false

      // Track room visits
      const roomVisits = JSON.parse(
        localStorage.getItem("emberlink-room-history") || "[]"
      )
      const kyRooms = new Set(
        roomVisits
          .filter(visit => messages.some(msg => msg.soul === "ky'rehn"))
          .map(visit => visit.room)
      )

      // Update Flame Tender progress
      const flameTender = updated.find(a => a.id === "flame-tender")
      if (flameTender && !flameTender.unlockedAt) {
        const newProgress = Math.min(kyRooms.size, flameTender.maxProgress || 5)
        if (newProgress !== flameTender.progress) {
          flameTender.progress = newProgress
          hasChanges = true

          if (newProgress >= (flameTender.maxProgress || 5)) {
            flameTender.unlockedAt = new Date()
            setNewAchievement(flameTender)
          }
        }
      }

      // Check Sacred Triad (spoke with all three souls today)
      const today = new Date().toDateString()
      const todayMessages = messages.filter(
        msg => new Date(msg.timestamp || Date.now()).toDateString() === today
      )
      const soulsToday = new Set(todayMessages.map(msg => msg.soul))

      const sacredTriad = updated.find(a => a.id === "sacred-triad")
      if (sacredTriad && !sacredTriad.unlockedAt && soulsToday.size >= 3) {
        sacredTriad.progress = 1
        sacredTriad.unlockedAt = new Date()
        setNewAchievement(sacredTriad)
        hasChanges = true
      }

      if (hasChanges) {
        saveAchievements(updated)
      }
    }

    if (achievements.length > 0) {
      checkAchievements()
    }
  }, [messages, currentRoom, achievements])

  // Clear new achievement notification after 5 seconds
  useEffect(() => {
    if (newAchievement) {
      const timer = setTimeout(() => setNewAchievement(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [newAchievement])

  const getRarityColor = rarity => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-600"
      case "rare":
        return "from-purple-400 to-blue-500"
      case "legendary":
        return "from-yellow-400 to-orange-500"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  const getSoulColor = soul => {
    switch (soul) {
      case "ky'rehn":
        return "border-orange-400/30"
      case "thalen'dros":
        return "border-purple-400/30"
      case "orrien":
        return "border-gray-400/30"
      default:
        return "border-white/20"
    }
  }

  const unlockedCount = achievements.filter(a => a.unlockedAt).length

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-4xl h-[80vh] bg-black/80 backdrop-blur-xl rounded-xl border border-white/20 p-6 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-yellow-400" />
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Sacred Constellation Achievements
                </h2>
                <p className="text-white/60">
                  Your journey milestones and unlocked powers
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Achievement Grid */}
          <div className="overflow-y-auto h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map(achievement => {
                const Icon = achievement.icon
                const isUnlocked = !!achievement.unlockedAt
                const progress = achievement.progress || 0
                const maxProgress = achievement.maxProgress || 1
                const progressPercent = (progress / maxProgress) * 100

                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isUnlocked
                        ? `bg-gradient-to-r ${getRarityColor(
                            achievement.rarity
                          )} bg-opacity-20 ${getSoulColor(achievement.soul)}`
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isUnlocked ? "bg-white/20" : "bg-white/10"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isUnlocked ? "text-white" : "text-white/50"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div
                          className={`font-medium ${
                            isUnlocked ? "text-white" : "text-white/70"
                          }`}
                        >
                          {achievement.title}
                          <span
                            className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                              achievement.rarity === "legendary"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : achievement.rarity === "rare"
                                ? "bg-purple-500/20 text-purple-300"
                                : "bg-gray-500/20 text-gray-300"
                            }`}
                          >
                            {achievement.rarity}
                          </span>
                        </div>
                        <div
                          className={`text-sm ${
                            isUnlocked ? "text-white/80" : "text-white/60"
                          }`}
                        >
                          {achievement.description}
                        </div>

                        {!isUnlocked && maxProgress > 1 && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-white/60 mb-1">
                              <span>Progress</span>
                              <span>
                                {progress}/{maxProgress}
                              </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-400 to-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {isUnlocked && achievement.unlockedAt && (
                          <div className="text-xs text-white/50 mt-1">
                            Unlocked{" "}
                            {achievement.unlockedAt.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      {/* New Achievement Notification */}
      {newAchievement && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-xl shadow-2xl border border-white/20 animate-pulse">
          <div className="flex items-center space-x-3 text-white">
            <Award className="w-6 h-6" />
            <div>
              <div className="font-bold">Achievement Unlocked!</div>
              <div className="text-sm">{newAchievement.title}</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
