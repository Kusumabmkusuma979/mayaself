import React, { useEffect, useRef, useState } from 'react';
import { Copy, Check, User, Sparkles, Activity, Volume2, VolumeX, Radio } from 'lucide-react';
import MayaAvatar from './MayaAvatar';
import { getEmotionConfig } from '../utils/emotions';

/**
 * Basic Markdown-like parser for bold, italic, code blocks, bullet points
 */
function FormattedContent({ content }) {
  if (!content) return null;

  // Split content by lines
  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-sm sm:text-[15px] leading-relaxed break-words">
      {lines.map((line, idx) => {
        // Empty line
        if (!line.trim()) {
          return <div key={idx} className="h-1.5" />;
        }

        // Bullet point
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-cyan-400 mt-1.5 text-xs">•</span>
              <span>{renderInlineFormatting(line.trim().substring(2))}</span>
            </div>
          );
        }

        // Numbered list
        const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-purple-400 font-mono text-xs mt-0.5">{numMatch[1]}.</span>
              <span>{renderInlineFormatting(numMatch[2])}</span>
            </div>
          );
        }

        return <p key={idx}>{renderInlineFormatting(line)}</p>;
      })}
    </div>
  );
}

function renderInlineFormatting(text) {
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/^(.*?)\*\*(.*?)\*\*(.*)/s);
    const codeMatch = remaining.match(/^(.*?)`([^`]+)`(.*)/s);

    if (boldMatch && (!codeMatch || boldMatch[1].length <= codeMatch[1].length)) {
      if (boldMatch[1]) parts.push(<span key={key++}>{boldMatch[1]}</span>);
      parts.push(
        <strong key={key++} className="font-semibold text-white">
          {boldMatch[2]}
        </strong>
      );
      remaining = boldMatch[3];
    } else if (codeMatch) {
      if (codeMatch[1]) parts.push(<span key={key++}>{codeMatch[1]}</span>);
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 rounded bg-black/40 border border-purple-500/20 text-cyan-300 font-mono text-xs">
          {codeMatch[2]}
        </code>
      );
      remaining = codeMatch[3];
    } else {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }
  }

  return parts;
}

export default function MessageList({
  messages = [],
  isTyping = false,
  currentEmotion = 'thoughtful',
  onOpenDisclaimer,
  isSpeaking = false,
  speakingMsgId = null,
  onSpeakMessage,
  onStopSpeaking
}) {
  const bottomRef = useRef(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
      {messages.map((msg) => {
        const isUser = msg.sender === 'user';
        const emotionConfig = !isUser ? getEmotionConfig(msg.emotion) : null;
        const isThisMessageSpeaking = isSpeaking && speakingMsgId === msg.id;

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-3 sm:gap-4 max-w-4xl mx-auto animate-slide-up ${
              isUser ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            {isUser ? (
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <User className="w-4 h-4" />
              </div>
            ) : (
              <div className="shrink-0 mt-0.5">
                <MayaAvatar
                  emotion={msg.emotion || 'thoughtful'}
                  size="sm"
                  isSpeaking={isThisMessageSpeaking}
                />
              </div>
            )}

            {/* Bubble Container */}
            <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[78%]`}>
              
              {/* Message Header Info */}
              <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400 px-1">
                <span className="font-medium text-slate-300">
                  {isUser ? 'You' : 'MAYA'}
                </span>
                <span>•</span>
                <span>{msg.timestamp || 'Just now'}</span>

                {/* Simulated Emotion Badge on Maya's message */}
                {!isUser && emotionConfig && (
                  <button
                    type="button"
                    onClick={onOpenDisclaimer}
                    className={`ml-1 inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-medium border ${emotionConfig.bgBadge} transition-transform hover:scale-105 cursor-pointer`}
                    title="Simulated Emotion State - Click to learn more"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: emotionConfig.primaryColor }}
                    />
                    <span>{emotionConfig.label}</span>
                  </button>
                )}
              </div>

              {/* Message Body */}
              <div
                className={`relative group rounded-2xl p-4 sm:p-5 transition-all ${
                  isUser
                    ? 'bg-gradient-to-r from-purple-700/80 to-indigo-700/80 text-white rounded-tr-none border border-purple-400/30 shadow-lg shadow-purple-950/40'
                    : 'glass-panel text-slate-200 rounded-tl-none border-purple-500/20 shadow-xl'
                } ${isThisMessageSpeaking ? 'ring-2 ring-cyan-400/50 shadow-cyan-500/20 shadow-lg' : ''}`}
                style={
                  !isUser && emotionConfig
                    ? {
                        borderLeft: `2.5px solid ${emotionConfig.primaryColor}`,
                      }
                    : undefined
                }
              >
                {/* Formatted Text Content */}
                <FormattedContent content={msg.text} />

                {/* Maya's Thought Reflection Note if present */}
                {!isUser && msg.thoughtNote && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-slate-400 italic">
                    <Activity className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>Simulated focus: {msg.thoughtNote}</span>
                  </div>
                )}

                {/* Message Actions (Top Right) */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Read Aloud Button for Maya messages */}
                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => {
                        if (isThisMessageSpeaking) {
                          onStopSpeaking?.();
                        } else {
                          onSpeakMessage?.(msg.id, msg.text, msg.emotion);
                        }
                      }}
                      className={`p-1.5 rounded-lg bg-black/40 hover:bg-black/60 transition-colors ${
                        isThisMessageSpeaking ? 'text-cyan-400 opacity-100' : 'text-slate-400 hover:text-white'
                      }`}
                      title={isThisMessageSpeaking ? "Stop speaking" : "Listen to Maya speak"}
                    >
                      {isThisMessageSpeaking ? (
                        <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-slate-400 hover:text-white transition-colors"
                    title="Copy text"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })}

      {/* Maya Active Thinking / Typing Indicator */}
      {isTyping && (
        <div className="flex items-start gap-3 sm:gap-4 max-w-4xl mx-auto animate-fade-in">
          <div className="shrink-0 mt-0.5">
            <MayaAvatar emotion={currentEmotion} size="sm" isTyping={true} />
          </div>
          <div className="flex flex-col items-start max-w-[85%]">
            <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400 px-1">
              <span className="font-medium text-slate-300">MAYA</span>
              <span>•</span>
              <span className="text-cyan-400 animate-pulse">Reflecting...</span>
            </div>
            <div className="glass-panel rounded-2xl rounded-tl-none p-3.5 px-5 flex items-center gap-3 border border-purple-500/20">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-slate-400">
                Calibrating simulated response...
              </span>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
