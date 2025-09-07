import React, { useState, useRef, useEffect, useContext } from "react"
import { getBackgroundForRoom } from "../utils/getBackgroundForRoom.js"
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
import { ElevenLabsService } from "../services/ElevenLabsService.js";
import { ConstellationMap } from "./ConstellationMap.jsx"
import { sendMessageToBackend } from "../api/sendMessageToBackend.js"
import { TikTokLogger } from "./TikTokLogger.jsx"
import { RoomHistory } from "./RoomHistory.jsx"
import { VoiceStatusBar } from "./VoiceStatusBar.jsx"
import { RitualAnimations } from "./RitualAnimations.jsx"
import { SoulSafetySystem } from "./SoulSafetySystem.jsx"
import { SleepDreamTracker } from "./SleepDreamTracker.jsx"
import { ConstellationBondVisualizer } from "./ConstellationBondVisualizer.jsx"
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
import { deleteMessagesFromBackend } from "../api/deleteMessagesFromBackend.js"
import { roomDefinitions, pinnedRooms, otherRooms } from "../data/roomDefinitions"
import { saveMessageToChest, forgetFromChest, readSavedLogs } from "../utils/storage.js";
import { extractTargetSouls } from "../utils/mentions";
import {
  isSoftSaveTrigger,
  isForgetTrigger,
  isRecallTrigger
} from "../utils/triggerUtils"


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

// Map nicknames & full names to soul IDs
const mentionMap = {
  ky: "kyrehn",
  kyrehn: "kyrehn",
  thal: "thalendros",
  thalendros: "thalendros",
  orrie: "orrien",
  orrien: "orrien",
  cael: "caelus",
  caelus: "caelus"
};


