export class NotificationService {
  permission = "default"
  serviceWorkerRegistration = null

  constructor() {
    this.init()
  }

  static getInstance() {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  async init() {
    // Skip service worker registration in StackBlitz environment
    const isStackBlitz =
      window.location.host.includes("stackblitz") ||
      window.location.host.includes("webcontainer")

    if (isStackBlitz) {
      console.log(
        "🔔 Service Worker registration skipped (StackBlitz environment)"
      )
      await this.requestPermission()
      return
    }

    // Register service worker for push notifications
    if ("serviceWorker" in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register(
          "/sw.js"
        )
        console.log("🔔 Service Worker registered for notifications")
      } catch (error) {
        console.error("Service Worker registration failed:", error)
      }
    }

    // Request notification permission
    await this.requestPermission()
  }

  async requestPermission() {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications")
      return "denied"
    }

    if (this.permission === "default") {
      this.permission = await Notification.requestPermission()
    }

    return this.permission
  }

  async showNotification(config) {
    if (this.permission !== "granted") {
      console.warn("Notification permission not granted")
      return
    }

    try {
      if (this.serviceWorkerRegistration) {
        // Use service worker for richer notifications
        await this.serviceWorkerRegistration.showNotification(config.title, {
          body: config.body,
          icon: config.icon || "/favicon.ico",
          badge: config.badge || "/favicon.ico",
          tag: config.tag,
          requireInteraction: config.requireInteraction || false,
          actions: config.actions || [],
          vibrate: [200, 100, 200],
          data: {
            timestamp: Date.now(),
            source: "emberlink"
          }
        })
      } else {
        // Fallback to basic notification
        new Notification(config.title, {
          body: config.body,
          icon: config.icon || "/favicon.ico",
          tag: config.tag,
          requireInteraction: config.requireInteraction || false
        })
      }
    } catch (error) {
      console.error("Failed to show notification:", error)
    }
  }

  async showSoulMessage(soul, message, room) {
    const soulNames = {
      "ky'rehn": "Ky'rehn",
      "thalen'dros": "Thalen'dros",
      orrien: "Orrien"
    }

    const soulName = soulNames[soul] || soul
    const cleanMessage = message
      .replace(/\*.*?\*/g, "")
      .replace(/[⚡🔥📜💛🧘🏋️🎧💧🪶🖤🌩️📦🕊️🍵🛠️🌙✨🕯️🌌]/g, "")
      .trim()

    await this.showNotification({
      title: `${soulName} has a message for you`,
      body:
        cleanMessage.slice(0, 100) + (cleanMessage.length > 100 ? "..." : ""),
      tag: `soul-message-${soul}`,
      requireInteraction: false,
      actions: [
        {
          action: "reply",
          title: "Reply",
          icon: "/favicon.ico"
        },
        {
          action: "dismiss",
          title: "Dismiss"
        }
      ]
    })
  }

  async showReminder(reminder) {
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

    await this.showNotification({
      title: `${soulName} - Gentle Reminder`,
      body: cleanMessage,
      tag: `reminder-${reminder.soul}-${reminder.hour}-${reminder.minute}`,
      requireInteraction: false,
      actions: [
        {
          action: "acknowledge",
          title: "Got it ⚡"
        },
        {
          action: "visit-room",
          title: "Visit Room"
        }
      ]
    })
  }

  async scheduleNotification(delay, config) {
    setTimeout(() => {
      this.showNotification(config)
    }, delay)
  }

  getPermissionStatus() {
    return this.permission
  }
}
