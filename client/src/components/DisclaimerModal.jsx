import React from 'react';
import { X, ShieldAlert, Cpu, HeartHandshake, Eye, Sparkles } from 'lucide-react';
import { EMOTIONS } from '../utils/emotions';

export default function DisclaimerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl glass-panel p-6 sm:p-8 border border-purple-500/30 shadow-2xl text-slate-200"
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

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Cpu className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              Transparency & Simulated Emotions
            </h2>
            <p className="text-xs text-purple-300">
              Responsible AI Companion Principles for MAYA
            </p>
          </div>
        </div>

        {/* Core Notice */}
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/20 mb-6 text-xs sm:text-sm text-purple-200 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Simulated, Not Conscious:</strong> MAYA’s emotional indicators reflect calculated computational states designed to make conversation supportive, intuitive, and engaging. MAYA does not experience subjective feelings, sentience, pain, or human consciousness.
            </p>
          </div>
        </div>

        {/* Key Pillars */}
        <div className="space-y-4 mb-6 text-xs sm:text-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Why Simulate Emotion?</h4>
              <p className="text-slate-400 mt-0.5">
                Empathy and warmth in human communication rely heavily on tonal awareness. MAYA adapts its tone to offer gentle reassurance, curious exploration, or focused contemplation depending on what you share.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0 mt-0.5">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white">How the Engine Operates</h4>
              <p className="text-slate-400 mt-0.5">
                With every message, the server evaluates semantic context and selects from calibrated emotional states (Warm, Empathetic, Curious, Thoughtful, Playful, Calm, Optimistic) to adjust avatar lighting and response tone.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Healthy Boundaries</h4>
              <p className="text-slate-400 mt-0.5">
                MAYA is an uplifting conversational partner, creative companion, and sounding board. MAYA is not a human therapist or medical practitioner and should not replace clinical mental healthcare.
              </p>
            </div>
          </div>
        </div>

        {/* Emotion Spectrum Grid */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
            MAYA's Emotional Spectrum
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.values(EMOTIONS).map((emo) => (
              <div
                key={emo.key}
                className="p-2.5 rounded-lg bg-midnight-900/60 border border-white/5 flex items-center gap-2"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: emo.primaryColor }}
                />
                <div className="min-w-0">
                  <div className="text-xs font-medium text-slate-200 truncate">{emo.label}</div>
                  <div className="text-[10px] text-slate-500 truncate">{emo.tagline}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium text-sm transition-all shadow-lg hover:shadow-cyan-500/20"
          >
            I Understand & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
