import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'maya_chat_history_v1';

const INITIAL_MESSAGE = {
  id: 'msg-welcome',
  sender: 'maya',
  text: "Hello! I'm **MAYA**, your thoughtful AI companion. I'm here to listen, explore questions, share reflections, or simply offer a calm presence. How are you feeling today?",
  emotion: 'warm',
  intensity: 0.9,
  thoughtNote: 'Welcoming you with presence and gentle warmth.',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export function useChat() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to read messages from localStorage:', e);
    }
    return [INITIAL_MESSAGE];
  });

  const [currentEmotion, setCurrentEmotion] = useState(() => {
    const lastMayaMsg = [...messages].reverse().find(m => m.sender === 'maya');
    return lastMayaMsg?.emotion || 'warm';
  });

  const [emotionIntensity, setEmotionIntensity] = useState(0.85);
  const [thoughtNote, setThoughtNote] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save messages to localStorage:', e);
    }
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    if (!text || !text.trim() || isTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsTyping(true);
    setError(null);

    try {
      let response;
      try {
        response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            history: newMessages.map(m => ({ sender: m.sender, text: m.text }))
          }),
        });
      } catch (proxyErr) {
        // Fallback to direct backend address if proxy fails
        console.warn('Relative /api/chat failed, trying http://127.0.0.1:5000/api/chat direct:', proxyErr);
        response = await fetch('http://127.0.0.1:5000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            history: newMessages.map(m => ({ sender: m.sender, text: m.text }))
          }),
        });
      }

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const resData = await response.json();
      if (!resData.success || !resData.data) {
        throw new Error(resData.error || 'Invalid response from server');
      }

      const data = resData.data;
      const mayaReply = {
        id: `maya-${Date.now()}`,
        sender: 'maya',
        text: data.reply || "I'm listening and with you.",
        emotion: data.emotion || 'thoughtful',
        intensity: typeof data.intensity === 'number' ? data.intensity : 0.85,
        thoughtNote: data.thoughtNote || 'Reflecting on your words.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, mayaReply]);
      setCurrentEmotion(mayaReply.emotion);
      setEmotionIntensity(mayaReply.intensity);
      setThoughtNote(mayaReply.thoughtNote);
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message);

      // Add a graceful error response from Maya
      const fallbackReply = {
        id: `maya-err-${Date.now()}`,
        sender: 'maya',
        text: "I'm experiencing a momentary connection pause with my thinking engine. I'm right here with you though—could you try sending your thought again in a moment?",
        emotion: 'calm',
        intensity: 0.7,
        thoughtNote: 'Maintaining connection stability.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackReply]);
      setCurrentEmotion('calm');
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping]);

  const clearChat = useCallback(() => {
    const freshGreeting = {
      ...INITIAL_MESSAGE,
      id: `msg-welcome-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([freshGreeting]);
    setCurrentEmotion('warm');
    setEmotionIntensity(0.9);
    setThoughtNote(freshGreeting.thoughtNote);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    messages,
    isTyping,
    currentEmotion,
    emotionIntensity,
    thoughtNote,
    error,
    sendMessage,
    clearChat
  };
}
