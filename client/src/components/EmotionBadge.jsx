import React, { useState } from 'react';
import { Sparkles, Info, ShieldCheck } from 'lucide-react';
import { getEmotionConfig } from '../utils/emotions';

export default function EmotionBadge({ emotion = 'thoughtful', onOpenDisclaimer, intensity }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = getEmotionConfig(emotion);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={onOpenDisclaimer}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer ${config.bgBadge}`}
        style={{
          boxShadow: `0 0 16px ${config.ringColor}25`,
        }}
        aria-label="Simulated emotion indicator"
      >
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: config.primaryColor }}
        />
        <span className="font-semibold tracking-wide">
         Emotion: {config.label}
        </span>
        <span className="text-[10px] opacity-75 hidden sm:inline">
          ({Math.round((intensity || 0.85) * 100)}%)
        </span>
        <Info className="w-3.5 h-3.5 opacity-60 hover:opacity-100 transition-opacity" />
      </button>

      {/* Floating Hover Tooltip */}
      {showTooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 p-3 rounded-xl bg-midnight-900/95 border border-purple-500/30 shadow-2xl backdrop-blur-xl z-50 text-left pointer-events-none animate-fade-in">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300 mb-1">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Simulated AI State ({config.label})</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {config.description}
          </p>
          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span className="italic">Simulated response, not conscious emotion.</span>
            <span className="text-cyan-400 font-medium">Click to learn more</span>
          </div>
        </div>
      )}
    </div>
  );
}