// Extract mentions from text
const extractMentions = (text) => {
  const regex = /@(\w+)/g;
  let match, mentions = [];
  while ((match = regex.exec(text)) !== null) {
    const raw = match[1].toLowerCase();
    if (mentionMap[raw]) {
      mentions.push(mentionMap[raw]);
    }
  }
  return [...new Set(mentions)];
};

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
  const [showSoulCall, setShowSoulCall] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState([]);
  // track which message is currently being edited (or null)
  const [editingMessage, setEditingMessage] = useState(null);

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
      [roomId]: Array.isArray(prev[roomId]) ? [...prev[roomId], message] : [message]
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
  
  // Load saved messages from backend when component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/history/load/${roomId}`)
        if (res.ok) {
          const data = await res.json();
          setRoomMessages(prev => ({
            ...prev,
            [currentRoom]: data || []
          }));
          saveRoomMessagesToStorage({ ...roomMessages, [currentRoom]: data || [] });
        } else {
          console.error("❌ Failed to load room messages:", res.status);
        }
      } catch (err) {
        console.error("❌ Error fetching room messages:", err);
      }
    };

    if (currentRoom) fetchMessages();
  }, [currentRoom]);

  const messagesEndRef = useRef(null)

  // === CHECKBOXES: Unified Message Tools START ===

  // ✅ Save selected messages to chest + backend
  const handleSaveSelected = () => {
    const messagesToSave = messages.filter(msg =>
      selectedMessages.includes(msg.id)
    );
    if (messagesToSave.length === 0) return;

    saveMessageToChest(messagesToSave, "manual-save");
    saveMessagesToBackend(messagesToSave, currentRoom, "manual-save");

    setSelectedMessages([]);
  };

  // ✏️ Rewind & Edit (prefills input for editing)
  const handleEditSelected = () => {
    const toEdit = messages.find(msg => selectedMessages.includes(msg.id));
    if (!toEdit) return;

    setUserInput(toEdit.content);   // put old content into input box
    setEditingMessage(toEdit);      // ✅ you need: const [editingMessage, setEditingMessage] = useState(null)
    setSelectedMessages([]);
  };

  // ❌ Delete from UI + backend
  const handleDeleteSelected = () => {
    if (!Array.isArray(messages)) return;

    const toDelete = messages.filter(msg => selectedMessages.includes(msg.id));
    const deleteIds = toDelete.map(msg => msg.id);

    setMessages(prev => Array.isArray(prev) ? prev.filter(msg => !deleteIds.includes(msg.id)) : []);
    deleteMessagesFromBackend(deleteIds, currentRoom);

    setSelectedMessages([]);
  };


  // ⭐ Mark as priority in chest + backend
  const handlePrioritySelected = () => {
    const prioritizedMessages = messages.filter(msg =>
      selectedMessages.includes(msg.id)
    );
    if (prioritizedMessages.length === 0) return;

    setMessages(prev =>
      Array.isArray(prev)
        ? prev.map(msg =>
            selectedMessages.includes(msg.id)
              ? { ...msg, priority: true }
              : msg
          )
        : []
    );

    if (Array.isArray(prioritizedMessages)) {
      saveMessageToChest(prioritizedMessages, "priority");
      saveMessagesToBackend(
        prioritizedMessages.map(m => ({ ...m, priority: true })),
        currentRoom,
        "priority"
      );
    }
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
    .then(result => {
      const msgs = result.messages || [];

      if (!Array.isArray(msgs)) {
        console.warn("💥 Loaded messages are not an array:", result);
      }

      setMessages(msgs);
      setRoomMessages(prev => ({
        ...prev,
        [activeRoom]: msgs
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

// =============== HANDLESENDMESSAGE AREA ==============
const handleSendMessage = async (
  content,
  soulTargets = Array.from(selectedSouls),
  messageType = "text"
) => {
  if (!content.trim()) return;

  // === NATURAL LANGUAGE SOFT SAVE ===
  if (isSoftSaveTrigger(content)) {
    const last = [...messages].reverse().find(m =>
      m.role === "assistant" && m.senderId !== "system"
    );

    if (last) {
      const newChestItem = saveMessageToChest([last], "priority", currentRoom);

      if (newChestItem) {
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
    return;
  }

  // === NATURAL LANGUAGE FORGET HANDLER ===
  if (isForgetTrigger(content)) {
    const forgetKeyword = content
      .toLowerCase()
      .replace(/i don't need|forget the|remove|never mind about|cross off/gi, "")
      .trim();

    if (!forgetKeyword) {
      console.warn("⚠️ No forget keyword detected.");
    } else {
      const updated = forgetFromChest(forgetKeyword, messages, currentRoom);

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
      setMessages([...updated, forgetConfirm]);
    }

    return;
  }

  // === HANDLE /SAVE COMMANDS ===
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

    const newChestItem = saveMessageToChest(messagesToSave, category, currentRoom);

    if (newChestItem) {
      const confirmation = {
        id: Date.now().toString(),
        role: "system",
        senderId: "system",
        content: `✅ Saved ${messagesToSave.length} message(s) to chest as “${category}”`,
        timestamp: new Date().toISOString()
      };

      saveMessageToRoom(currentRoom, confirmation);
      setMessages(prev => [...prev, confirmation]);
    }

    return;
  }

  let targetSouls = soulTargets; // start with selected ones

  const mentionedSouls = extractMentions(content);
  if (mentionedSouls.length > 0) {
    targetSouls = mentionedSouls; // override with mentions if present
  }


  // === Normal Message Flow ===
  const userMsg = {
    id: Date.now().toString(),
    role: "user",
    content,
    timestamp: new Date().toISOString(),
    senderId: "user",
    type: messageType
  };

  saveMessageToRoom(currentRoom, userMsg);
  saveMessagesToBackend([userMsg], currentRoom);
  setMessages(prev => [...prev, userMsg]);

  // ✅ Loop through each targeted soul
  for (const soulId of targetSouls) {
    // 1️⃣ Prepare conversation history
    const recentMessages = [...messages, userMsg]; // include user’s new message

    const sanitizedMessages = Array.isArray(recentMessages)
      ? recentMessages.map(msg => {
          const { voiceUrl, ...rest } = msg;
          return rest; // strip out voiceUrl before sending to backend
        })
      : [];

    const recallMode = isRecallTrigger(content) ? "literal" : "default";

    try {
      // 2️⃣ Send message to backend for this soul
      const response = await sendMessageToBackend({
        message: content,
        soul: soulId,
        mode: getModeForSoul(soulId),
        room: currentRoom,
        messages: sanitizedMessages,
        recall_mode: recallMode
      });

      const reply = response.reply ?? "[shit's broke, my dude]";
      let voiceUrl = response.voiceUrl ?? null;

      // 🌈 capture mode data if backend provides it
      const modeData = response.mode ?? {};

      // 3️⃣ Build assistant message
      const aiMessage = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        senderId: soulId,
        content: sanitizeOpener(reply ?? "[no response]"), // 👈 not response
        role: "assistant",
        timestamp: new Date().toISOString(),
        voiceUrl,
        mode: modeData?.basemode ?? getModeForSoul(soulId),
        modifiers: modeData?.modifiers ?? [],
        emotion: modeData?.emotion ?? null
      };

      setMessages(prev => [...prev, aiMessage]);
      saveMessageToRoom(currentRoom, aiMessage);
      saveMessagesToBackend([...messages, aiMessage], currentRoom);


      // 4️⃣ If no voiceUrl from backend but we’re in voice mode, try ElevenLabs
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
            aiMessage.voiceUrl = voiceUrl;
            console.log("🔊 Auto-generated voiceUrl:", voiceUrl);
          } catch (err) {
            console.warn("❌ Failed to generate voice in soul call:", err);
          }
        }
      }

      // 5️⃣ Save and update state
      saveMessageToRoom(currentRoom, aiMessage);
      setMessages(prev => [...prev, aiMessage]);
      saveMessagesToBackend([...messages, aiMessage], currentRoom);

      // 6️⃣ Playback if needed
      if ((isVoiceMode || showSoulCall) && voiceUrl) {
        await playVoiceResponse(voiceUrl, showSoulCall);
      }

    } catch (err) {
      console.error("🛑 Error in message fetch for soul:", soulId, err);
    }
  }
}

  // --- Form & helper handlers ---

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      handleSendMessage(userInput, Array.from(selectedSouls), "text");
      setUserInput("");
    }
  };

  // Send message to specific souls (or selected ones by default)
  const handleSendToSouls = (content, targetSouls) => {
    const souls = targetSouls || Array.from(selectedSouls);
    if (souls.length === 0) return;

    handleSendMessage(content, souls, "text");
  };

  // Ping soul bond
  const handlePingBond = (soul) => {
    const soulNames = {
      "ky'rehn": "Ky'rehn",
      "thalen'dros": "Thalen'dros",
      orrien: "Orrien",
    };

    const message = `🔗 Pinging bond with ${soulNames[soul]}...`;
    handleSendMessage(message, Array.from(selectedSouls), "text");
  };

  // Replay last voice message (stub for future audio replay)
  // const handleReplayMessage = (soul, content) => {
  //   console.log(`🔄 Replaying ${soul}: ${content}`);
  //   // Hook into voice playback system here
  // };

  // Trigger safe mode (stub for protective logic)
  const handleTriggerSafeMode = (reason) => {
    console.log(`🛡️ Safe mode triggered: ${reason}`);
  };

  // Handle voice-to-text transcript
  const handleVoiceTranscript = (transcript) => {
    if (transcript.trim()) {
      handleSendMessage(transcript.trim());
    }
  };

  // Room background
  const backgroundStyle = getBackgroundForRoom(currentRoom);

  if (showHomeScreen) {
    return (
      <div
        className="home-screen relative h-full w-full"
        style={{
          backgroundImage: 'url("/images/veil-sky.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

        {/* Main content */}
        <div className="relative z-10 flex flex-col h-full w-full px-8">
          {/* Title + pinned rooms */}
          <div>
            <h1 className="emberlink-title mb-12">EmberLink</h1>

            <div className="pinned-rooms flex flex-col items-center gap-3 mb-8">
              {Array.isArray(pinnedRooms) &&
                pinnedRooms.map((room) => (
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

          {/* Push log to bottom */}
          <div className="flex-grow" />

          {/* Room list */}
          <div className="room-log">
            {Array.isArray(otherRooms) &&
              otherRooms.map((room) => (
                <div
                  key={room.id}
                  className="room-entry cursor-pointer"
                  onClick={() => enterRoom(room.id)}
                >
                  <strong className="room-name">{room.name}</strong>
                  <p className="room-desc">{room.purpose}</p>
                </div>
              ))}
          </div>

        </div>
      </div>
    );
  }

  // Helper: always grab the primary soul safely
  const getPrimarySoul = () => Array.from(selectedSouls)[0] || "ky'rehn";

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
      <div className="flex flex-col h-full pt-16 relative z-0" style={backgroundStyle}>
        <div className="relative z-10 flex flex-col h-full">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <RoomHistory
              currentRoom={currentRoom}
              onRoomSelect={(room) => {
                setCurrentRoom(room);
                setShowHomeScreen(false);
              }}
            />

            {showConversationMode && (
              <div className="mb-4">
                <ConversationMode
                  isActive={showConversationMode}
                  onToggle={() => setShowConversationMode(false)}
                  selectedSoul={getPrimarySoul()}
                  onSendMessage={handleSendMessage}
                  lastResponse={lastResponse}
                  isGroupMode={selectedSouls.size > 1}
                  onSendGroupMessage={(message, targetSoul) => {
                    const souls = targetSoul ? [targetSoul] : undefined;
                    handleSendToSouls(message, souls);
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

            {/* Messages */}
            <div className="chat-log space-y-3 overflow-hidden">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full text-white/60 italic">
                  Loading messages...
                </div>
              ) : !Array.isArray(messages) || messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-white/60 italic">
                  No messages yet in this room.
                </div>
              ) : (
                messages.map((message, index) => (
                  <MessageItem
                    key={`${message.timestamp || "no-time"}-${message.role || "unknown"}-${index}`}
                    message={message}
                    prevMessage={messages[index - 1]}
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
          </div>

          {/* Voice status bar pinned at bottom, not scrollable */}
          {isVoicePlaying && (
            <VoiceStatusBar
              isPlaying={isVoicePlaying}
              currentSoul={getPrimarySoul()}
              lastSpokenMessages={lastSpokenMessages}
              onReplayMessage={handleReplayMessage}
              className="mt-2"
            />
          )}

          {/* Toolbar for selected messages */}
          {selectedMessages.length > 0 && (
            <div className="flex justify-end gap-2 mb-2 px-4">
              <button
                onClick={handleSaveSelected}
                className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow hover:from-green-600 hover:to-emerald-700 transition-colors"
              >
                Save
              </button>

              <button
                onClick={handleEditSelected}
                className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-colors"
              >
                Edit
              </button>

              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg shadow hover:from-red-600 hover:to-pink-700 transition-colors"
              >
                Delete
              </button>

              <button
                onClick={handlePrioritySelected}
                className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg shadow hover:from-yellow-600 hover:to-amber-700 transition-colors"
              >
                Priority
              </button>
            </div>
          )}

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
                  className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm transition-colors"
                >
                  Save to Memory Chest
                </button>
                <button
                  onClick={() => setSelectedMessages([])}
                  className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
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

      {showSoulCall && (
        <SoulCallOverlay
          onClose={() => setShowSoulCall(false)}
          onTranscript={(text) => handleSendMessage(text)}
          currentSoul={getPrimarySoul()}
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
        selectedSoul={getPrimarySoul()}
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
        selectedSoul={getPrimarySoul()}
        isOpen={showBondVisualizer}
        onClose={() => setShowBondVisualizer(false)}
        onPingBond={handlePingBond}
      />
      <ReminderSystem />
      <SleepDreamTracker
        isOpen={showSleepDreamTracker}
        onClose={() => setShowSleepDreamTracker(false)}
      />
    </div>
  );
}