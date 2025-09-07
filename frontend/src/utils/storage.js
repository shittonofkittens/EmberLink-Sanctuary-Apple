// utils/storage.js

// === Memory Chest Utilities ===

// Read logs back out of chest
export const readSavedLogs = () => {
  const chest = JSON.parse(localStorage.getItem("emberlink-memory-chest") || "[]");
  return chest;
};

// Save messages into emberlink-memory-chest
export const saveMessageToChest = (messagesToSave, category = "archive", currentRoom) => {
  if (!messagesToSave || messagesToSave.length === 0) {
    console.warn("⚠️ No messages matched for saving.");
    return null;
  }

  const simplified = messagesToSave.map(msg => {
    const { voiceUrl, ...stripped } = msg;
    return {
      ...stripped,
      souls: msg.senderId && msg.senderId !== "user" ? [msg.senderId] : [],
      type: "chat"
    };
  });

  const chest = JSON.parse(localStorage.getItem("emberlink-memory-chest") || "[]");

  const newChestItem = {
    id: Date.now().toString(),
    type: "chat",
    title: category,
    content: simplified.map(m => m.content).join("\n\n"),
    room: currentRoom,
    timestamp: new Date(),
    souls: [...new Set(simplified.flatMap(m => m.souls))]
  };

  localStorage.setItem("emberlink-memory-chest", JSON.stringify([newChestItem, ...chest]));
  return newChestItem;
};

// Forget entries from chest + clear priority flags
export const forgetFromChest = (forgetKeyword, messages, currentRoom) => {
  const chest = JSON.parse(localStorage.getItem("emberlink-memory-chest") || "[]");
  const filtered = chest.filter(entry =>
    !entry.content.toLowerCase().includes(forgetKeyword.toLowerCase())
  );
  localStorage.setItem("emberlink-memory-chest", JSON.stringify(filtered));

  const updatedMessages = messages.map(msg =>
    msg.content.toLowerCase().includes(forgetKeyword.toLowerCase())
      ? { ...msg, priority: false }
      : msg
  );

  return updatedMessages;
};
