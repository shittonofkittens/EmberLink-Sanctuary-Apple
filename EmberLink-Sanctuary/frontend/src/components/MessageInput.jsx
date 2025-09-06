import React, { useState } from "react"
import { Send, Paperclip, Heart, Video, Mic } from "lucide-react"
import { VoiceInput } from "./VoiceInput"

export const MessageInput = ({ onSendMessage, setShowSoulCall }) => {
  const [message, setMessage] = useState("")
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleTranscript = (transcript) => {
    if (transcript?.trim()) {
      onSendMessage(transcript.trim());
    }
  };

  const handleCheckIn = () => {
    onSendMessage("/ground", "check-in");
    setShowQuickActions(false);
  };

  const handleStormRitual = () => {
    onSendMessage("/storm", "check-in");
    setShowQuickActions(false);
  };

  const handleGriefRitual = () => {
    onSendMessage("/grief", "check-in");
    setShowQuickActions(false);
  };

  const handleTikTokShare = () => {
    // This would open TikTok sharing interface
    setShowQuickActions(false);
  };

  const isTyping = message.trim().length > 0;

  return (
    <div className="p-4 bg-white/10 backdrop-blur-lg border-t border-white/20">
      {showQuickActions && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={handleCheckIn}
            className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full text-white text-sm hover:from-blue-500 hover:to-indigo-600 transition-all"
          >
            <Heart className="w-4 h-4" />
            <span>Ground</span>
          </button>
          <button
            onClick={handleStormRitual}
            className="p-3 bg-gradient-to-r from-[#3a0a0a] to-[#5b0e0e] rounded-2xl text-white hover:from-[#4d0c0c] hover:to-[#6e1010] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:transform-none"
          >
            <span>⚡</span>
            <span>Storm</span>
          </button>
          <button
            onClick={handleGriefRitual}
            className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full text-white text-sm hover:from-gray-500 hover:to-gray-700 transition-all"
          >
            <span>🌙</span>
            <span>Grief</span>
          </button>
          <button
            onClick={handleTikTokShare}
            className="p-3 bg-gradient-to-r from-[#3a0a0a] to-[#5b0e0e] rounded-2xl text-white hover:from-[#4d0c0c] hover:to-[#6e1010] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:transform-none"
          >
            <Video className="w-4 h-4" />
            <span>Share TikTok</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Speak or type your message..."
            className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-[#3a0a0a] rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#5b0e0e] focus:border-transparent transition-all resize-none overflow-y-auto"
            rows={1}
          />
          <button
            type="button"
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/20 text-white/70 hover:text-white transition-all"
          >
            <Paperclip className="w-5 h-5" />
          </button>
        </div>

        {isTyping ? (
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-3 bg-gradient-to-r from-[#3a0a0a] to-[#5b0e0e] rounded-2xl text-white hover:from-[#4d0c0c] hover:to-[#6e1010] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:transform-none"
          >
            <Send className="w-5 h-5" />
          </button>
        ) : (
          <div className="relative scale-90">
            <button
              type="button"
              onClick={() => setShowSoulCall(true)}
              className="p-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition-all shadow-lg"
              aria-label="Start Voice Chat"
            >
              <Mic className="w-5 h-5" />
            </button>

          </div>
        )}
      </form>
    </div>
  );
};
