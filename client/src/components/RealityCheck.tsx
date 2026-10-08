import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import MayaAvatar from './MayaAvatar';
import { getApiUrl } from '../utils/api';

export interface RealityCheckResult {
  feelings: string;
  facts: string;
  assumptions: string;
  alternative: string;
  balanced: string;
}

interface RealityCheckProps {
  isOpen?: boolean;
  onClose?: () => void;
  showTrigger?: boolean;
  className?: string;
  initialText?: string;
}

export const RealityCheck: React.FC<RealityCheckProps> = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  showTrigger = true,
  className = '',
  initialText = '',
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isModalOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const [inputStatement, setInputStatement] = useState(initialText);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RealityCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
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

  // Client-side fallback analyzer adhering strictly to the 5 sections & rules
  const getClientFallbackAnalysis = (text: string): RealityCheckResult => {
    const trimmed = text.trim();
    const lower = trimmed.toLowerCase();

    // Check for common patterns
    if (lower.includes('everyone') && (lower.includes('hate') || lower.includes('dislike') || lower.includes('criticiz'))) {
      return {
        feelings: "You may be feeling rejected, discouraged, or carrying a heavy weight of self-doubt.",
        facts: `You experienced criticism or a negative reaction: "${trimmed.length > 80 ? trimmed.slice(0, 77) + '...' : trimmed}".`,
        assumptions: "You may be assuming that a few negative reactions represent everyone's perspective, or that criticism equals personal dislike.",
        alternative: "Their feedback could highlight specific areas for refinement, while many others may have neutral or positive views that haven't been voiced.",
        balanced: "A few critical opinions do not define your worth or the entirety of your work. Consider taking a breath and seeking broader, constructive input."
      };
    }

    return {
      feelings: "You may be feeling overwhelmed, uncertain, or anxious about how this situation will unfold.",
      facts: `You expressed: "${trimmed.length > 90 ? trimmed.slice(0, 87) + '...' : trimmed}".`,
      assumptions: "You might be anticipating the most painful outcome or concluding that current worries are guaranteed to happen.",
      alternative: "This situation could resolve more neutrally or constructively than your immediate worry suggests, with factors you cannot foresee right now.",
      balanced: "Notice the difference between what has actually occurred and what your mind is projecting. Focus calmly on what is in your direct control today."
    };
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const textToAnalyze = inputStatement.trim();
    if (!textToAnalyze || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Attempt backend endpoint
      let response: Response | null = null;
      const realityCheckUrl = getApiUrl('/api/reality-check');
      try {
        response = await fetch(realityCheckUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToAnalyze }),
        });
      } catch (fetchErr) {
        // Direct port 5000 fallback only during local development
        if (import.meta.env.DEV) {
          try {
            response = await fetch('http://127.0.0.1:5000/api/reality-check', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: textToAnalyze }),
            });
          } catch {
            response = null;
          }
        } else {
          response = null;
        }
      }

      if (response && response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          setResult({
            feelings: json.data.feelings,
            facts: json.data.facts,
            assumptions: json.data.assumptions,
            alternative: json.data.alternative,
            balanced: json.data.balanced,
          });
          setIsLoading(false);
          return;
        }
      }

      // If backend is unavailable or returns an error, use intelligent local framing
      const fallbackAnalysis = getClientFallbackAnalysis(textToAnalyze);
      setResult(fallbackAnalysis);
    } catch (err: any) {
      console.warn('Reality check fetch error:', err);
      const fallbackAnalysis = getClientFallbackAnalysis(textToAnalyze);
      setResult(fallbackAnalysis);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setInputStatement('');
    setError(null);
  };

  return (
    <>
      {/* 🧠 Trigger Button / Card */}
      {showTrigger && (
        <div
          onClick={handleOpen}
          className={`group relative cursor-pointer select-none rounded-2xl glass-panel p-4 sm:p-5 border border-purple-500/25 hover:border-purple-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:scale-[1.02] active:scale-[0.99] bg-gradient-to-br from-midnight-900/90 via-midnight-850/80 to-midnight-950/90 ${className}`}
          role="button"
          tabIndex={0}
          aria-label="Open Reality Check"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
              🧠
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-white text-base tracking-wide flex items-center gap-1.5">
                  Reality Check
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  Perspective Tool
                </span>
              </div>
              <p className="text-xs text-slate-400 group-hover:text-purple-200 transition-colors mt-0.5">
                "Let's step back and look at this clearly."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 🧠 Modal / Panel */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.2)] bg-[#0a0618]/95 text-slate-200 transition-all"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Reality Check"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center sm:text-left mb-6 pr-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-[11px] font-semibold text-purple-300 uppercase tracking-widest mb-2.5">
                <span>🧠 REALITY CHECK</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                "Tell MAYA what's on your mind."
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                A calm, intelligent space to separate what is felt from what is known.
              </p>
            </div>

            {/* Form Input (shown when no result yet) */}
            {!result && !isLoading && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <textarea
                    rows={4}
                    value={inputStatement}
                    onChange={(e) => setInputStatement(e.target.value)}
                    placeholder="Describe a situation, thought, or worry..."
                    className="w-full glass-input rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none border border-purple-500/30 focus:border-cyan-400/60 transition-all leading-relaxed"
                    autoFocus
                  />
                  {inputStatement.length > 0 && (
                    <div className="absolute bottom-3 right-3 text-[11px] text-slate-500 font-mono">
                      {inputStatement.length} chars
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!inputStatement.trim() || isLoading}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                    inputStatement.trim() && !isLoading
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg shadow-purple-600/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                      : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>CHECK MY REALITY</span>
                </button>
              </form>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                <MayaAvatar emotion="thoughtful" size="md" isTyping={true} />
                <div className="space-y-1.5">
                  <p className="text-sm sm:text-base font-semibold text-purple-200 animate-pulse">
                    "MAYA is looking at this from different perspectives..."
                  </p>
                  <p className="text-xs text-slate-400">
                    Gently discerning feelings, explicit facts, and alternative angles.
                  </p>
                </div>
                <div className="flex gap-1.5 pt-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* 5-Section Analysis Result */}
            {result && !isLoading && (
              <div className="space-y-5 animate-slide-up">
                {/* Companion Header Banner */}
                <div className="p-3.5 rounded-2xl bg-midnight-900/90 border border-purple-500/25 flex items-center gap-3">
                  <MayaAvatar emotion="calm" size="sm" className="shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-purple-200">
                      MAYA's Reality Check Analysis
                    </div>
                    <div className="text-[11px] text-slate-400 truncate italic">
                      "{inputStatement}"
                    </div>
                  </div>
                </div>

                {/* Section 1: 💭 WHAT YOU MAY BE FEELING */}
                <div className="p-4 rounded-2xl bg-purple-950/25 border border-purple-500/25 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300 tracking-wide uppercase">
                    <span>💭 WHAT YOU MAY BE FEELING</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-6">
                    {result.feelings}
                  </p>
                </div>

                {/* Section 2: 📌 WHAT WE ACTUALLY KNOW */}
                <div className="p-4 rounded-2xl bg-cyan-950/25 border border-cyan-500/25 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 tracking-wide uppercase">
                    <span>📌 WHAT WE ACTUALLY KNOW</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-6">
                    {result.facts}
                  </p>
                </div>

                {/* Section 3: ⚠️ WHAT MIGHT BE AN ASSUMPTION */}
                <div className="p-4 rounded-2xl bg-amber-950/25 border border-amber-500/25 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 tracking-wide uppercase">
                    <span>⚠️ WHAT MIGHT BE AN ASSUMPTION</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-6">
                    {result.assumptions}
                  </p>
                </div>

                {/* Section 4: 🔍 ANOTHER WAY TO LOOK AT IT */}
                <div className="p-4 rounded-2xl bg-indigo-950/25 border border-indigo-500/25 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 tracking-wide uppercase">
                    <span>🔍 ANOTHER WAY TO LOOK AT IT</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-6">
                    {result.alternative}
                  </p>
                </div>

                {/* Section 5: 🌱 A BALANCED PERSPECTIVE */}
                <div className="p-4 rounded-2xl bg-emerald-950/25 border border-emerald-500/25 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 tracking-wide uppercase">
                    <span>🌱 A BALANCED PERSPECTIVE</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-6 font-medium">
                    {result.balanced}
                  </p>
                </div>

                {/* Reset Action */}
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Check Another Thought</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-xs font-semibold text-white shadow-md cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Mandatory Ethical Disclaimer Note */}
            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <p className="text-[11px] text-slate-400 italic">
                "Reality Check is a perspective tool, not a source of absolute truth."
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RealityCheck;
