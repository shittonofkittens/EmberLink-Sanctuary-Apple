// utils/saveMessageToChest.js
export function saveMessageToChest(messages, tag = "manual-save", editingMessage = null) {
  try {
    const key = "emberlink-memory-chest";
    const prev = JSON.parse(localStorage.getItem(key) || "[]");

    let next;
    if (editingMessage) {
      // replace existing
      next = prev.map(entry =>
        entry.id === editingMessage.id
          ? { ...entry, content: editingMessage.content, tag }
          : entry
      );
    } else {
      // append new
      const now = new Date();
      const newItems = messages.map(m => ({
        id: m.id || Date.now().toString(),
        type: m.type || "chat",
        title: m.title || m.content?.slice(0, 30) || "Untitled",
        content: m.content,
        room: m.room || "forge",
        souls: m.souls || [],
        timestamp: now
      }));
      next = [...prev, ...newItems];
    }

    localStorage.setItem(key, JSON.stringify(next));
    console.log("💾 Memory Chest updated:", next);
    return next;
  } catch (e) {
    console.error("🔥 Failed to save to chest:", e);
    return [];
  }
}
