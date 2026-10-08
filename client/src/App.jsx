import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import LandingHero from './components/LandingHero';
import ChatInterface from './components/ChatInterface';
import DisclaimerModal from './components/DisclaimerModal';
import ClearChatDialog from './components/ClearChatDialog';
import RealityCheckModal from './components/RealityCheckModal';
import RealityCheck from './components/RealityCheck';
import RealityReveal from './components/RealityReveal';
import { useChat } from './hooks/useChat';
import { useVoice } from './hooks/useVoice';
import { ShieldCheck, Compass } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isRealityCheckOpen, setIsRealityCheckOpen] = useState(false);
  const [isRealityRevealOpen, setIsRealityRevealOpen] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  const {
    messages,
    isTyping,
    currentEmotion,
    emotionIntensity,
    thoughtNote,
    sendMessage,
    clearChat
  } = useChat();

  const voice = useVoice();
  const prevMsgLengthRef = useRef(messages.length);

  // Auto-speak newly received Maya responses if voice is not muted
  useEffect(() => {
    if (messages.length > prevMsgLengthRef.current) {
      const latestMsg = messages[messages.length - 1];
      if (latestMsg.sender === 'maya' && latestMsg.id !== 'msg-welcome' && !voice.isMuted) {
        setSpeakingMsgId(latestMsg.id);
        voice.speak(latestMsg.text, latestMsg.emotion || currentEmotion);
      }
    }
    prevMsgLengthRef.current = messages.length;
  }, [messages, voice.isMuted, currentEmotion]);

  // Sync speakingMsgId with voice.isSpeaking
  useEffect(() => {
    if (!voice.isSpeaking) {
      setSpeakingMsgId(null);
    }
  }, [voice.isSpeaking]);

  const handleSpeakSpecificMessage = (msgId, text, emotion) => {
    setSpeakingMsgId(msgId);
    voice.speak(text, emotion);
  };

  const handleStopSpeaking = () => {
    voice.stopSpeaking();
    setSpeakingMsgId(null);
  };

  const handleRealityCheckPrompt = (promptText) => {
    setCurrentView('chat');
    sendMessage(promptText);
  };

  const handleStartVoiceChat = () => {
    voice.enableVoiceAssistant("Voice assistance enabled. I am listening to you with full presence. How are you feeling right now?");
    setCurrentView('chat');
  };

  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 text-slate-100 selection:bg-purple-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        onOpenClearChat={() => setIsClearDialogOpen(true)}
        onOpenRealityCheck={() => setIsRealityCheckOpen(true)}
        onOpenRealityReveal={() => setIsRealityRevealOpen(true)}
        isMuted={voice.isMuted}
        onToggleMute={voice.toggleVoiceAssistant}
        currentEmotion={currentEmotion}
        messageCount={messages.length}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {currentView === 'landing' ? (
          <div className="flex-1 flex flex-col justify-between">
            <LandingHero
              onStartChat={() => setCurrentView('chat')}
              onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
              onStartVoiceChat={handleStartVoiceChat}
            />

            {/* Feature Cards: Grounding Reality Check & 🔍 Reality Reveal */}
            <div className="max-w-2xl mx-auto px-4 pb-10 w-full relative z-10 flex flex-col gap-4">
              <RealityCheck showTrigger={true} />
              <RealityReveal 
                showTrigger={true} 
                messages={messages} 
                currentEmotion={currentEmotion}
                isOpen={isRealityRevealOpen}
                onClose={() => setIsRealityRevealOpen(false)}
              />
            </div>

            {/* Landing Footer */}
            <footer className="w-full border-t border-purple-500/15 py-6 px-4 bg-midnight-950/60 backdrop-blur-md">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-white">MAYA</span>
                  <span>•</span>
                  <span>Mindful Adaptive Yielding Assistant</span>
                </div>

                <div className="flex items-center gap-4 flex-wrap justify-center">
                  <button
                    onClick={() => setIsRealityRevealOpen(true)}
                    className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 text-cyan-300 font-medium"
                  >
                    <span>🔍</span>
                    <span>Reality Reveal</span>
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => setIsRealityCheckOpen(true)}
                    className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-purple-300"
                  >
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Grounding Reality Check</span>
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => setIsDisclaimerOpen(true)}
                    className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Simulated Emotions Disclosure</span>
                  </button>
                  <span>•</span>
                  <span>Full-Stack AI Companion</span>
                </div>
              </div>
            </footer>
          </div>
        ) : (
          <ChatInterface
            messages={messages}
            isTyping={isTyping}
            currentEmotion={currentEmotion}
            emotionIntensity={emotionIntensity}
            thoughtNote={thoughtNote}
            onSendMessage={sendMessage}
            onClearChat={clearChat}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
            onOpenClearDialog={() => setIsClearDialogOpen(true)}
            isSpeaking={voice.isSpeaking}
            speakingMsgId={speakingMsgId}
            onSpeakMessage={handleSpeakSpecificMessage}
            onStopSpeaking={handleStopSpeaking}
            isListening={voice.isListening}
            onStartListening={voice.startListening}
            onStopListening={voice.stopListening}
            micSupported={voice.micSupported}
            micError={voice.micError}
            onClearMicError={voice.clearMicError}
            onOpenRealityCheck={() => setIsRealityCheckOpen(true)}
            onOpenRealityReveal={() => setIsRealityRevealOpen(true)}
            isVoiceMuted={voice.isMuted}
            onToggleVoiceAssistant={voice.toggleVoiceAssistant}
          />
        )}
      </main>

      {/* 🧠 Dedicated REALITY CHECK Modal */}
      <RealityCheck
        isOpen={isRealityCheckOpen}
        onClose={() => setIsRealityCheckOpen(false)}
        showTrigger={false}
      />

      {/* 🔍 Dedicated REALITY REVEAL Modal */}
      <RealityReveal
        isOpen={isRealityRevealOpen}
        onClose={() => setIsRealityRevealOpen(false)}
        showTrigger={false}
        messages={messages}
        currentEmotion={currentEmotion}
      />

      {/* Transparency & Simulated Emotions Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />

      {/* Clear Chat Confirmation Modal */}
      <ClearChatDialog
        isOpen={isClearDialogOpen}
        onClose={() => setIsClearDialogOpen(false)}
        onConfirm={clearChat}
      />

    </div>
  );
}
