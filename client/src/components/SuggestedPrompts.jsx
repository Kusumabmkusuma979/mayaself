import React from 'react';
import { Sparkles, Heart, HelpCircle, Lightbulb, Compass, Smile } from 'lucide-react';

export const STARTER_PROMPTS = [
  {
    icon: HelpCircle,
    label: 'How Emotions Work',
    prompt: 'How do your simulated emotions work, and how do they differ from real consciousness?',
    color: 'text-cyan-400 border-cyan-500/30 hover:border-cyan-400/60 bg-cyan-500/5',
  },
  {
    icon: Heart,
    label: 'Reflect on a Hard Day',
    prompt: "I've had a demanding, stressful day. Could you help me decompress and ground myself?",
    color: 'text-purple-400 border-purple-500/30 hover:border-purple-400/60 bg-purple-500/5',
  },
  {
    icon: Lightbulb,
    label: 'Creative Spark',
    prompt: 'Help me brainstorm an inspiring, out-of-the-box concept for a creative project.',
    color: 'text-amber-400 border-amber-500/30 hover:border-amber-400/60 bg-amber-500/5',
  },
  {
    icon: Compass,
    label: 'Core Companion Values',
    prompt: 'What are your core guiding values as an AI companion, Maya?',
    color: 'text-indigo-400 border-indigo-500/30 hover:border-indigo-400/60 bg-indigo-500/5',
  },
  {
    icon: Smile,
    label: 'Playful Banter',
    prompt: 'Tell me a witty, playful observation that will bring a genuine smile to my face.',
    color: 'text-pink-400 border-pink-500/30 hover:border-pink-400/60 bg-pink-500/5',
  },
];

export default function SuggestedPrompts({ onSelectPrompt, className = '' }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400 px-1">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>Suggested conversation starters:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {STARTER_PROMPTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt(item.prompt)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs text-left transition-all backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] ${item.color}`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="text-slate-200 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
