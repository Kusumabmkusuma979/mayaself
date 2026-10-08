import React, { useMemo } from 'react';
import { getEmotionConfig } from '../utils/emotions';

/**
 * MayaAvatar - Interactive, emotionally responsive AI avatar
 * Renders an animated SVG companion face with glowing aura, dynamic expression,
 * speaking waveforms, and mood-based lighting.
 */
export default function MayaAvatar({
  emotion = 'thoughtful',
  intensity = 0.85,
  isTyping = false,
  isSpeaking = false,
  size = 'md',
  className = '',
  onClick
}) {
  const config = useMemo(() => getEmotionConfig(emotion), [emotion]);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-40 h-40 md:w-48 md:h-48'
  }[size] || 'w-16 h-16';

  // Eye and expression variations based on emotion & states
  const isWinking = emotion === 'playful';
  const isReflective = emotion === 'thoughtful';
  const isCaring = emotion === 'empathetic' || emotion === 'warm';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none group ${className}`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      title={`MAYA (${config.label} - Simulated Emotion${isSpeaking ? ' • Speaking' : ''})`}
    >
      {/* Outer Soundwave Ripples when Speaking */}
      {isSpeaking && (
        <>
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-30 pointer-events-none"
            style={{ backgroundColor: config.primaryColor }}
          />
          <span
            className="absolute -inset-3 rounded-full animate-pulse opacity-40 blur-md pointer-events-none"
            style={{ backgroundColor: config.secondaryColor }}
          />
        </>
      )}

      {/* Outer Ambient Glow Rings */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-60 transition-all duration-1000 ease-in-out pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${config.primaryColor} 0%, ${config.secondaryColor} 70%, transparent 100%)`,
          transform: isTyping || isSpeaking ? 'scale(1.25)' : 'scale(1.05)',
        }}
      />

      <div
        className="absolute -inset-1 rounded-full blur-md opacity-40 transition-all duration-700 pointer-events-none"
        style={{
          backgroundColor: config.primaryColor,
        }}
      />

      {/* Main Avatar SVG Container */}
      <div
        className={`relative z-10 rounded-full p-[2px] transition-transform duration-500 ease-out ${
          isTyping ? 'animate-bounce' : isSpeaking ? 'scale-105' : 'animate-float'
        } ${sizeClasses}`}
        style={{
          background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`,
        }}
      >
        <div className="w-full h-full rounded-full bg-midnight-900/90 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/10 shadow-inner">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full transform transition-all duration-500 group-hover:scale-105"
          >
            <defs>
              {/* Dynamic Gradients */}
              <linearGradient id={`grad-halo-${emotion}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={config.primaryColor} stopOpacity="0.8" />
                <stop offset="100%" stopColor={config.secondaryColor} stopOpacity="0.4" />
              </linearGradient>

              <radialGradient id={`grad-core-${emotion}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1a1138" />
                <stop offset="70%" stopColor="#0c071d" />
                <stop offset="100%" stopColor="#06030e" />
              </radialGradient>

              <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Sphere */}
            <circle cx="50" cy="50" r="46" fill={`url(#grad-core-${emotion})`} />

            {/* Neural Aura Ring */}
            <circle
              cx="50"
              cy="50"
              r="43"
              fill="none"
              stroke={`url(#grad-halo-${emotion})`}
              strokeWidth={isSpeaking ? "3" : "2.5"}
              strokeDasharray={isTyping || isSpeaking ? "6 3" : "12 6"}
              className="origin-center transition-all duration-1000"
              style={{
                animation: `spin ${isSpeaking ? '2s' : isTyping ? '3s' : '12s'} linear infinite`,
              }}
            />

            {/* Facial Cheeks / Mood Glow */}
            <circle
              cx="28"
              cy="56"
              r="7"
              fill={config.primaryColor}
              opacity={isSpeaking ? "0.45" : "0.28"}
              filter="url(#soft-glow)"
            />
            <circle
              cx="72"
              cy="56"
              r="7"
              fill={config.primaryColor}
              opacity={isSpeaking ? "0.45" : "0.28"}
              filter="url(#soft-glow)"
            />

            {/* EYES */}
            {/* Left Eye */}
            <g className="transition-all duration-500">
              {isReflective ? (
                <path
                  d="M 28 44 Q 36 39 42 44"
                  stroke={config.primaryColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : isWinking ? (
                <path
                  d="M 28 44 Q 35 48 42 44"
                  stroke={config.primaryColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                <>
                  <ellipse cx="35" cy="44" rx="6.5" ry="8" fill="#ffffff" />
                  <ellipse
                    cx="35"
                    cy={isCaring ? "45" : "44"}
                    rx="4.2"
                    ry="5.5"
                    fill={config.primaryColor}
                  />
                  <circle cx="36.5" cy="42" r="1.8" fill="#ffffff" />
                  <circle cx="33.5" cy="45.5" r="0.9" fill="#ffffff" />
                </>
              )}
            </g>

            {/* Right Eye */}
            <g className="transition-all duration-500">
              {isReflective ? (
                <path
                  d="M 58 44 Q 64 39 72 44"
                  stroke={config.primaryColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                <>
                  <ellipse cx="65" cy="44" rx="6.5" ry="8" fill="#ffffff" />
                  <ellipse
                    cx="65"
                    cy={isCaring ? "45" : "44"}
                    rx="4.2"
                    ry="5.5"
                    fill={config.primaryColor}
                  />
                  <circle cx="66.5" cy="42" r="1.8" fill="#ffffff" />
                  <circle cx="63.5" cy="45.5" r="0.9" fill="#ffffff" />
                </>
              )}
            </g>

            {/* MOUTH / SMILE */}
            <g className="transition-all duration-500">
              {isSpeaking ? (
                // Animated gentle speaking mouth wave
                <ellipse
                  cx="50"
                  cy="62"
                  rx="6"
                  ry="4"
                  fill={config.primaryColor}
                  opacity="0.9"
                  className="animate-pulse"
                />
              ) : isTyping ? (
                <ellipse
                  cx="50"
                  cy="62"
                  rx="4.5"
                  ry="3.5"
                  fill={config.primaryColor}
                  opacity="0.9"
                />
              ) : isCaring ? (
                <path
                  d="M 39 59 Q 50 69 61 59"
                  stroke={config.primaryColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : isWinking ? (
                <path
                  d="M 40 60 Q 51 68 63 58"
                  stroke={config.primaryColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                <path
                  d="M 41 60 Q 50 67 59 60"
                  stroke={config.primaryColor}
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </g>

            {/* Forehead Mind/Aura Node Spark */}
            <circle
              cx="50"
              cy="23"
              r={isSpeaking || isTyping ? "3" : "2"}
              fill={config.secondaryColor}
              filter="url(#soft-glow)"
              className="transition-all duration-300"
            />
          </svg>
        </div>
      </div>

      {/* Floating Status Indicator Orb */}
      <span
        className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-midnight-950 z-20 shadow-md transition-colors duration-500"
        style={{
          backgroundColor: isSpeaking ? '#22d3ee' : config.primaryColor,
        }}
      />
    </div>
  );
}
