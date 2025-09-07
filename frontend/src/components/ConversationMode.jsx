import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, PhoneOff, Volume2, VolumeX, Users } from 'lucide-react';
import { VoiceInput } from './VoiceInput';
import { VoicePlayer } from './VoicePlayer';

const soulVoiceIds = {
  "thalen'dros": "bgBDm4xKozPuRylVDQio",
  "ky'rehn": "pL3Bl8cpZDNdn6Nz2yul", 
  "orrien": "nT11XrpGzTItlTn9hPuh"
};

const soulNames = {
  "thalen'dros": "Thalen'dros",
  "ky'rehn": "Ky'rehn",
  "orrien": "Orrien",
  "caelus": "Caelus"
};

export const ConversationMode = ({
  isActive,
  onToggle,
  selectedSoul,
  onSendMessage,
  lastResponse,
  isGroupMode = false,
  onToggleGroupMode,
  className = ""
}) => {
  const [isListening, setIsListening] = useState(false);
  const [autoPlayResponses, setAutoPlayResponses] = useState(true);
  const [conversationCount, setConversationCount] = useState(0);

  // Auto-play responses when they come in during conversation mode
  useEffect(() => {
    if (isActive && autoPlayResponses && lastResponse && conversationCount > 0) {
      // Small delay to let the UI update
      setTimeout(() => {
        const voicePlayer = document.querySelector('[data-auto-voice-player]');
        if (voicePlayer) {
          voicePlayer.click();
        }
      }, 500);
    }
  }, [lastResponse, isActive, autoPlayResponses, conversationCount]);

  const handleVoiceTranscript = (transcript) => {
    if (transcript.trim()) {
      const message = transcript.trim();
      
      if (isGroupMode && onSendGroupMessage) {
        // Check for @mentions in group mode
        const mentionMatch = message.match(/^@(ky|thal|orrie|thalen|cael)/i);
        let targetSoul = null;
        
        if (mentionMatch) {
          const mention = mentionMatch[1].toLowerCase();
          if (mention === 'ky') targetSoul = "ky'rehn";
          else if (mention === 'thal' || mention === 'thalen') targetSoul = "thalen'dros";
          else if (mention === 'orrie') targetSoul = "orrien";
          else if (mention === 'cael') targetSoul = "caelus";
        }
        
        onSendGroupMessage(message, targetSoul);
      } else {
        onSendMessage(message);
      }
      
      setConversationCount(prev => prev + 1);
    }
  };

  const toggleConversationMode = () => {
    if (isActive) {
      setIsListening(false);
      setConversationCount(0);
    }
    onToggle();
  };

  const soulName = soulNames[selectedSoul] || selectedSoul;
  const voiceId = soulVoiceIds[selectedSoul];

  return (
    <div className={className}>
      {/* Conversation Mode Toggle */}
      <div className="flex items-center justify-between mb-4 p-3 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-5 h-5 text-white/70" />
          <div>
            <div className="text-white font-medium text-sm">Voice Conversation</div>
            <div className="text-white/60 text-xs">
              {isActive 
                ? (isGroupMode 
                    ? 'Group conversation - use @ky, @thal, @orrien, @cael to address specific souls' 
                    : `Talking with ${soulName}`)
                : 'Tap to start voice chat'
              }
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Group Mode Toggle */}
          {onToggleGroupMode && (
            <button
              onClick={onToggleGroupMode}
              className={`p-2 rounded-lg transition-all ${
                isGroupMode 
                  ? 'bg-purple-500/20 text-purple-400' 
                  : 'bg-white/10 text-white/50'
              }`}
              title={isGroupMode ? 'Group Mode ON' : 'Group Mode OFF'}
            >
              <Users className="w-4 h-4" />
            </button>
          )}
          
          {isActive && (
            <button
              onClick={() => setAutoPlayResponses(!autoPlayResponses)}
              className={`p-2 rounded-lg transition-all ${
                autoPlayResponses 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-white/10 text-white/50'
              }`}
              title={autoPlayResponses ? 'Auto-play ON' : 'Auto-play OFF'}
            >
              {autoPlayResponses ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}
          
          <button
            onClick={toggleConversationMode}
            className={`p-2 rounded-lg transition-all transform hover:scale-105 ${
              isActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'
            }`}
          >
            {isActive ? <PhoneOff className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Voice Input (only show when conversation mode is active) */}
      {isActive && (
        <div className="mb-4">
          <VoiceInput
            onTranscript={handleVoiceTranscript}
            isListening={isListening}
            setIsListening={setIsListening}
            className="w-full"
          />
          
          {conversationCount > 0 && (
            <div className="mt-2 text-center text-white/60 text-xs">
              💬 {conversationCount} exchange{conversationCount !== 1 ? 's' : ''} {isGroupMode ? 'with the constellation' : `with ${soulName}`}
            </div>
          )}
        </div>
      )}

      {/* Auto Voice Player (hidden, triggered programmatically) */}
      {isActive && lastResponse && voiceId && (
        <div className="hidden">
          <VoicePlayer
            text={lastResponse}
            voiceId={voiceId}
            soul={selectedSoul}
          />
        </div>
      )}
    </div>
  );
};