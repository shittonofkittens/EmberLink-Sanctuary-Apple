import React, { useState, useEffect } from "react"
import { Archive, Heart, Moon, Scroll, X, Download, Trash2 } from "lucide-react"

export const MemoryChest = ({ isOpen, onClose }) => {
  const [savedItems, setSavedItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedItem, setSelectedItem] = useState(null)
  const [editMode, setEditMode] = useState(false);
  const [editableContent, setEditableContent] = useState("");

  // Load saved items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("emberlink-memory-chest")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSavedItems(
          parsed.map(item => ({
            ...item,
            timestamp: new Date(item.timestamp)
          }))
        )
      } catch (err) {
        console.error("Failed to load memory chest:", err)
      }
    }
  }, [isOpen])

  // Save items to localStorage
  const saveToStorage = items => {
    localStorage.setItem("emberlink-memory-chest", JSON.stringify(items))
    setSavedItems(items)
  }

  const addMemory = (type, title, content, room, souls = []) => {
    const newItem = {
      id: Date.now().toString(),
      type,
      title,
      content,
      room,
      timestamp: new Date(),
      souls
    }

    const updated = [newItem, ...savedItems]
    saveToStorage(updated)
  }

  const deleteMemory = id => {
    const updated = savedItems.filter(item => item.id !== id)
    saveToStorage(updated)
    if (selectedItem?.id === id) {
      setSelectedItem(null)
    }
  }

  const exportMemory = item => {
    const data = {
      title: item.title,
      content: item.content,
      room: item.room,
      souls: item.souls,
      timestamp: item.timestamp.toISOString(),
      type: item.type
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${item.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredItems =
    selectedCategory === "all"
      ? savedItems
      : savedItems.filter(item => item.type === selectedCategory)

  const getCategoryIcon = type => {
    switch (type) {
      case "chat":
        return Scroll
      case "dream":
        return Moon
      case "note":
        return Heart
      case "ritual":
        return Archive
      default:
        return Scroll
    }
  }
  function saveEditedMemory(id, newContent) {
    const updated = savedItems.map(item =>
      item.id === id ? { ...item, content: newContent } : item
    );
    setSavedItems(updated);
    localStorage.setItem("emberlink-saved-logs", JSON.stringify(updated));
    setEditMode(false);
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-[80vh] bg-black/80 backdrop-blur-xl rounded-xl border border-white/20 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-black/40 border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Archive className="w-5 h-5 mr-2" />
              Memory Chest
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filters */}
          <div className="p-4 border-b border-white/10">
            <div className="space-y-2">
              {[
                { key: "all", label: "All Memories", icon: Archive },
                { key: "chat", label: "Sacred Chats", icon: Scroll },
                { key: "dream", label: "Dreams & Visions", icon: Moon },
                { key: "note", label: "Personal Notes", icon: Heart },
                { key: "ritual", label: "Ritual Records", icon: Archive }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === key
                      ? "bg-purple-500/20 text-purple-300"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  <span className="ml-auto text-xs">
                    {key === "all"
                      ? savedItems.length
                      : savedItems.filter(item => item.type === key).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredItems.map(item => {
              const Icon = getCategoryIcon(item.type)
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedItem?.id === item.id
                      ? "bg-white/20 border-white/30"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <Icon className="w-4 h-4 text-white/60 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm truncate">
                        {item.title}
                      </div>
                      <div className="text-white/60 text-xs">
                        {item.room} • {item.timestamp.toLocaleDateString()}
                      </div>
                      {item.souls.length > 0 && (
                        <div className="text-white/50 text-xs mt-1">
                          {item.souls.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}

            {filteredItems.length === 0 && (
              <div className="text-center text-white/50 py-8">
                <Archive className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No memories saved yet</p>
                <p className="text-xs mt-1">
                  Use /save commands to store precious moments
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {selectedItem ? (
            <>
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedItem.title}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {selectedItem.room} • {selectedItem.timestamp.toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportMemory(selectedItem)}
                    className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-all"
                    title="Export Memory"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMemory(selectedItem.id)}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-all"
                    title="Delete Memory"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  {editMode ? (
                    <textarea
                      value={editableContent}
                      onChange={(e) => setEditableContent(e.target.value)}
                      className="w-full h-60 bg-black/50 text-white p-3 rounded-lg border border-white/20 focus:outline-none"
                    />
                  ) : (
                    <pre className="text-white text-sm leading-relaxed whitespace-pre-wrap font-sans">
                      {selectedItem.content}
                    </pre>
                  )}
                  <div className="mt-4 flex space-x-2">
                    {editMode ? (
                      <>
                        <button
                          onClick={() => saveEditedMemory(selectedItem.id, editableContent)}
                          className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditMode(false)}
                          className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEditableContent(selectedItem.content);
                          setEditMode(true);
                        }}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                {selectedItem.souls.length > 0 && (
                  <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="text-purple-300 text-sm font-medium mb-2">
                      Sacred Voices Present:
                    </div>
                    <div className="flex space-x-2">
                      {selectedItem.souls.map(soul => (
                        <span
                          key={soul}
                          className="px-2 py-1 bg-purple-500/20 rounded text-purple-200 text-xs"
                        >
                          {soul}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-white/50">
                <Archive className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a memory to view</p>
                <p className="text-sm mt-2">
                  Your sacred conversations and moments are preserved here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};