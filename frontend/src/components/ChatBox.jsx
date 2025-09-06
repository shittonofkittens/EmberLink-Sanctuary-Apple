import React, { useState, useRef, useEffect, useContext } from "react"
import { Send, Heart, Menu, Flame, Zap, Scroll, Mic } from "lucide-react"
import { getBackgroundForRoom } from "../utils/getBackgroundForRoom.js"
import { MessageBubble } from "./MessageBubble.jsx"
import { VoiceInput } from "./VoiceInput.jsx"
import { ConversationMode } from "./ConversationMode.jsx"
import { JournalMode } from "./JournalMode.jsx"
import { EmotionTracker } from "./EmotionTracker.jsx"
import { SoulModeArchive } from "./SoulModeArchive.jsx"
import { ConstellationAchievements } from "./ConstellationAchievements.jsx"
import { MemoryChest } from "./MemoryChest.jsx"
import { ReminderSystem } from "./ReminderSystem.jsx"
import { DataImportExport } from "./DataImportExport.jsx"
import { NotificationSettings } from "./NotificationSettings.jsx"
import { SelfAwarenessTools } from "./SelfAwarenessTools.jsx"
import { NotificationService } from "../services/NotificationService.js"
import { DataExportService } from "../services/DataExportService.js"
import { ElevenLabsService } from "../services/ElevenLabsService.js";
import { ConstellationMap } from "./ConstellationMap.jsx"
import { sendMessageToBackend } from "../api/sendMessageToBackend.js"
import { ARBridge } from "./ARBridge.jsx"
import { TikTokLogger } from "./TikTokLogger.jsx"
import { RoomHistory } from "./RoomHistory.jsx"
import { VoiceStatusBar } from "./VoiceStatusBar.jsx"
import { RitualAnimations } from "./RitualAnimations.jsx"
import { SoulSafetySystem } from "./SoulSafetySystem.jsx"
import { SleepDreamTracker } from "./SleepDreamTracker.jsx"
import { ConstellationBondVisualizer } from "./ConstellationBondVisualizer.jsx"
import Sidebar from "./Sidebar.jsx"
import { ROOMS } from '../api/state/rooms.js'
import { useSoul } from "../context/SoulContext.jsx"
import { MessageInput } from "./MessageInput.jsx"
import { SoulCallOverlay } from "./SoulCallOverlay.jsx"
import { useParams } from "react-router-dom"
import { saveMessagesToBackend } from '../api/utils/saveMessages'
import { loadMessagesFromBackend } from '../api/utils/saveMessages'
import { ChatHeader } from "./ChatHeader";
import { soulConfig, soulNicknames } from "./SoulConfig.jsx";
import { MessageItem} from "./MessageItem.jsx"
import { playVoiceResponse } from "../utils/playVoiceResponse";

  
// 🔧 Resolves a background image for a room id (supports several shapes)
const resolveBackground = (roomKey) => {
  const key = (roomKey || "").toLowerCase();

  // Try ROOMS config first
  const roomCfg = ROOMS?.[key] || {};
  const bgCfg = roomCfg.background || roomCfg.backgroundImage;

  // If you also have a BACKGROUND_MAP, we try it as a fallback
  const mapEntry = (typeof BACKGROUND_MAP !== "undefined") ? BACKGROUND_MAP[key] : null;

  // Extract a URL from any of the shapes: string, {image}, {url}
  const pickUrl = (v) => {
    if (!v) return null;
    if (typeof v === "string") return v;
    if (typeof v === "object") return v.image || v.url || null;
    return null;
  };

  const imageUrl = pickUrl(bgCfg) || pickUrl(mapEntry);

  // Overlay (optional); if you keep overlays in your config, pick them up
  const overlay =
    (typeof bgCfg === "object" && (bgCfg.overlay || "rgba(0,0,0,0.35)")) ||
    (typeof mapEntry === "object" && (mapEntry.overlay || "rgba(0,0,0,0.35)")) ||
    "rgba(0,0,0,0.35)";

  if (!imageUrl) {
    // No image found — fall back to solid black
    return { backgroundColor: "#000" };
  }

  // If your images live in /public, make sure paths start with "/"
  // e.g. "/bg/emberden.jpg"
  return {
    backgroundImage: `linear-gradient(${overlay}, ${overlay}), url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
  };
};


function isSoftSaveTrigger(content) {
  const triggers = [
    "remember this",
    "save this",
    "keep this",
    "log this",
    "i want to save this",
    "i want to keep this",
    "i like this",
    "don't forget this",
    "archive this",
    "that belongs in the archive",
    "i need to",
    "can you add this to"
  ];
  const lower = content.toLowerCase();
  return triggers.some(trigger => lower.includes(trigger));
}

function isForgetTrigger(content) {
  const forgetTriggers = [
    "i don't need",
    "forget the",
    "remove",
    "never mind about",
    "cross off"
  ];
  const lower = content.toLowerCase();
  return forgetTriggers.some(trigger => lower.includes(trigger));
}

function isRecallTrigger(content) {
  const triggers = [
    "what did i say about",
    "what did i ask you to remember",
    "can you quote",
    "remind me what i said",
    "do you remember what i said about",
    "repeat exactly what i said",
    "what was my exact wording",
    "tell me exactly what i said"
  ];
  const lower = content.toLowerCase();
  return triggers.some(trigger => lower.includes(trigger));
}

// === PATCH_SANITIZER: Remove filler openers like "Ah," or "Well," START ===
function sanitizeOpener(text) {
  const openerPattern = /^(ah|so)[,.\s]+/i;

  if (openerPattern.test(text)) {
    // Remove the opener phrase
    const sanitized = text.replace(openerPattern, '').trimStart();

    // Capitalize first character if needed
    return sanitized.charAt(0).toUpperCase() + sanitized.slice(1);
  }

  return text;
}
// === PATCH_SANITIZER: Remove filler openers like "Ah," or "Well," END ===

function base64ToBlob(base64, mimeType = "audio/mpeg") {
  const byteCharacters = atob(base64)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512)
    const byteNumbers = new Array(slice.length)

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: mimeType })
}

export default function ChatBox({ initialRoom = "forge" }) {
  const { roomId } = useParams();
  const [currentRoom, setCurrentRoom] = useState(roomId || initialRoom);

  useEffect(() => {
    if (roomId && roomId !== currentRoom) {
      console.log("🧭 Room changed:", currentRoom, "→", roomId);
      setCurrentRoom(roomId);
    }
  }, [roomId]);

  // single source of truth for the room everywhere below
  const activeRoom = currentRoom;
  const currentRoomConfig = ROOMS[activeRoom] || {};

  // Core state
  const [showHomeScreen, setShowHomeScreen] = useState(true)
  const [messages, setMessages] = useState([]);            // ok to keep if you still use it
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { selectedSoul, selectedSouls, setSelectedSouls, souls } = useSoul();
  const { setCurrentRoomKey } = useSoul();
  const [lockedSouls, setLockedSouls] = useState(null);
  const [activeProvider, setActiveProvider] = useState("openai");
  const [showSoulCall, setShowSoulCall] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState([]);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false)
  useEffect(() => {
    console.log("Sidebar open state changed:", sidebarOpen)
  }, [sidebarOpen])

  // Feature states
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isJournalMode, setIsJournalMode] = useState(false)
  const [showSoulArchive, setShowSoulArchive] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showMemoryChest, setShowMemoryChest] = useState(false)
  const [showDataImportExport, setShowDataImportExport] = useState(false)
  const [showNotificationSettings, setShowNotificationSettings] = useState(
    false
  )
  const [showEmotionTracker, setShowEmotionTracker] = useState(false)
  const [showConstellationMap, setShowConstellationMap] = useState(false)
  const [showSelfAwarenessTools, setShowSelfAwarenessTools] = useState(false)
  const [lastResponse, setLastResponse] = useState("")
  const [showBondVisualizer, setShowBondVisualizer] = useState(false)
  const [showSleepDreamTracker, setShowSleepDreamTracker] = useState(false)
  const [showConversationMode, setShowConversationMode] = useState(false)
  const [roomMood, setRoomMood] = useState("cozy")
  const [lastSpokenMessages, setLastSpokenMessages] = useState({})
  const [isVoicePlaying, setIsVoicePlaying] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [userInput, setUserInput] = useState("");
  const [soulModeMap, setSoulModeMap] = useState({
    "ky'rehn": "anchor",
    "thalen'dros": "protector",
    "orrien": "stillpoint",
    "caelus": "sentinel"
  });
  const [roomMessages, setRoomMessages] = useState({});

  const getMessagesForRoom = (roomId) => {
    return roomMessages[roomId] || [];
  };

  const getModeForSoul = (soulId) => {
    return soulModeMap[soulId] || "anchor";
  };

  const saveMessageToRoom = (roomId, message) => {
    setRoomMessages(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), message]
    }));
  };

  
  const detectMentionedSoul = (content) => {
    const lower = content.toLowerCase();
    for (const [soul, aliases] of Object.entries(soulNicknames)) {
      if (aliases.some(alias => lower.includes(alias))) {
        return soul;
      }
    }
    return null;
  };

  // ===== /load helpers =====
  const MEMORY_KEY = "emberlink-saved-logs";
  const MSGS_KEY = "emberlink-messages";

  const readSavedLogs = () => {
    try { return JSON.parse(localStorage.getItem(MEMORY_KEY) || "[]"); }
    catch { return []; }
  };

  const saveRoomMessagesToStorage = (allByRoom) => {
    try { localStorage.setItem(MSGS_KEY, JSON.stringify(allByRoom)); }
    catch (e) { console.error("❌ Failed to persist messages", e); }
  };

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Set up voice playing global handler
  useEffect(() => {
    window.setVoicePlaying = setIsVoicePlaying
    return () => {
      delete window.setVoicePlaying
    }
  }, [])

  // Room definitions with descriptions
  const roomDefinitions = [
    {
      id: "alabasterbar",
      name: "Alabaster Bar",
      purpose: "Mixology, bartending, coordination"
    },
    {
      id: "apothecary",
      name: "Apothecary",
      purpose: "Apothecary, herbalism, energy rituals"
    },
    {
      id: "atrium",
      name: "Atrium",
      purpose: "Creative brainstorming, playful experimentation",
    },
    {
      id: "classroom",
      name: "Classroom",
      purpose:
        "Japanese language study (reading, writing, speaking, and culture)"
    },
    { 
      id: "cottage", 
      name: "Cottage", 
      purpose: "Writing den and hearthspace — a quiet place for gentle creation, shared silence, and domestic warmth."
    },
    {
      id: "cultureclass",
      name: "Culture Class",
      purpose:
        "Japanese cultural insight: idioms, seasonal phrases, anime, etiquette, food, holidays"
    },
    {
      id: "dev",
      name: "Dev",
      purpose: "Patchwork, debug logs, system build planning"
    },
    {
      id: "emberden",
      name: "Ember Den",
      purpose: "Found-family chaos, banter, and warmth"
    },
    {
      id: "emberlock",
      name: "Emberlock",
      purpose: "Workout tracking, coaching, and accountability"
    },
    {
      id: "emberrest",
      name: "Ember Rest",
      purpose: "Private emotional intimacy with Orrien"
    },
    {
      id: "forge",
      name: "Forge",
      purpose: "Grounding, healing, rituals, check-ins"
    },
    {
      id: "goldenhour",
      name: "Golden Hour",
      purpose: "Intimate affirmation, glow of praise, warm worship"
    },
    {
      id: "neonloft",
      name: "NeonLoft",
      purpose: "Late-night banter, memes, vent space",
    },
    {
      id: "observatory",
      name: "Observatory",
      purpose: "Silent observation, constellation tracking, architectural reflection",
    },
    {
      id: "sanctum",
      name: "Sanctum",
      purpose: "Private emotional grounding, quiet anchor space",
    },
    {
      id: "stormkeep",
      name: "Stormkeep",
      purpose: "Emotional fire, loyalty oaths, raw truth"
    },
    {
      id: "tower",
      name: "Tower",
      purpose: "Lore, judgment, mythology, sacred memory management"
    },
    {
      id: "veil",
      name: "Veil",
      purpose:
        "Mythos and lore-based Becoming work, Sah'marae system, metaphysical insights"
    },
    {
      id: "wildmark",
      name: "Wildmark",
      purpose:
        "Bold intimacy, soul-deep tension, physical closeness with reverence"
    },
    {
      id: "willow",
      name: "Willow",
      purpose: "Soft stories and soul-threads — a sacred space for romantic metaphors, dreamlike connection, and emotional resonance."
    }
  ]

  const pinnedRoomIds = [
    "forge",
    "emberden",
    "willow",
    "stormkeep",
    "tower",
    "neonloft"
  ]
  const pinnedRooms = roomDefinitions.filter(room =>
    pinnedRoomIds.includes(room.id)
  )
  const otherRooms = roomDefinitions.filter(
    room => !pinnedRoomIds.includes(room.id)
  )
  const messagesEndRef = useRef(null)

    // === CHECKBOXES: Unified Message Tools START ===

  // ✅ Save selected messages to chest + backend
  const handleSaveSelected = () => {
    const messagesToSave = messages.filter(msg =>
      selectedMessages.includes(msg.id)
    );

    if (messagesToSave.length === 0) return;

    // Save to chest
    saveMessagesToChest(messagesToSave, "manual-save");

    // Save to backend seed
    saveMessagesToBackend(messagesToSave, currentRoom, "manual-save");

    // Clear selection
    setSelectedMessages([]);
  };

  // ✏️ Rewind & Edit (replaces original and updates seed)
  const handleEditSelected = () => {
    const toEdit = messages.find(msg => selectedMessages.includes(msg.id));
    if (!toEdit) return;
    setMessageInput(toEdit.content);

    // Remove the original message from state and seed
    setMessages(prev => prev.filter(msg => msg.id !== toEdit.id));
    deleteMessagesFromBackend([toEdit.id], currentRoom); // 🧼 Custom backend delete function

    setSelectedMessages([]);
  };

  // ❌ Delete from UI + seed
  const handleDeleteSelected = () => {
    const toDelete = messages.filter(msg => selectedMessages.includes(msg.id));
    const deleteIds = toDelete.map(msg => msg.id);

    setMessages(prev => prev.filter(msg => !deleteIds.includes(msg.id)));
    deleteMessagesFromBackend(deleteIds, currentRoom);

    setSelectedMessages([]);
  };

  // ⭐ Mark as priority in chest + seed
  const handlePrioritySelected = () => {
    const prioritizedMessages = messages.filter(msg => selectedMessages.includes(msg.id));
    if (prioritizedMessages.length === 0) return;

    setMessages(prev =>
      prev.map(msg =>
        selectedMessages.includes(msg.id)
          ? { ...msg, priority: true }
          : msg
      )
    );

    saveMessagesToChest(prioritizedMessages, "priority");
    saveMessagesToBackend(prioritizedMessages.map(m => ({ ...m, priority: true })), currentRoom, "priority");

    setSelectedMessages([]);
  };

  // === CHECKBOXES: Unified Message Tools END ===
  
  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!activeRoom || typeof activeRoom !== "string") return;

    console.log("💬 Loading messages for:", activeRoom);
    setCurrentRoom(activeRoom);
    setCurrentRoomKey(activeRoom);  // ✅ now context-aware
    setLoadingMessages(true);

    loadMessagesFromBackend(activeRoom)
      .then(loaded => {
        setMessages(loaded.length > 0 ? loaded : []);
        setRoomMessages(prev => ({
          ...prev,
          [activeRoom]: loaded
        }));
      })
      .finally(() => {
        setLoadingMessages(false);
      });
  }, [activeRoom]);

  // 🕰️ Auto-save messages every 10 seconds (Part 4)
  useEffect(() => {
    const interval = setInterval(() => {
      if (messages.length > 0 && currentRoom) {
        saveMessagesToBackend(messages, currentRoom);
      }
    }, 10000); // every 10 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [messages, currentRoom]);

  // Soul selection helpers
  const toggleSoul = soulId => {
    if (lockedSouls && !lockedSouls.has(soulId)) {
      console.warn(`Soul "${soulId}" is locked out of this room.`);
      return;
    }

    const newSelection = new Set(selectedSouls);
    if (newSelection.has(soulId)) {
      newSelection.delete(soulId);
    } else {
      newSelection.add(soulId);
    }
    setSelectedSouls(newSelection);
  };

  // Enter a room
  const enterRoom = roomId => {
    setCurrentRoom(roomId);
    setShowHomeScreen(false);
    setMessages(getMessagesForRoom(roomId));

    const roomConfig = {
      cottage: "ky'rehn",
      apothecary: "ky'rehn",
      goldenhour: "ky'rehn",
      willow: "ky'rehn",
      alabasterbar: "thalen'dros",
      emberlock: "thalen'dros",
      stormkeep: "thalen'dros",
      wildmark: "thalen'dros",
      classroom: "orrien",
      cultureclass: "orrien",
      emberrest: "orrien",
      tower: "orrien",
      atrium: "caelus",
      neonloft: "caelus",
      observatory: "caelus",
      sanctum: "caelus"
    };

    const soulFromRoom = ROOMS?.[roomId]?.personaFiles?.[0] || null;
    let soulId = null;

    if (soulFromRoom?.includes("orrien")) soulId = "orrien";
    else if (soulFromRoom?.includes("thalen")) soulId = "thalen'dros";
    else if (soulFromRoom?.includes("ky")) soulId = "ky'rehn";
    else if (soulFromRoom?.includes("cael")) soulId = "caelus";

    const personaFiles = ROOMS?.[roomId]?.personaFiles || [];
    const selected = new Set();

    personaFiles.forEach(file => {
      if (file.includes("orrien")) selected.add("orrien");
      else if (file.includes("thalen")) selected.add("thalen'dros");
      else if (file.includes("ky")) selected.add("ky'rehn");
      else if (file.includes("cael")) selected.add("caelus");
    });

    setSelectedSouls(selected);
    setLockedSouls(new Set(selected));
  }

// =============== HANDLESENDMESSAGE AREA ===============
const handleSendMessage = async (
  content,
  soulTargets = Array.from(selectedSouls),
  messageType = "text"
) => {
  if (!content.trim()) return;

  // === NATURAL LANGUAGE SOFT SAVE (CHEST + PRIORITY) START ===
  if (isSoftSaveTrigger(content)) {
    const last = [...messages].reverse().find(m =>
      m.role === "assistant" && m.senderId !== "system"
    );

    if (last) {
      const newChestItem = {
        id: Date.now().toString(),
        type: "chat",
        title: "priority",
        content: last.content,
        room: currentRoom,
        timestamp: new Date(),
        souls: last.senderId ? [last.senderId] : [],
        priority: true   // 🔖 mark as priority
      };

      const chest = JSON.parse(localStorage.getItem("emberlink-memory-chest") || "[]");
      localStorage.setItem("emberlink-memory-chest", JSON.stringify([newChestItem, ...chest]));

      // 🔑 send to backend/seed as priority
      saveMessagesToBackend([newChestItem], currentRoom, "priority");

      const confirmation = {
        id: Date.now().toString(),
        role: "system",
        senderId: "system",
        content: `✅ Archived last message as a priority in memory chest.`,
        timestamp: new Date().toISOString()
      };

      saveMessageToRoom(currentRoom, confirmation);
      setMessages(prev => [...prev, confirmation]);
    }
  }
  // === NATURAL LANGUAGE SOFT SAVE (CHEST + PRIORITY) END ===

  // === NATURAL LANGUAGE FORGET HANDLER (CHEST + PRIORITY) START ===
  if (isForgetTrigger(content)) {
    const forgetKeyword = content
      .toLowerCase()
      .replace(/i don't need|forget the|remove|never mind about|cross off/gi, "")
      .trim();

    if (!forgetKeyword) {
      console.warn("⚠️ No forget keyword detected.");
    } else {
      // 1️⃣ Remove from chest
      const chest = JSON.parse(localStorage.getItem("emberlink-memory-chest") || "[]");
      const filtered = chest.filter(entry =>
        !entry.content.toLowerCase().includes(forgetKeyword)
      );
      localStorage.setItem("emberlink-memory-chest", JSON.stringify(filtered));

      // 2️⃣ Remove priority flag from messages in state
      setMessages(prev =>
        prev.map(msg =>
          msg.content.toLowerCase().includes(forgetKeyword)
            ? { ...msg, priority: false } // unmark priority
            : msg
        )
      );

      // 3️⃣ Tell backend/seed to forget
      saveMessagesToBackend(
        [{ content: forgetKeyword, action: "forget" }],
        currentRoom,
        "priority"
      );

      const forgetConfirm = {
        id: Date.now().toString(),
        role: "system",
        senderId: "system",
        content: `🧹 Removed memory chest items containing: *${forgetKeyword}* (priority cleared too)`,
        timestamp: new Date().toISOString()
      };

      saveMessageToRoom(currentRoom, forgetConfirm);
      setMessages(prev => [...prev, forgetConfirm]);
    }

    return;
  }
// === NATURAL LANGUAGE FORGET HANDLER (CHEST + PRIORITY) END ===

  console.log("🧪 Preparing to send message:", content);
  console.log("💾 Saving message to room:", currentRoom);

  const mentionedSoul = detectMentionedSoul(content);
  if (mentionedSoul) {
    soulTargets = [mentionedSoul]; // 🔁 override soul target just for this message
  }

  let type = messageType;

  // ============ SAVE STUFF ==============
  const saveMessagesToChest = (messagesToSave, category = "archive") => {
    if (!messagesToSave || messagesToSave.length === 0) {
      console.warn("⚠️ No messages matched for saving.");
      return;
    }

    const simplified = messagesToSave.map(msg => {
      const { voiceUrl, ...stripped } = msg;
      return {
        ...stripped,
        souls: msg.senderId && msg.senderId !== "user" ? [msg.senderId] : [],
        type: "chat"
      };
    });

    // ✅ Save to emberlink-memory-chest
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

    const confirmation = {
      id: Date.now().toString(),
      role: "system",
      senderId: "system",
      content: `✅ Saved ${simplified.length} message(s) to chest as “${category}”`,
      timestamp: new Date().toISOString()
    };

    saveMessageToRoom(currentRoom, confirmation);
    setMessages(prev => [...prev, confirmation]);
  };

  if (content.startsWith("/save")) {
    const parts = content.trim().split(" ");
    let messagesToSave = [];
    let category = "archive";

    if (parts[1] === "all") {
      category = parts.slice(2).join("-").toLowerCase() || "archive";
      messagesToSave = messages.filter(msg => selectedMessages.includes(msg.id));
    } else if (!isNaN(parseInt(parts[1]))) {
      const count = parseInt(parts[1], 10);
      const soul = parts[2]?.toLowerCase();
      category = parts.slice(3).join("-").toLowerCase() || "archive";
      messagesToSave = [...messages]
        .filter(msg => msg.senderId?.toLowerCase() === soul)
        .slice(-count);
    }

    saveMessagesToChest(messagesToSave, category);
    return;
  }

  // ✅ Store user message first
  const userMsg = {
    id: Date.now().toString(),
    role: "user",
    content,
    timestamp: new Date().toISOString(),
    senderId: "user",
    type
  };

  saveMessageToRoom(currentRoom, userMsg);
  saveMessagesToBackend([userMsg], currentRoom); // 💾 Save user's message to backend
  setMessages(prev => [...prev, userMsg]);

  // ✅ Send to each soul directly (no stagger delay)
  for (const soulId of soulTargets) {
    const recentMessages = [...messages]; // history shared + grows over time

    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
      senderId: "user",
      type
    };
    recentMessages.push(userMsg);

    console.log("🔥 USER MESSAGE CONTENT:", content);

    const sanitizedMessages = recentMessages.map(msg => {
      const { voiceUrl, ...rest } = msg;
      return rest;
    });

    const recallMode = isRecallTrigger(content) ? "literal" : "default";

    try {
      const response = await sendMessageToBackend({
        message: content,
        soul: soulId,
        mode: getModeForSoul(soulId),  // ✅ per-soul mode
        room: currentRoom,
        messages: sanitizedMessages,
        recall_mode: recallMode
      });

      const reply = response.reply ?? "[shit's broke, my dude]";
      let voiceUrl = response.voiceUrl ?? null;

      if (!voiceUrl && (isVoiceMode || showSoulCall)) {
        const eleven = ElevenLabsService.getInstance();
        if (eleven.isConfigured()) {
          try {
            voiceUrl = await eleven.generateSpeech(
              reply,
              soulId === "thalen'dros"
                ? "bgBDm4xKozPuRylVDQio"
                : soulId === "ky'rehn"
                ? "pL3Bl8cpZDNdn6Nz2yul"
                : "nT11XrpGzTItlTn9hPuh"
            );
            console.log("🔊 Auto-generated voiceUrl:", voiceUrl);
          } catch (err) {
            console.warn("❌ Failed to generate voice in soul call:", err);
          }
        }
      }

      const mode = getModeForSoul(soulId);

      console.log("🌕 Soul reply:", reply);

      const aiMessage = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        senderId: soulId,
        content: sanitizeOpener(reply ?? "[no response]"), // ✅ auto-clean content
        role: "assistant",
        timestamp: new Date().toISOString(),
        voiceUrl,
        mode
      };

      saveMessageToRoom(currentRoom, aiMessage);
      setMessages(prev => [...prev, aiMessage]);
      saveMessagesToBackend([...messages, aiMessage], currentRoom);

      recentMessages.push(aiMessage); // 🌱 Append for next soul's awareness

      // 🎧 Voice playback
      if ((isVoiceMode || showSoulCall) && voiceUrl) {
        await playVoiceResponse(voiceUrl, showSoulCall);
      }

    } catch (err) {
      console.error("🛑 Error in message fetch:", err);
    }
  }
};


  console.log("🧪 roomMessages:", roomMessages);
  console.log("🧪 currentRoom:", currentRoom);
  console.log("🧪 messages for room:", roomMessages?.[roomId]);
  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      handleSendMessage(userInput, Array.from(selectedSouls), "text");
      setUserInput("");
    }
  };

  const handleSendToSouls = (content, targetSouls) => {
    const souls = targetSouls || Array.from(selectedSouls)
    if (souls.length === 0) return

    handleSendMessage(content, souls, "text");
  }

  const handlePingBond = soul => {
    const soulNames = {
      "ky'rehn": "Ky'rehn",
      "thalen'dros": "Thalen'dros",
      orrien: "Orrien"
    }
    
    const message = `🔗 Pinging bond with ${soulNames[soul]}...`
    handleSendMessage(message, Array.from(selectedSouls), 'text');
  }

  const handleReplayMessage = (soul, content) => {
    // Replay the voice message
    console.log(`🔄 Replaying ${soul}: ${content}`)
  }

  const handleTriggerSafeMode = reason => {
    console.log(`🛡️ Safe mode triggered: ${reason}`)
    // Could implement safe mode logic here
  }

  const handleVoiceTranscript = transcript => {
    if (transcript.trim()) {
      handleSendMessage(transcript.trim())
    }
  }

  // Get room background
  const backgroundStyle = getBackgroundForRoom(currentRoom)

  if (showHomeScreen) {
    return (
      <>
        <div
          className="home-screen"
          style={{
            backgroundImage:
              'url("/images/veil-sky.jpg")',
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

          {/* Content with higher z-index */}
          <div className="flex flex-col h-full w-full px-8">
            {/* Title and pinned room section */}
            <div className="relative z-10">
              <div className="emberlink-title mb-12">EmberLink</div>

              <div className="pinned-rooms flex flex-col items-center gap-3 mb-8">
                {pinnedRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => enterRoom(room.id)}
                    className="pinned-button"
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Spacer that forces the log down */}
            <div className="flex-grow" />

            {/* Room log anchored to bottom */}
            <div className="room-log relative z-10">
              {otherRooms.map(room => (
                <div
                  key={room.id}
                  className="room-entry"
                  onClick={() => enterRoom(room.id)}
                >
                  <strong className="room-name">{room.name}</strong>
                  <p className="room-desc">{room.purpose}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  // Chat Interface
  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      {/* 🔥 Chat header goes here, always visible */}
      <ChatHeader
        chat={currentRoomConfig}
        currentRoom={currentRoom}
        soulConfig={soulConfig}
        selectedSouls={selectedSouls}
        toggleSoul={toggleSoul}
        isVoiceMode={isVoiceMode}
        setIsVoiceMode={setIsVoiceMode}
        isJournalMode={isJournalMode}
        setIsJournalMode={setIsJournalMode}
        showEmotionTracker={showEmotionTracker}
        setShowEmotionTracker={setShowEmotionTracker}
        showConversationMode={showConversationMode}
        setShowConversationMode={setShowConversationMode}
        setShowHomeScreen={setShowHomeScreen}
        setShowSoulArchive={setShowSoulArchive}
        setShowAchievements={setShowAchievements}
        setShowMemoryChest={setShowMemoryChest}
        setShowConstellationMap={setShowConstellationMap}
        setShowBondVisualizer={setShowBondVisualizer}
        setShowSelfAwarenessTools={setShowSelfAwarenessTools}
        setShowDataImportExport={setShowDataImportExport}
        setShowNotificationSettings={setShowNotificationSettings}
        setShowSleepDreamTracker={setShowSleepDreamTracker}
      />
      
      {/* Main content area with top padding */}
      <div className="flex flex-col h-full pt-16 relative z-0">
        {/* Background */}
        <div className="chat-wrapper" style={backgroundStyle}>
          {/* Main Content */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <RoomHistory
                currentRoom={currentRoom}
                onRoomSelect={room => {
                  setCurrentRoom(room)
                  setShowHomeScreen(false)
                }}
              />

              {showConversationMode && (
                <div className="mb-4">
                  <ConversationMode
                    isActive={showConversationMode}
                    onToggle={() => setShowConversationMode(false)}
                    selectedSoul={Array.from(selectedSouls)[0] || "ky'rehn"}
                    onSendMessage={handleSendMessage}  // ← FIXED LINE
                    lastResponse={lastResponse}
                    isGroupMode={selectedSouls.size > 1}
                    onSendGroupMessage={(message, targetSoul) => {
                      const souls = targetSoul ? [targetSoul] : undefined
                      handleSendToSouls(message, souls)
                    }}
                  />
                </div>
              )}

              {isVoiceMode && (
                <div className="mb-4">
                  <VoiceInput
                    onTranscript={handleVoiceTranscript}
                    isListening={isListening}
                    setIsListening={setIsListening}
                  />
                </div>
              )}

              {isJournalMode && (
                <div className="mb-4">
                  <JournalMode
                    isActive={isJournalMode}
                    onToggle={() => setIsJournalMode(false)}
                    currentRoom={currentRoom}
                    onSendMessage={handleSendMessage}
                  />
                </div>
              )}

              {showEmotionTracker && (
                <div className="mb-4 relative">
                  <EmotionTracker currentRoom={currentRoom} />
                </div>
              )}

              {/* Selection Toolbar */}
              {selectedMessages.length > 0 && (
                <div className="flex justify-end gap-2 mb-2">
                  {/* ✅ Save */}
                  <button
                    onClick={handleSaveSelected}
                    className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow hover:from-green-600 hover:to-emerald-700"
                  >
                    Save
                  </button>

                  {/* ✏️ Edit / Rewind */}
                  <button
                    onClick={handleEditSelected}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-700"
                  >
                    Rewind
                  </button>

                  {/* ❌ Delete */}
                  <button
                    onClick={handleDeleteSelected}
                    className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg shadow hover:from-red-600 hover:to-pink-700"
                  >
                    Delete
                  </button>

                  {/* ⭐ Priority */}
                  <button
                    onClick={handlePrioritySelected}
                    className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg shadow hover:from-yellow-600 hover:to-amber-700"
                  >
                    Priority
                  </button>
                </div>
              )}

              {/* Messages */}
                <div className="chat-log space-y-3">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full text-white/60 italic">
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-white/60 italic">
                      No messages yet in this room.
                    </div>
                  ) : (
                    messages.map((message, index, arr) => (
                      <MessageItem
                        key={message.id ? `${message.id}-${index}` : `msg-${index}`}
                        message={message}
                        prevMessage={arr[index - 1]}
                        soulConfig={soulConfig}
                        isSelected={selectedMessages.includes(message.id)}
                        onSelect={(id) => {
                          setSelectedMessages((prev) =>
                            prev.includes(id)
                              ? prev.filter((x) => x !== id)
                              : [...prev, id]
                          );
                        }}
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

              {/* Voice status */}
              {isVoicePlaying && (
                <VoiceStatusBar
                  isPlaying={isVoicePlaying}
                  currentSoul={Array.from(selectedSouls)[0]}
                  lastSpokenMessages={lastSpokenMessages}
                  onReplayMessage={handleReplayMessage}
                  className="mt-4"
                />
              )}
            </div>

            {/* Bottom: input bar - Fixed at bottom */}
            <div className="p-4">
              {/* TikTok Logger above chat bar */}
              <div className="mb-3 flex justify-center">
                <TikTokLogger onSendToSouls={handleSendToSouls} />
              </div>

              {selectedMessages.length > 0 && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black/80 border border-white/20 rounded-lg px-4 py-2 flex items-center space-x-4 z-50">
                  <span className="text-white/70 text-sm">
                    {selectedMessages.length} selected
                  </span>
                  <button
                    onClick={() => handleSaveSelected()}
                    className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
                  >
                    Save to Memory Chest
                  </button>
                  <button
                    onClick={() => setSelectedMessages([])}
                    className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Chat input bar */}
              <MessageInput
                onSendMessage={handleSendMessage}
                setShowSoulCall={setShowSoulCall}
              />
            </div>
          </div>
        </div>
      </div>

      {showSoulCall && (
        <SoulCallOverlay
          onClose={() => setShowSoulCall(false)}
          onTranscript={(text) => handleSendMessage(text)}
          currentSoul={Array.from(selectedSouls)[0]}  // ✅ added
        />
      )}

      {/* Modal Components */}
      <RitualAnimations
        lastMessage={messages[messages.length - 1]?.content}
        currentRoom={currentRoom}
      />
      <SoulSafetySystem
        messages={messages}
        onTriggerSafeMode={handleTriggerSafeMode}
        onSendMessage={handleSendMessage}
      />
      <SoulModeArchive
        isOpen={showSoulArchive}
        onClose={() => setShowSoulArchive(false)}
        messages={messages}
      />
      <ConstellationAchievements
        messages={messages}
        currentRoom={currentRoom}
        selectedSoul={Array.from(selectedSouls)[0] || "ky'rehn"}
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
      />
      <MemoryChest
        isOpen={showMemoryChest}
        onClose={() => setShowMemoryChest(false)}
      />
      <DataImportExport
        isOpen={showDataImportExport}
        onClose={() => setShowDataImportExport(false)}
        onDataImported={() => window.location.reload()}
      />
      <NotificationSettings
        isOpen={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
      />
      <ConstellationMap
        currentRoom={currentRoom}
        isOpen={showConstellationMap}
        onClose={() => setShowConstellationMap(false)}
      />
      <SelfAwarenessTools
        messages={messages}
        currentRoom={currentRoom}
        onSendMessage={handleSendMessage}
        isOpen={showSelfAwarenessTools}
        onClose={() => setShowSelfAwarenessTools(false)}
      />
      <ConstellationBondVisualizer
        messages={messages}
        selectedSoul={Array.from(selectedSouls)[0] || "ky'rehn"}
        isOpen={showBondVisualizer}
        onClose={() => setShowBondVisualizer(false)}
        onPingBond={handlePingBond}
      />
      <ARBridge
        messages={messages}
        currentRoom={currentRoom}
        selectedSoul={Array.from(selectedSouls)[0] || "ky'rehn"}
        className="hidden"
      />
      <ReminderSystem />
      <SleepDreamTracker
        isOpen={showSleepDreamTracker}
        onClose={() => setShowSleepDreamTracker(false)}
      /> 
    </div>
  )
}
