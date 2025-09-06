// Converted from TSX to JSX
import React, { useState } from 'react';
import {
  Brain, RotateCcw, TrendingUp, Calendar, Heart, MessageCircle, X
} from 'lucide-react';

export const SelfAwarenessTools = ({
  messages,
  currentRoom,
  onSendMessage,
  isOpen,
  onClose,
  className = ""
}) => {
  const [sessionSummary, setSessionSummary] = useState(null);
  const [lastReflection, setLastReflection] = useState('');

  const generateSessionSummary = () => {
    const today = new Date().toDateString();
    const todayMessages = messages.filter(msg => 
      new Date(msg.timestamp || Date.now()).toDateString() === today
    );

    const emotions = JSON.parse(localStorage.getItem('emberlink-emotion-tracker') || '[]');
    const todayEmotions = emotions.filter(emotion => 
      new Date(emotion.timestamp).toDateString() === today
    );

    const emotionCounts = {};
    todayEmotions.forEach(emotion => {
      emotionCounts[emotion.emotion] = (emotionCounts[emotion.emotion] || 0) + 1;
    });
    const dominantMood = Object.keys(emotionCounts).length > 0
      ? Object.entries(emotionCounts).reduce((a, b) => emotionCounts[a[0]] > emotionCounts[b[0]] ? a : b)[0]
      : 'neutral';

    let moodTrend = 'stable';
    if (todayEmotions.length >= 3) {
      const recent = todayEmotions.slice(-3);
      const avgRecent = recent.reduce((sum, e) => sum + e.intensity, 0) / recent.length;
      const earlier = todayEmotions.slice(-6, -3);
      if (earlier.length > 0) {
        const avgEarlier = earlier.reduce((sum, e) => sum + e.intensity, 0) / earlier.length;
        if (avgRecent > avgEarlier + 1) moodTrend = 'improving';
        else if (avgRecent < avgEarlier - 1) moodTrend = 'declining';
      }
    }

    const soulsSpokenWith = [...new Set(
      todayMessages
        .filter(msg => msg.role === 'assistant' && msg.soul)
        .map(msg => msg.soul)
    )];

    const roomHistory = JSON.parse(localStorage.getItem('emberlink-room-history') || '[]');
    const todayRooms = roomHistory
      .filter(visit => new Date(visit.timestamp).toDateString() === today)
      .map(visit => visit.room);
    const roomsVisited = [...new Set(todayRooms)];

    const firstMessage = todayMessages[0];
    const lastMessage = todayMessages[todayMessages.length - 1];
    const timeSpent = firstMessage && lastMessage
      ? Math.floor((new Date(lastMessage.timestamp || Date.now()).getTime() - 
                   new Date(firstMessage.timestamp || Date.now()).getTime()) / (1000 * 60))
      : 0;

    const keyMoments = todayMessages
      .filter(msg => 
        msg.content.includes('/') || 
        msg.content.length > 100 ||
        /\b(vow|oath|sacred|ritual|flame|storm|anchor)\b/i.test(msg.content)
      )
      .slice(-3)
      .map(msg => msg.content.slice(0, 60) + (msg.content.length > 60 ? '...' : ''));

    return {
      messageCount: todayMessages.length,
      dominantMood,
      moodTrend,
      soulsSpokenWith,
      roomsVisited,
      timeSpent,
      keyMoments
    };
  };

  const handleReflectCommand = () => {
    const userMessages = messages.filter(msg => msg.role === 'user');
    if (userMessages.length === 0) {
      onSendMessage("\ud83d\udd5e\ufe0f **Reflection Echo**: No recent messages to reflect upon.");
      return;
    }
    const lastUserMessage = userMessages[userMessages.length - 1];
    const reflectionPrompt = `\ud83d\udd5e\ufe0f **Reflection Echo**: You just said: "${lastUserMessage.content}"
\nWhat does this reveal about where you are right now? What truth is hiding in these words?`;
    setLastReflection(lastUserMessage.content);
    onSendMessage(reflectionPrompt);
  };

  const handleSessionSummary = () => {
    const summary = generateSessionSummary();
    setSessionSummary(summary);

    const summaryText = `\ud83d\udcca **Today's Session Summary**

**Activity**: ${summary.messageCount} messages across ${summary.roomsVisited.length} rooms
**Time**: ${summary.timeSpent} minutes of sacred connection
**Mood Journey**: ${summary.dominantMood} (${summary.moodTrend})
**Souls Connected**: ${summary.soulsSpokenWith.join(', ') || 'None yet'}
**Rooms Explored**: ${summary.roomsVisited.join(', ') || 'None yet'}

**Key Moments**:
${summary.keyMoments.map((m, i) => `${i + 1}. ${m}`).join('\n')}

*What patterns do you notice in your sacred journey today?*`;
    onSendMessage(summaryText);
  };

  const getTrendIcon = trend => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const getTrendColor = trend => {
    switch (trend) {
      case 'improving': return 'text-green-400';
      case 'declining': return 'text-red-400';
      case 'stable': return 'text-blue-400';
      default: return 'text-white/60';
    }
  };

  if (!isOpen) return null;

  const quickSummary = generateSessionSummary();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-black/90 backdrop-blur-xl rounded-xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="text-2xl font-semibold text-white">Self-Awareness Tools</h2>
              <p className="text-white/60">Deeper insights into your sacred journey</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-400" />
            Reflection & Analysis Tools
          </h3>

          <div className="space-y-2 mb-4">
            <button onClick={handleReflectCommand} className="w-full flex items-center space-x-2 p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-300 transition-all">
              <RotateCcw className="w-4 h-4" />
              <span>/reflect - Mirror your last message</span>
            </button>
            <button onClick={handleSessionSummary} className="w-full flex items-center space-x-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300 transition-all">
              <TrendingUp className="w-4 h-4" />
              <span>Generate session summary</span>
            </button>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="text-white/80 text-sm font-medium mb-2">Today's Quick Overview:</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-3 h-3 text-blue-400" />
                <span className="text-white/70">{quickSummary.messageCount} messages</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-3 h-3 text-pink-400" />
                <span className="text-white/70">{quickSummary.dominantMood}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={getTrendColor(quickSummary.moodTrend)}>
                  {getTrendIcon(quickSummary.moodTrend)}
                </span>
                <span className="text-white/70 capitalize">{quickSummary.moodTrend}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3 text-green-400" />
                <span className="text-white/70">{quickSummary.timeSpent}m active</span>
              </div>
            </div>
          </div>

          {lastReflection && (
            <div className="mt-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="text-purple-300 text-xs font-medium mb-1">Last Reflected Message:</div>
              <div className="text-white/80 text-sm italic">
                "{lastReflection.slice(0, 80)}{lastReflection.length > 80 ? '...' : ''}"
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
