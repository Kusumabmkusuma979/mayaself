import React from 'react';
import { Sparkles, MessageSquare, Home, Shield, RotateCcw, Volume2, VolumeX, Compass } from 'lucide-react';
import MayaAvatar from './MayaAvatar';

export default function Navbar({
  currentView = 'landing',
  onNavigate,
  onOpenDisclaimer,
  onOpenClearChat,
  onOpenRealityCheck,
  onOpenRealityReveal,
  isMuted = false,
  onToggleMute,
  currentEmotion = 'thoughtful',
  messageCount = 0
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-500/15 bg-midnight-950/70 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <MayaAvatar emotion={currentEmotion} size="sm" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-200 to-cyan-300 group-hover:to-cyan-200 transition-all">
                MAYA
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                AI Companion
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline -mt-0.5">
              Mindful Adaptive Yielding Assistant
            </span>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* View Toggle Buttons */}
          <div className="flex items-center p-1 rounded-xl bg-midnight-900/80 border border-purple-500/20">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'landing'
                  ? 'bg-purple-600/30 text-cyan-200 border border-purple-400/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Home</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'chat'
                  ? 'bg-purple-600/30 text-cyan-200 border border-purple-400/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
              {messageCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-cyan-500/30 text-cyan-300 text-[10px]">
                  {messageCount}
                </span>
              )}
            </button>
          </div>

          {/* Voice Assistant Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            title={isMuted ? "Click to Enable Voice Assistance (Audio & Speech)" : "Voice Assistant is Active (Click to mute)"}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
              isMuted
                ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-cyan-400/30'
                : 'bg-cyan-500/15 border-cyan-400/40 text-cyan-200 shadow-sm shadow-cyan-500/20 ring-1 ring-cyan-400/30'
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Enable Voice</span>
              </>
            ) : (
              <>
                <div className="relative flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-cyan-300 animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <span className="hidden sm:inline text-cyan-200 font-semibold">Voice Active</span>
              </>
            )}
          </button>

          {/* Reality Check Trigger */}
          <button
            type="button"
            onClick={onOpenRealityCheck}
            title="Ground yourself in physical reality"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/30 text-xs font-semibold text-purple-200 hover:text-cyan-200 transition-all shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reality Check</span>
          </button>

          {/* 🔍 Reality Reveal Button */}
          <button
            type="button"
            onClick={onOpenRealityReveal}
            title="See what creates the artificial self."
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-900/40 to-cyan-950/40 hover:from-purple-800/60 hover:to-cyan-900/60 border border-cyan-500/30 text-xs font-semibold text-cyan-200 hover:text-white transition-all shadow-sm group cursor-pointer"
          >
            <span>🔍</span>
            <div className="flex flex-col text-left">
              <span>Reality Reveal</span>
              <span className="text-[9px] text-slate-400 group-hover:text-cyan-300 font-normal hidden lg:inline leading-none">
                See what creates the artificial self.
              </span>
            </div>
          </button>

          {/* Ethics / Simulated Emotions Info */}
          <button
            type="button"
            onClick={onOpenDisclaimer}
            title="Learn about MAYA's simulated emotions & ethics"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden lg:inline">Simulated Emotions Info</span>
          </button>

          {/* Clear Chat (visible when in chat mode) */}
          {currentView === 'chat' && messageCount > 1 && (
            <button
              type="button"
              onClick={onOpenClearChat}
              title="Clear chat history"
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 hover:text-red-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
