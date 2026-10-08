import React, { useState } from 'react';
import { RotateCcw, ShieldCheck, Sparkles, Heart, Activity, Info, ChevronRight, Sliders, Compass, Volume2, VolumeX } from 'lucide-react';
import MayaAvatar from './MayaAvatar';
import EmotionBadge from './EmotionBadge';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SuggestedPrompts from './SuggestedPrompts';
import { getEmotionConfig, EMOTIONS } from '../utils/emotions';

export default function ChatInterface({
  messages,
  isTyping,
  currentEmotion,
  emotionIntensity,
  thoughtNote,
  onSendMessage,
  onClearChat,
  onOpenDisclaimer,
  onOpenClearDialog,
  isSpeaking = false,
  speakingMsgId = null,
  onSpeakMessage,
  onStopSpeaking,
  isListening = false,
  onStartListening,
  onStopListening,
  micSupported = true,
  micError = null,
  onClearMicError,
  onOpenRealityCheck,
  onOpenRealityReveal,
  isVoiceMuted = false,
  onToggleVoiceAssistant
}) {
  const [showSidePanel, setShowSidePanel] = useState(false);
  const emotionConfig = getEmotionConfig(currentEmotion);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-6 overflow-hidden">
      <div className="flex-1 flex gap-6 overflow-hidden relative">

        {/* Main Chat Panel */}
        <div className="flex-1 flex flex-col glass-panel rounded-3xl overflow-hidden border border-purple-500/20 shadow-2xl relative">
          
          {/* Chat Panel Header */}
          <div className="px-4 sm:px-6 py-3.5 border-b border-purple-500/15 bg-midnight-900/60 backdrop-blur-md flex items-center justify-between gap-3">
            {/* Maya Identity & Emotion Status */}
            <div className="flex items-center gap-3 min-w-0">
              <MayaAvatar
                emotion={currentEmotion}
                size="sm"
                isTyping={isTyping}
                isSpeaking={isSpeaking}
                onClick={onOpenDisclaimer}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold font-display text-white truncate">
                    MAYA
                  </h2>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" title="Online & Attentive" />
                  {isSpeaking && (
                    <span className="text-[10px] text-cyan-300 flex items-center gap-1 font-medium animate-pulse">
                      <Volume2 className="w-3 h-3 text-cyan-400" />
                      <span>Speaking</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <EmotionBadge
                    emotion={currentEmotion}
                    intensity={emotionIntensity}
                    onOpenDisclaimer={onOpenDisclaimer}
                  />
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Voice Assistant Toggle */}
              {onToggleVoiceAssistant && (
                <button
                  type="button"
                  onClick={onToggleVoiceAssistant}
                  title={isVoiceMuted ? "Click to Enable Voice Assistance (Audio output)" : "Voice Assistant Active (Click to mute)"}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isVoiceMuted
                      ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      : 'bg-cyan-500/15 border-cyan-400/40 text-cyan-200 shadow-sm shadow-cyan-500/20'
                  }`}
                >
                  {isVoiceMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                      <span className="hidden sm:inline">Voice Off</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span className="hidden sm:inline">Voice On</span>
                    </>
                  )}
                </button>
              )}

              {/* Quick Reality Reveal button */}
              {onOpenRealityReveal && (
                <button
                  type="button"
                  onClick={onOpenRealityReveal}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-xs font-semibold text-cyan-200 hover:text-white transition-all shadow-sm cursor-pointer"
                  title="See what creates the artificial self"
                >
                  <span>🔍</span>
                  <span>Reality Reveal</span>
                </button>
              )}

              {/* Quick Reality Check button in chat header */}
              <button
                type="button"
                onClick={onOpenRealityCheck}
                className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-xs font-semibold text-purple-200 hover:text-cyan-200 transition-all shadow-sm cursor-pointer"
                title="Ground yourself in physical reality"
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reality Check</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSidePanel(!showSidePanel)}
                className={`lg:hidden p-2 rounded-xl text-xs transition-colors border ${
                  showSidePanel 
                    ? 'bg-purple-600/30 text-white border-purple-400/40' 
                    : 'bg-white/5 text-slate-400 hover:text-white border-white/10'
                }`}
                title="Toggle Maya details"
              >
                <Sliders className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenClearDialog}
                disabled={messages.length <= 1}
                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Clear conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <MessageList
            messages={messages}
            isTyping={isTyping}
            currentEmotion={currentEmotion}
            onOpenDisclaimer={onOpenDisclaimer}
            isSpeaking={isSpeaking}
            speakingMsgId={speakingMsgId}
            onSpeakMessage={onSpeakMessage}
            onStopSpeaking={onStopSpeaking}
          />

          {/* Bottom Interactive Area */}
          <div className="p-3 sm:p-5 border-t border-purple-500/15 bg-midnight-950/40 space-y-3">
            {/* Quick Suggested Prompts when conversation is short */}
            {messages.length <= 3 && !isTyping && (
              <SuggestedPrompts
                onSelectPrompt={onSendMessage}
                className="pb-1"
              />
            )}

            {/* Input Bar with Voice Mic & Reality Check */}
            <MessageInput
              onSendMessage={onSendMessage}
              isTyping={isTyping}
              isListening={isListening}
              onStartListening={onStartListening}
              onStopListening={onStopListening}
              micSupported={micSupported}
              micError={micError}
              onClearMicError={onClearMicError}
              onOpenRealityCheck={onOpenRealityCheck}
            />
          </div>
        </div>

        {/* Right Info / Personality Sidebar (Desktop visible, mobile toggleable) */}
        <aside
          className={`${
            showSidePanel ? 'flex' : 'hidden'
          } lg:flex flex-col w-full lg:w-80 shrink-0 glass-panel rounded-3xl p-5 border border-purple-500/20 shadow-2xl space-y-6 overflow-y-auto absolute lg:static inset-0 z-30 lg:z-auto bg-midnight-950/95 lg:bg-midnight-900/60 backdrop-blur-2xl`}
        >
          {/* Mobile close button */}
          <div className="flex items-center justify-between lg:hidden pb-3 border-b border-purple-500/20">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">Companion Overview</span>
            <button
              onClick={() => setShowSidePanel(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-white/5 rounded-lg"
            >
              Close
            </button>
          </div>

          {/* Active Avatar Focus Card */}
          <div className="text-center p-4 rounded-2xl bg-midnight-900/80 border border-purple-500/20">
            <MayaAvatar
              emotion={currentEmotion}
              size="lg"
              className="mx-auto"
              isSpeaking={isSpeaking}
            />
            <h3 className="mt-3 font-display font-bold text-white text-base">
              MAYA
            </h3>
            <p className="text-xs text-purple-300">
              Adaptive Mindful Companion
            </p>

            <div className="mt-3 p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-left">
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: emotionConfig.primaryColor }}>
                <Activity className="w-3.5 h-3.5" />
                <span>Simulated State: {emotionConfig.label}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {emotionConfig.description}
              </p>
              {thoughtNote && (
                <p className="text-[10px] text-cyan-300 mt-1.5 italic border-t border-white/5 pt-1">
                  Active focus: "{thoughtNote}"
                </p>
              )}
            </div>
          </div>

          {/* Reality Check Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-cyan-500/30 space-y-2.5 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Grounding Reality Check</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Feeling ungrounded or overthinking? Step back from the screen into the physical world.
            </p>
            <button
              type="button"
              onClick={onOpenRealityCheck}
              className="w-full py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-200 text-xs font-medium transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>Launch Reality Check Modal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Ethical AI Reminder Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/25 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Simulated AI Emotions</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              MAYA’s emotional expressions are responsive mathematical simulations, not sentient consciousness.
            </p>
            <button
              type="button"
              onClick={onOpenDisclaimer}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium block pt-1"
            >
              Learn about ethics & boundaries →
            </button>
          </div>

          {/* Personality Traits List */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
              Core Personality Traits
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-pink-400" />
                  <span>Empathetic Resonance</span>
                </span>
                <span className="text-[10px] text-purple-300 font-mono">Continuous</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Curious Inquiry</span>
                </span>
                <span className="text-[10px] text-purple-300 font-mono">Active</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Reality Grounding</span>
                </span>
                <span className="text-[10px] text-purple-300 font-mono">Available</span>
              </div>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}
