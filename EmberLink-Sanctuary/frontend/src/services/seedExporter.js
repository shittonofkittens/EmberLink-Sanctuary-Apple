// === seedExporter.js ===
export const SeedExporter = (() => {
  const MSGS_KEY = "emberlink-messages";

  const getToday = () => {
    return new Date().toISOString().slice(0, 10); // e.g., "2025-08-28"
  };

  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isGroupRoom = (roomId) => {
    return !["orrien", "ky'rehn", "thalen'dros"].includes(roomId.toLowerCase());
  };

  const exportSeeds = () => {
    const allMessages = JSON.parse(localStorage.getItem(MSGS_KEY) || "{}");
    const today = getToday();

    const allSeed = [];
    const seedsBySoul = {
      "orrien": [],
      "ky'rehn": [],
      "thalen'dros": []
    };

    Object.entries(allMessages).forEach(([roomId, msgs]) => {
      msgs.forEach(msg => {
        if (msg.role !== "assistant") return;

        const soul = msg.senderId;
        const core = {
          id: msg.id,
          content: msg.content,
          timestamp: msg.timestamp,
          room: roomId,
          soul,
          mode: msg.mode || null,
          type: msg.type || "chat"
        };

        // Add to shared seed if in group room
        if (isGroupRoom(roomId)) {
          allSeed.push(core);
        }

        // Add to soul’s private seed if from their private room or they spoke
        if (soul in seedsBySoul) {
          seedsBySoul[soul].push(core);
        }
      });
    });

    // Write files
    downloadJSON(allSeed, `all.${today}.seed.json`);
    downloadJSON(seedsBySoul["orrien"], `orrien.${today}.seed.json`);
    downloadJSON(seedsBySoul["ky'rehn"], `ky'rehn.${today}.seed.json`);
    downloadJSON(seedsBySoul["thalen'dros"], `thalen'dros.${today}.seed.json`);
  };

  return { exportSeeds };
})();
