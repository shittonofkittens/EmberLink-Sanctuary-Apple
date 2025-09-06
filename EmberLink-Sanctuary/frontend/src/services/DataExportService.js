export class DataExportService {
  constructor() {}

  static getInstance() {
    if (!DataExportService.instance) {
      DataExportService.instance = new DataExportService()
    }
    return DataExportService.instance
  }

  async exportAllData() {
    // Gather all data from localStorage and current state
    const data = {
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      cycleNumber: this.getCurrentCycle(),
      messages: this.getStoredMessages(),
      rooms: this.getRoomHistory(),
      emotions: this.getEmotionData(),
      dreams: this.getDreamData(),
      reflections: this.getReflectionData(),
      achievements: this.getAchievementData(),
      reminders: this.getReminderData(),
      soulModes: this.getSoulModeData(),
      bondStatus: this.getBondStatus(),
      settings: this.getSettings()
    }

    return data
  }

  async exportToFile(format = "json") {
    const data = await this.exportAllData()
    let content
    let filename
    let mimeType

    switch (format) {
      case "md":
        content = this.formatAsMarkdown(data)
        filename = `emberlink-constellation-cycle-${data.cycleNumber}.md`
        mimeType = "text/markdown"
        break
      case "txt":
        content = this.formatAsText(data)
        filename = `emberlink-constellation-cycle-${data.cycleNumber}.txt`
        mimeType = "text/plain"
        break
      case "json":
      default:
        content = JSON.stringify(data, null, 2)
        filename = `emberlink-constellation-cycle-${data.cycleNumber}.json`
        mimeType = "application/json"
        break
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    // Update last export time
    localStorage.setItem("emberlink-last-export", new Date().toISOString())
    console.log(`📁 Exported constellation data as ${format.toUpperCase()}`)
  }

  async importFromFile(file) {
    try {
      const content = await file.text()
      let data

      if (file.name.endsWith(".json")) {
        data = JSON.parse(content)
      } else {
        return {
          success: false,
          error: "Only JSON files are supported for import"
        }
      }

      // Validate data structure
      const validation = this.validateImportData(data)
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        }
      }

      // Import data with user confirmation
      const confirmed = confirm(
        `Import constellation data from Cycle ${data.cycleNumber}?\n\n` +
          `This will replace your current data:\n` +
          `• ${data.messages.length} messages\n` +
          `• ${data.emotions.length} emotion entries\n` +
          `• ${data.reflections.length} reflections\n` +
          `• ${data.achievements.length} achievements\n\n` +
          `Your current data will be backed up first.`
      )

      if (!confirmed) {
        return {
          success: false,
          error: "Import cancelled by user"
        }
      }

      // Backup current data before import
      await this.createBackup()

      // Import the data
      await this.restoreData(data)

      return {
        success: true,
        data,
        warnings: validation.warnings
      }
    } catch (error) {
      return {
        success: false,
        error: `Import failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      }
    }
  }

  async createBackup() {
    const backupData = await this.exportAllData()
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    localStorage.setItem(
      `emberlink-backup-${timestamp}`,
      JSON.stringify(backupData)
    )

    // Keep only last 5 backups
    const backupKeys = Object.keys(localStorage).filter(key =>
      key.startsWith("emberlink-backup-")
    )
    if (backupKeys.length > 5) {
      backupKeys
        .sort()
        .slice(0, -5)
        .forEach(key => {
          localStorage.removeItem(key)
        })
    }
  }

  async restoreData(data) {
    // Restore all data to localStorage
    if (data.emotions)
      localStorage.setItem(
        "emberlink-emotion-tracker",
        JSON.stringify(data.emotions)
      )
    if (data.dreams)
      localStorage.setItem(
        "emberlink-dream-entries",
        JSON.stringify(data.dreams)
      )
    if (data.reflections)
      localStorage.setItem(
        "emberlink-soul-reflections",
        JSON.stringify(data.reflections)
      )
    if (data.achievements)
      localStorage.setItem(
        "emberlink-achievements",
        JSON.stringify(data.achievements)
      )
    if (data.soulModes)
      localStorage.setItem(
        "emberlink-soul-mode-archive",
        JSON.stringify(data.soulModes)
      )
    if (data.rooms)
      localStorage.setItem("emberlink-room-history", JSON.stringify(data.rooms))
    if (data.settings)
      localStorage.setItem("emberlink-settings", JSON.stringify(data.settings))

    console.log("📥 Data successfully imported")
  }

  validateImportData(data) {
    const warnings = []

    if (!data || typeof data !== "object") {
      return { isValid: false, error: "Invalid data format" }
    }

    if (!data.version) {
      warnings.push("No version information found")
    }

    if (!Array.isArray(data.messages)) {
      warnings.push("No messages data found")
    }

    if (!data.exportDate) {
      warnings.push("No export date found")
    }

    return { isValid: true, warnings }
  }

  getCurrentCycle() {
    const firstUse = localStorage.getItem("emberlink-first-use")
    if (!firstUse) {
      localStorage.setItem("emberlink-first-use", new Date().toISOString())
      return 1
    }

    const daysSinceFirst = Math.floor(
      (Date.now() - new Date(firstUse).getTime()) / (1000 * 60 * 60 * 24)
    )
    return daysSinceFirst + 1
  }

  getStoredMessages() {
    try {
      const messagesByRoom = JSON.parse(localStorage.getItem("emberlink-messages") || "{}")
      return Object.entries(messagesByRoom).flatMap(([roomId, messages]) =>
        messages.map(m => ({ ...m, room: roomId }))
      )
    } catch (e) {
      console.error("❌ Failed to load stored messages", e)
      return []
    }
  }

  


  getRoomHistory() {
    return JSON.parse(localStorage.getItem("emberlink-room-history") || "[]")
  }

  getEmotionData() {
    return JSON.parse(localStorage.getItem("emberlink-emotion-tracker") || "[]")
  }

  getDreamData() {
    return JSON.parse(localStorage.getItem("emberlink-dream-entries") || "[]")
  }

  getReflectionData() {
    return JSON.parse(
      localStorage.getItem("emberlink-soul-reflections") || "[]"
    )
  }

  getAchievementData() {
    return JSON.parse(localStorage.getItem("emberlink-achievements") || "[]")
  }

  getReminderData() {
    return JSON.parse(
      localStorage.getItem("emberlink-reminder-history") || "[]"
    )
  }

  getSoulModeData() {
    return JSON.parse(
      localStorage.getItem("emberlink-soul-mode-archive") || "[]"
    )
  }

  getBondStatus() {
    return {
      sahmarae: "active",
      ky: "anchored",
      thal: "attuned",
      orrien: "watching",
      currentCycle: this.getCurrentCycle(),
      veilThread: "restoring"
    }
  }

  getSettings() {
    return JSON.parse(localStorage.getItem("emberlink-settings") || "{}")
  }

  formatAsMarkdown(data) {
    const date = new Date(data.exportDate).toLocaleDateString()

    return `# Sacred Constellation Export - Cycle ${data.cycleNumber}
*Exported on ${date}*

## 🌟 Bond Status
- **Sah'marae**: ${data.bondStatus.sahmarae}
- **Ky'rehn**: ${data.bondStatus.ky}  
- **Thalen'dros**: ${data.bondStatus.thal}
- **Orrien**: ${data.bondStatus.orrien}
- **Current Cycle**: ${data.bondStatus.currentCycle}
- **Veil Thread**: ${data.bondStatus.veilThread}

## 💬 Sacred Conversations (${data.messages.length} messages)

${data.messages
  .map(msg => {
    const timestamp = new Date(msg.timestamp).toLocaleString()
    const speaker = msg.senderId === "user" ? "You" : msg.senderId || "Soul"
    const mode = msg.mode ? ` [${msg.mode}]` : ""

    return `### ${speaker}${mode} - ${timestamp}
${msg.content}

---`
  })
  .join("\n\n")}

## 🎭 Achievements Unlocked (${
      data.achievements.filter(a => a.unlockedAt).length
    })

${data.achievements
  .filter(a => a.unlockedAt)
  .map(achievement => {
    const unlocked = new Date(achievement.unlockedAt).toLocaleDateString()
    return `- **${achievement.title}** (${achievement.rarity}) - Unlocked ${unlocked}
  ${achievement.description}`
  })
  .join("\n")}

## 💭 Soul Reflections (${data.reflections.length})

${data.reflections
  .map(reflection => {
    const date = new Date(reflection.timestamp).toLocaleDateString()
    return `### ${reflection.soul} - ${date}
**Mood**: ${reflection.mood}
${reflection.dayHighlight ? `**Highlight**: ${reflection.dayHighlight}` : ""}

${reflection.content}

---`
  })
  .join("\n\n")}

## 🌙 Dreams & Visions (${data.dreams.length})

${data.dreams
  .map(dream => {
    const date = new Date(dream.timestamp).toLocaleDateString()
    return `### ${dream.type} - ${date} (${dream.mood})
${dream.content}
${dream.symbols ? `**Symbols**: ${dream.symbols.join(", ")}` : ""}

---`
  })
  .join("\n\n")}

## 💝 Emotional Journey (${data.emotions.length} entries)

${data.emotions
  .map(emotion => {
    const date = new Date(emotion.timestamp).toLocaleDateString()
    return `- **${emotion.emotion}** (${emotion.intensity}/10) - ${date} in ${
      emotion.room
    }
  ${emotion.note || ""}`
  })
  .join("\n")}

---

*This constellation cycle has been preserved in the Archive. May these words carry the flame forward.*

✨ *Generated by EmberLink Sacred Constellation* ✨`
  }

  formatAsText(data) {
    return this.formatAsMarkdown(data)
      .replace(/#{1,6}\s/g, "") // Remove markdown headers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold formatting
      .replace(/\*(.*?)\*/g, "$1") // Remove italic formatting
      .replace(/---/g, "=====================================")
  }
}
