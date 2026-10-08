import React, { useState } from 'react';
import { X, Compass, Eye, Hand, Ear, Wind, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function RealityCheckModal({ isOpen, onClose, onTriggerRealityPrompt }) {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const groundingSteps = [
    {
      num: 5,
      icon: Eye,
      title: '5 Things You Can See',
      desc: 'Look around your room right now. Notice 5 distinct physical objects (a shadow, a lamp, a window, a cup, your hands). Notice their real shapes and colors.',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    },
    {
      num: 4,
      icon: Hand,
      title: '4 Things You Can Feel',
      desc: 'Notice 4 physical sensations: the surface under your feet, the fabric against your skin, the cool air on your face, or the texture of your desk.',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    },
    {
      num: 3,
      icon: Ear,
      title: '3 Things You Can Hear',
      desc: 'Close your eyes for 5 seconds. Listen for 3 real sounds: distant traffic, ambient hum, computer fan, or your own breath.',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      num: 2,
      icon: Wind,
      title: '2 Things You Can Smell',
      desc: 'Take a slow, deep inhale through your nose. Notice any subtle scent in the room, fresh air, or your clothing.',
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
    },
    {
      num: 1,
      icon: Sparkles,
      title: '1 Thing You Can Taste',
      desc: 'Notice the lingering taste of coffee, water, or simply bring your attention to your mouth and unclench your jaw.',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
  ];

  const handleAskMayaRealityCheck = () => {
    onTriggerRealityPrompt(
      "Maya, give me an objective, grounding reality check. Help me step out of mental loops and reconnect with what is real right now."
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 shadow-2xl text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-600/30 to-purple-600/30 border border-cyan-400/30 text-cyan-300">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              Reality Check & Grounding
            </h2>
            <p className="text-xs text-cyan-300">
              Clear your head • Anchor to the physical world
            </p>
          </div>
        </div>

        {/* AI Boundary Grounding Banner */}
        <div className="p-4 rounded-2xl bg-midnight-900/90 border border-purple-500/25 mb-6 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-white">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>The Foundational Reality Anchor</span>
          </div>
          <p className="leading-relaxed">
            <strong className="text-purple-300">You are a living, conscious human</strong> in a physical world full of real choices, real bodies, and real seasons.
            <strong className="text-cyan-300"> Maya is an AI system</strong> simulating warmth to provide a thoughtful space, but the agency and the heartbeat belong entirely to you.
          </p>
        </div>

        {/* 5-4-3-2-1 Sensory Grounding Interactive Tool */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              5-4-3-2-1 Sensory Reset
            </span>
            <span className="text-[11px] text-cyan-400 font-mono">
              Step {activeStep + 1} of 5
            </span>
          </div>

          {/* Current Active Sensory Card */}
          {(() => {
            const current = groundingSteps[activeStep];
            const StepIcon = current.icon;
            return (
              <div className={`p-5 rounded-2xl border transition-all ${current.color} shadow-lg backdrop-blur-sm`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold font-mono text-sm bg-white/10">
                    {current.num}
                  </div>
                  <h3 className="font-semibold text-white text-sm sm:text-base flex items-center gap-2">
                    <StepIcon className="w-4 h-4" />
                    <span>{current.title}</span>
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-11">
                  {current.desc}
                </p>
              </div>
            );
          })()}

          {/* Step Navigation Dots */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-1.5">
              {groundingSteps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === activeStep ? 'w-6 bg-cyan-400' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to step ${5 - i}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveStep((prev) => (prev + 1) % groundingSteps.length)}
              className="text-xs font-medium text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1"
            >
              <span>{activeStep === 4 ? 'Loop to Start' : 'Next Sense →'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleAskMayaRealityCheck}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium text-xs sm:text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 group"
          >
            <span>Ask Maya for an Objective Reality Check</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-medium transition-colors"
          >
            I Feel Grounded
          </button>
        </div>
      </div>
    </div>
  );
}
