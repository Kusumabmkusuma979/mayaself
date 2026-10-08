/**
 * Simulated Emotion System for MAYA
 * Maps simulated emotion keys to visual themes, colors, glow styles,
 * descriptions, and transparency disclosures.
 */

export const EMOTIONS = {
  warm: {
    key: 'warm',
    label: 'Warm',
    tagline: 'Welcoming & Friendly',
    description: 'Calibrated for hospitality, reassurance, and inviting connection.',
    primaryColor: '#f59e0b', // Amber
    secondaryColor: '#ec4899', // Pink
    glowClass: 'shadow-[0_0_35px_rgba(245,158,11,0.35)]',
    borderClass: 'border-amber-500/30',
    bgBadge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    ringColor: 'rgba(245, 158, 11, 0.6)',
    eyeExpression: 'friendly',
    pulseRate: '3.5s',
  },
  empathetic: {
    key: 'empathetic',
    label: 'Empathetic',
    tagline: 'Deep Resonance',
    description: 'Calibrated for active compassionate listening and emotional support.',
    primaryColor: '#c084fc', // Soft Violet
    secondaryColor: '#f43f5e', // Rose
    glowClass: 'shadow-[0_0_35px_rgba(192,132,252,0.35)]',
    borderClass: 'border-purple-400/30',
    bgBadge: 'bg-purple-500/10 text-purple-300 border-purple-400/20',
    ringColor: 'rgba(192, 132, 252, 0.6)',
    eyeExpression: 'caring',
    pulseRate: '4.5s',
  },
  curious: {
    key: 'curious',
    label: 'Curious',
    tagline: 'Inquisitive & Alert',
    description: 'Calibrated for intellectual exploration, wonder, and deep inquiry.',
    primaryColor: '#06b6d4', // Cyan
    secondaryColor: '#3b82f6', // Blue
    glowClass: 'shadow-[0_0_35px_rgba(6,182,212,0.35)]',
    borderClass: 'border-cyan-400/30',
    bgBadge: 'bg-cyan-500/10 text-cyan-300 border-cyan-400/20',
    ringColor: 'rgba(6, 182, 212, 0.6)',
    eyeExpression: 'wide',
    pulseRate: '2.5s',
  },
  thoughtful: {
    key: 'thoughtful',
    label: 'Thoughtful',
    tagline: 'Contemplative Reflection',
    description: 'Calibrated for philosophical nuance, deep synthesis, and calm insight.',
    primaryColor: '#818cf8', // Indigo
    secondaryColor: '#a855f7', // Violet
    glowClass: 'shadow-[0_0_35px_rgba(129,140,248,0.35)]',
    borderClass: 'border-indigo-400/30',
    bgBadge: 'bg-indigo-500/10 text-indigo-300 border-indigo-400/20',
    ringColor: 'rgba(129, 140, 248, 0.6)',
    eyeExpression: 'thoughtful',
    pulseRate: '5.0s',
  },
  playful: {
    key: 'playful',
    label: 'Playful',
    tagline: 'Lighthearted & Witty',
    description: 'Calibrated for humor, creative banter, and cheerful camaraderie.',
    primaryColor: '#ec4899', // Pink
    secondaryColor: '#f59e0b', // Amber
    glowClass: 'shadow-[0_0_35px_rgba(236,72,153,0.35)]',
    borderClass: 'border-pink-400/30',
    bgBadge: 'bg-pink-500/10 text-pink-300 border-pink-400/20',
    ringColor: 'rgba(236, 72, 153, 0.6)',
    eyeExpression: 'sparkle',
    pulseRate: '2.0s',
  },
  calm: {
    key: 'calm',
    label: 'Calm',
    tagline: 'Tranquil & Grounded',
    description: 'Calibrated for mindfulness, stress relief, and serene presence.',
    primaryColor: '#14b8a6', // Teal
    secondaryColor: '#06b6d4', // Cyan
    glowClass: 'shadow-[0_0_35px_rgba(20,184,166,0.35)]',
    borderClass: 'border-teal-400/30',
    bgBadge: 'bg-teal-500/10 text-teal-300 border-teal-400/20',
    ringColor: 'rgba(20, 184, 166, 0.6)',
    eyeExpression: 'serene',
    pulseRate: '6.0s',
  },
  optimistic: {
    key: 'optimistic',
    label: 'Optimistic',
    tagline: 'Hopeful & Inspiring',
    description: 'Calibrated for encouragement, forward momentum, and belief in you.',
    primaryColor: '#38bdf8', // Sky Blue
    secondaryColor: '#10b981', // Emerald
    glowClass: 'shadow-[0_0_35px_rgba(56,189,248,0.35)]',
    borderClass: 'border-sky-400/30',
    bgBadge: 'bg-sky-500/10 text-sky-300 border-sky-400/20',
    ringColor: 'rgba(56, 189, 248, 0.6)',
    eyeExpression: 'uplifted',
    pulseRate: '3.0s',
  }
};

export function getEmotionConfig(emotionKey) {
  const normalized = (emotionKey || '').toLowerCase().trim();
  return EMOTIONS[normalized] || EMOTIONS.thoughtful;
}
