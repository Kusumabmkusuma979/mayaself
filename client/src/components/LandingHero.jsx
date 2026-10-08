import React, { useState } from 'react';
import { Sparkles, MessageSquare, ShieldCheck, Heart, Cpu, ArrowRight, Activity } from 'lucide-react';
import MayaAvatar from './MayaAvatar';
import { EMOTIONS } from '../utils/emotions';

export default function LandingHero({ onStartChat, onOpenDisclaimer, onStartVoiceChat }) {
  const [previewEmotion, setPreviewEmotion] = useState('warm');
  const activeEmotionConfig = EMOTIONS[previewEmotion] || EMOTIONS.warm;

  return (
    <div className="relative overflow-hidden py-10 lg:py-16">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Messaging & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-midnight-900/90 border border-purple-500/30 text-xs text-purple-300 backdrop-blur-md shadow-lg">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="font-semibold text-white">Meet MAYA</span>
              <span className="text-slate-400">•</span>
              <span>An AI Companion with Simulated Emotions</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.15]">
              Meaningful presence.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400">
                Thoughtful empathy.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              MAYA is a warm, emotionally expressive AI companion designed to listen, explore thoughts, and reflect alongside you. Featuring simulated emotional states, genuine intellectual depth, and total ethical transparency.
            </p>

            {/* Simulated Emotion Transparency Callout */}
            <div className="p-4 rounded-2xl bg-midnight-900/80 border border-purple-500/20 backdrop-blur-md max-w-xl mx-auto lg:mx-0 text-left">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white">Simulated Emotional Architecture: </span>
                  MAYA models affective tones (warmth, curiosity, empathy) to enrich human-AI rapport, while openly distinguishing simulated expression from biological consciousness.
                  <button
                    onClick={onOpenDisclaimer}
                    className="ml-1 text-cyan-400 hover:text-cyan-300 underline font-medium"
                  >
                    Read ethics notice
                  </button>
                </div>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2 flex-wrap">
              <button
                type="button"
                onClick={onStartChat}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-600/30 hover:shadow-cyan-500/30 hover:scale-105 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Start Talking with Maya</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {onStartVoiceChat && (
                <button
                  type="button"
                  onClick={onStartVoiceChat}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600/25 via-indigo-600/25 to-purple-600/25 hover:from-cyan-600/40 hover:to-purple-600/40 border border-cyan-400/40 text-cyan-200 hover:text-white font-semibold text-sm transition-all duration-300 shadow-md hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                  title="Enable Maya's voice assistant & audio conversation"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>🎙️ Voice Assistance</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenDisclaimer}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-midnight-900/80 hover:bg-midnight-800 border border-purple-500/30 text-slate-300 hover:text-white font-medium text-sm transition-all"
              >
                How Maya Works
              </button>
            </div>
          </div>

          {/* Right Column: Live Interactive Avatar Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel text-center relative overflow-hidden group">
              {/* Subtle Corner Accents */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />

              {/* Avatar Centerpiece */}
              <div className="py-4">
                <MayaAvatar emotion={previewEmotion} size="xl" className="mx-auto" />
              </div>

              {/* Status Header */}
              <div className="mt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: `${activeEmotionConfig.primaryColor}15`,
                    color: activeEmotionConfig.primaryColor,
                    border: `1px solid ${activeEmotionConfig.primaryColor}30`,
                  }}
                >
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>State: {activeEmotionConfig.label}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 italic px-4">
                  "{activeEmotionConfig.description}"
                </p>
              </div>

              {/* Emotion Selector Pills */}
              <div className="mt-6 pt-5 border-t border-purple-500/15">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Click to Test Maya's Simulated Emotional Aura:
                </div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {Object.keys(EMOTIONS).map((emoKey) => {
                    const emo = EMOTIONS[emoKey];
                    const isSelected = previewEmotion === emoKey;
                    return (
                      <button
                        key={emoKey}
                        type="button"
                        onClick={() => setPreviewEmotion(emoKey)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-white/15 text-white border border-white/30 shadow-sm scale-105'
                            : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
                        }`}
                        style={{
                          color: isSelected ? emo.primaryColor : undefined,
                        }}
                      >
                        {emo.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-panel glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <Heart className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2 font-display">
              Consistent Warm Persona
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              MAYA maintains a cohesive personality: patient, supportive, grounded, and observant across every interaction.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2 font-display">
              Reactive Emotion Spectrum
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time simulated emotional cues adjust Maya's visual aura, facial expressions, and tonal nuance dynamically.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Cpu className="w-5 h-5 text-cyan-300" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2 font-display">
              Powered by Google Gemini
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Equipped with deep reasoning capabilities, natural conversational nuance, and transparent safety boundaries.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
