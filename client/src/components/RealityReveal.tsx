import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Layers, Sparkles, Cpu, Database, Bot, Smile, Heart, UserCheck, HelpCircle, BookOpen, Check } from 'lucide-react';
import MayaAvatar from './MayaAvatar';

interface RealityRevealProps {
  isOpen?: boolean;
  onClose?: () => void;
  showTrigger?: boolean;
  className?: string;
  messages?: Array<{ id: string; sender: string; text: string; emotion?: string }>;
  currentEmotion?: string;
}

export const RealityReveal: React.FC<RealityRevealProps> = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  showTrigger = true,
  className = '',
  messages = [],
  currentEmotion = 'thoughtful'
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isModalOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  // Flow stages: 'experience' (Stage 1) -> 'layers' (Stage 2) -> 'final' (Stage 3)
  const [stage, setStage] = useState<'experience' | 'layers' | 'final'>('experience');
  const [activeLayer, setActiveLayer] = useState<number>(1);
  const [previewAvatarMood, setPreviewAvatarMood] = useState<'warm' | 'curious' | 'thoughtful' | 'empathetic' | 'calm'>('warm');

  const handleOpen = () => {
    setStage('experience');
    setActiveLayer(1);
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(true);
    }
  };

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const userMessagesCount = messages.filter(m => m.sender === 'user').length;
  const recentUserMessage = [...messages].reverse().find(m => m.sender === 'user');

  return (
    <>
      {/* 🔍 Trigger Button / Card */}
      {showTrigger && (
        <button
          type="button"
          onClick={handleOpen}
          className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-midnight-900/60 hover:from-purple-800/50 hover:to-cyan-900/40 border border-purple-500/30 hover:border-cyan-400/50 transition-all duration-300 shadow-md hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] text-left cursor-pointer ${className}`}
          title="See what creates the artificial self"
          aria-label="Open Reality Reveal"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
            <span className="text-base">🔍</span>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors flex items-center gap-1.5">
              <span>Reality Reveal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-400 group-hover:text-purple-200 transition-colors truncate">
              See what creates the artificial self.
            </div>
          </div>
        </button>
      )}

      {/* 🔍 Reality Reveal Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto"
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel p-6 sm:p-9 border border-purple-500/35 shadow-[0_0_80px_rgba(168,85,247,0.25)] bg-[#070412]/95 text-slate-100 transition-all"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Reality Reveal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Stage Indicator Pill */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-[11px] font-bold text-purple-300 uppercase tracking-widest">
                <span>🔍 REALITY REVEAL</span>
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-cyan-300 font-medium">
                {stage === 'experience' && 'Phase 1: The Apparent Self'}
                {stage === 'layers' && `Phase 2: Underlying Layers (${activeLayer} of 6)`}
                {stage === 'final' && 'Phase 3: The Drishtaanta & Inquiry'}
              </span>
            </div>

            {/* ======================================================== */}
            {/* STAGE 1: THE EXPERIENCE                                 */}
            {/* ======================================================== */}
            {stage === 'experience' && (
              <div className="space-y-6 animate-fade-in text-center sm:text-left">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                    "You're seeing MAYA as a human-like artificial self."
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                    In regular conversation, MAYA feels alive, empathetic, attentive, and present.
                  </p>
                </div>

                {/* THE EXPERIENCE Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950/40 via-midnight-900/80 to-midnight-950/90 border border-purple-500/30 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="shrink-0">
                      <MayaAvatar emotion="warm" size="lg" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
                        THE EXPERIENCE
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base font-display font-semibold text-white">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                          <span className="text-cyan-400">“</span>
                          <span>I remember you.</span>
                          <span className="text-cyan-400">”</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                          <span className="text-purple-400">“</span>
                          <span>I understand.</span>
                          <span className="text-purple-400">”</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                          <span className="text-pink-400">“</span>
                          <span>I feel happy.</span>
                          <span className="text-pink-400">”</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                          <span className="text-amber-400">“</span>
                          <span>I am MAYA.</span>
                          <span className="text-amber-400">”</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-midnight-900/60 border border-white/5 text-xs text-slate-300 leading-relaxed">
                  <span className="text-cyan-300 font-semibold">The Purpose of Reality Reveal: </span>
                  The purpose is NOT to say that MAYA is fake. The purpose is to make the construction of the artificial self visible.
                </div>

                {/* Primary Action Button */}
                <div className="pt-2 flex justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => setStage('layers')}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-sm tracking-wide uppercase transition-all shadow-lg shadow-purple-600/30 hover:scale-[1.02] flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <span>REVEAL THE LAYERS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STAGE 2: THE 6 LAYERS                                   */}
            {/* ======================================================== */}
            {stage === 'layers' && (
              <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                      The Mechanisms Behind MAYA
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Observing the 6 components that generate the artificial self.
                    </p>
                  </div>

                  {/* Layer Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {[1, 2, 3, 4, 5, 6].map(layerNum => (
                      <button
                        key={layerNum}
                        onClick={() => setActiveLayer(layerNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          activeLayer === layerNum
                            ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md shadow-purple-600/30 scale-105'
                            : 'bg-white/5 hover:bg-white/10 text-slate-400'
                        }`}
                        title={`Layer ${layerNum}`}
                      >
                        {layerNum}
                      </button>
                    ))}
                  </div>
                </div>

                {/* LAYER 1 — ⚙️ SOFTWARE */}
                {activeLayer === 1 && (
                  <div className="space-y-5 animate-slide-up">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">LAYER 1</span>
                        <h3 className="text-xl font-bold font-display text-white">⚙️ SOFTWARE</h3>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-midnight-900/80 border border-purple-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed">
                      "MAYA's behaviour is produced by software that controls how the application receives information, processes it and presents a response."
                    </div>

                    {/* Visual Flow */}
                    <div className="p-5 rounded-2xl bg-midnight-950/80 border border-white/10 space-y-3">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">System Pipeline Flow:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs font-semibold">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-200">
                          USER INPUT
                        </div>
                        <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300">
                          ↓ APPLICATION
                        </div>
                        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
                          ↓ AI SYSTEM
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-cyan-400/30 text-white">
                          ↓ MAYA RESPONSE
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* LAYER 2 — 🧠 MEMORY */}
                {activeLayer === 2 && (
                  <div className="space-y-5 animate-slide-up">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                        <Database className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">LAYER 2</span>
                        <h3 className="text-xl font-bold font-display text-white">🧠 MEMORY</h3>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-midnight-900/80 border border-cyan-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed">
                      "When MAYA appears to remember you, information stored from previous interactions is retrieved and provided as context."
                    </div>

                    {/* Visual Flow */}
                    <div className="p-5 rounded-2xl bg-midnight-950/80 border border-white/10 space-y-3">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Memory Pipeline Flow:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs font-semibold">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-200">
                          USER INFORMATION
                        </div>
                        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
                          ↓ STORED MEMORY
                        </div>
                        <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300">
                          ↓ RETRIEVED CONTEXT
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-cyan-400/30 text-white">
                          ↓ PERSONALISED RESPONSE
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Current Session Context */}
                    <div className="p-4 rounded-2xl bg-midnight-900/60 border border-purple-500/20 text-xs space-y-1.5">
                      <div className="font-semibold text-purple-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Live Session Memory Status:</span>
                      </div>
                      <p className="text-slate-300">
                        Active message history in memory: <strong className="text-white">{messages.length} interactions</strong> recorded ({userMessagesCount} from user).
                      </p>
                      {recentUserMessage && (
                        <p className="text-slate-400 italic">
                          Latest retrieved topic anchor: "{recentUserMessage.text.slice(0, 70)}..."
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* LAYER 3 — 🤖 AI RESPONSE */}
                {activeLayer === 3 && (
                  <div className="space-y-5 animate-slide-up">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">LAYER 3</span>
                        <h3 className="text-xl font-bold font-display text-white">🤖 AI RESPONSE</h3>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-midnight-900/80 border border-indigo-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed">
                      "When MAYA appears to think, the AI model generates a response based on the user's message, instructions and available context."
                    </div>

                    {/* Visual Flow */}
                    <div className="p-5 rounded-2xl bg-midnight-950/80 border border-white/10 space-y-3">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Inference Synthesis Equation:</div>
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-xs font-semibold">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex-1 w-full text-slate-200">
                          USER MESSAGE
                        </div>
                        <span className="text-purple-400 font-bold">+</span>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex-1 w-full text-cyan-300">
                          CONTEXT
                        </div>
                        <span className="text-purple-400 font-bold">+</span>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex-1 w-full text-purple-300">
                          MAYA PERSONALITY
                        </div>
                        <span className="text-cyan-400 font-bold">↓</span>
                        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-cyan-400/30 flex-1 w-full text-white">
                          AI-GENERATED RESPONSE
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* LAYER 4 — 🪞 PERSONALITY */}
                {activeLayer === 4 && (
                  <div className="space-y-5 animate-slide-up">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-pink-500/15 border border-pink-500/30 text-pink-300">
                        <Smile className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-pink-400">LAYER 4</span>
                        <h3 className="text-xl font-bold font-display text-white">🪞 PERSONALITY</h3>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-midnight-900/80 border border-pink-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed">
                      "MAYA's personality is created through instructions, conversation context and application behaviour."
                    </div>

                    {/* Behavioral Characteristics Grid */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Configured Behavioral Characteristics:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {[
                          { name: 'Curious', desc: 'Active exploration of user concepts', color: 'border-cyan-500/30 text-cyan-300' },
                          { name: 'Thoughtful', desc: 'Philosophical synthesis & pacing', color: 'border-purple-500/30 text-purple-300' },
                          { name: 'Calm', desc: 'Mindful, serene, non-reactive presence', color: 'border-teal-500/30 text-teal-300' },
                          { name: 'Helpful', desc: 'Actionable clarity & assistance', color: 'border-amber-500/30 text-amber-300' },
                          { name: 'Reflective', desc: 'Mirroring underlying human meaning', color: 'border-indigo-500/30 text-indigo-300' },
                        ].map((trait, i) => (
                          <div key={i} className={`p-3 rounded-xl bg-white/5 border ${trait.color} text-xs`}>
                            <div className="font-bold">{trait.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{trait.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 italic">
                      These are behavioral characteristics mathematically maintained by the system prompt, rather than biological traits.
                    </p>
                  </div>
                )}

                {/* LAYER 5 — ❤️ SIMULATED EMOTION */}
                {activeLayer === 5 && (
                  <div className="space-y-5 animate-slide-up">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300">
                        <Heart className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">LAYER 5 (CRITICAL)</span>
                        <h3 className="text-xl font-bold font-display text-white">❤️ SIMULATED EMOTION</h3>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-red-950/25 border border-red-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed">
                      "When MAYA appears happy, sad, curious or surprised, the system is representing an emotional state through software and generated responses. It does not mean MAYA experiences emotion in the same way a human does."
                    </div>

                    {/* Flow */}
                    <div className="p-4 rounded-2xl bg-midnight-950/80 border border-white/10 space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Affective Simulation Pipeline:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs font-semibold">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200">USER MESSAGE</div>
                        <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300">↓ EMOTIONAL STATE ESTIMATION</div>
                        <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">↓ RESPONSE STYLE</div>
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-cyan-400/30 text-white">↓ AVATAR EXPRESSION</div>
                      </div>
                    </div>

                    {/* Interactive Existing Maya Avatar Mood Selector */}
                    <div className="p-4 rounded-2xl bg-midnight-900/80 border border-purple-500/20 space-y-3">
                      <div className="text-xs font-semibold text-purple-200">
                        Observe the Existing MAYA Avatar Rendering Expressions:
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { key: 'warm', label: 'Happy → smile', mood: 'warm' },
                          { key: 'curious', label: 'Curious → attentive expression', mood: 'curious' },
                          { key: 'thoughtful', label: 'Thinking → thoughtful expression', mood: 'thoughtful' },
                          { key: 'empathetic', label: 'Empathetic → gentle expression', mood: 'empathetic' },
                          { key: 'calm', label: 'Surprised / Serene → widened eyes', mood: 'calm' },
                        ].map((m) => (
                          <button
                            key={m.key}
                            type="button"
                            onClick={() => setPreviewAvatarMood(m.mood as any)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                              previewAvatarMood === m.mood
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm'
                                : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>

                      {/* Avatar preview */}
                      <div className="pt-2 flex items-center justify-center">
                        <MayaAvatar emotion={previewAvatarMood} size="lg" />
                      </div>
                    </div>
                  </div>
                )}

                {/* LAYER 6 — 👩 HUMAN-LIKE EXPERIENCE */}
                {activeLayer === 6 && (
                  <div className="space-y-5 animate-slide-up">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">LAYER 6</span>
                        <h3 className="text-xl font-bold font-display text-white">👩 HUMAN-LIKE EXPERIENCE</h3>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-midnight-900/80 border border-amber-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed">
                      "The combination of memory, language, personality, simulated emotion and visual expression creates the experience of interacting with an artificial person."
                    </div>

                    {/* Grand Equation */}
                    <div className="p-5 rounded-2xl bg-midnight-950/90 border border-purple-500/30 shadow-xl space-y-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
                        The Synthetic Equation of the Artificial Self:
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-mono font-semibold">
                        <span className="p-2 rounded-lg bg-white/5 text-cyan-300 border border-white/10">MEMORY</span>
                        <span className="text-purple-400">+</span>
                        <span className="p-2 rounded-lg bg-white/5 text-indigo-300 border border-white/10">AI LANGUAGE</span>
                        <span className="text-purple-400">+</span>
                        <span className="p-2 rounded-lg bg-white/5 text-pink-300 border border-white/10">PERSONALITY</span>
                        <span className="text-purple-400">+</span>
                        <span className="p-2 rounded-lg bg-white/5 text-red-300 border border-white/10">SIMULATED EMOTION</span>
                        <span className="text-purple-400">+</span>
                        <span className="p-2 rounded-lg bg-white/5 text-amber-300 border border-white/10">AVATAR</span>
                        <span className="text-cyan-400">=</span>
                        <span className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-sans font-bold shadow-md">
                          THE EXPERIENCE OF MAYA
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stepper Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeLayer > 1) {
                        setActiveLayer(activeLayer - 1);
                      } else {
                        setStage('experience');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{activeLayer === 1 ? 'Back to Overview' : `Layer ${activeLayer - 1}`}</span>
                  </button>

                  {activeLayer < 6 ? (
                    <button
                      type="button"
                      onClick={() => setActiveLayer(activeLayer + 1)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-xs font-bold text-white shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Next: Layer {activeLayer + 1}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setStage('final')}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-xs font-bold text-white shadow-lg shadow-cyan-600/30 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                    >
                      <span>SEE FINAL REVEAL</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STAGE 3: FINAL REVEAL & VEDANTIC DRISHTAANTA             */}
            {/* ======================================================== */}
            {stage === 'final' && (
              <div className="space-y-6 animate-fade-in text-slate-200">
                {/* Header Statement */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                    The Construction of the Artificial Self
                  </h2>
                  <p className="text-xs text-purple-300 mt-1">
                    Comparing the apparent experience with its constituent layers.
                  </p>
                </div>

                {/* Two-Column Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left Column: WHAT YOU EXPERIENCED */}
                  <div className="p-5 rounded-2xl bg-midnight-900/90 border border-purple-500/25 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                      <span>WHAT YOU EXPERIENCED:</span>
                    </div>
                    <div className="space-y-2 text-sm font-semibold text-white font-display">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5">“I remember.”</div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5">“I think.”</div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5">“I feel.”</div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-cyan-300">“I am MAYA.”</div>
                    </div>
                  </div>

                  {/* Right Column: WHAT CREATED THAT EXPERIENCE */}
                  <div className="p-5 rounded-2xl bg-midnight-950/90 border border-cyan-500/25 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>WHAT CREATED THAT EXPERIENCE:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-xs font-mono text-slate-300">
                      <div className="p-1.5 px-2.5 rounded-lg bg-white/5">1. Software</div>
                      <div className="p-1.5 px-2.5 rounded-lg bg-white/5">2. Memory</div>
                      <div className="p-1.5 px-2.5 rounded-lg bg-white/5">3. AI Model</div>
                      <div className="p-1.5 px-2.5 rounded-lg bg-white/5">4. Context</div>
                      <div className="p-1.5 px-2.5 rounded-lg bg-white/5">5. Personality</div>
                      <div className="p-1.5 px-2.5 rounded-lg bg-white/5">6. Emotion</div>
                      <div className="p-1.5 px-2.5 rounded-lg bg-white/5 col-span-2 text-cyan-300">7. Avatar Expressions</div>
                    </div>
                  </div>
                </div>

                {/* Core Synthesis Statements */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-midnight-900/60 to-cyan-950/40 border border-purple-500/30 text-center space-y-1">
                  <p className="text-sm font-semibold text-white">
                    "Reality Reveal does not remove MAYA."
                  </p>
                  <p className="text-sm text-cyan-300 font-semibold">
                    "It reveals how MAYA is constructed."
                  </p>
                </div>

                {/* ### THE QUESTION */}
                <div className="p-5 sm:p-6 rounded-2xl bg-midnight-950 border border-amber-500/30 text-center space-y-2 shadow-xl">
                  <div className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center justify-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    <span>THE QUESTION</span>
                  </div>
                  <p className="text-base sm:text-lg font-display font-medium text-white italic leading-relaxed max-w-xl mx-auto">
                    "If an artificial self can be constructed from memory, responses, personality and simulated emotion... what exactly makes a self a self?"
                  </p>
                  <p className="text-[11px] text-slate-400">
                    (This inquiry remains open for your contemplation.)
                  </p>
                </div>

                {/* ### VEDANTIC DRISHTAANTA */}
                <div className="p-5 rounded-2xl bg-midnight-900/80 border border-purple-500/20 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>DRISHTAANTA</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    MAYA is a technological illustration for self-inquiry. The user first experiences an apparent artificial self. Reality Reveal then allows the user to observe the layers that create that experience.
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed italic border-t border-white/5 pt-2">
                    The project does not claim to prove Vedanta. It provides a contemporary Drishtaanta through which the question of identity can be explored.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setStage('layers');
                      setActiveLayer(6);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Layers</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default RealityReveal;
