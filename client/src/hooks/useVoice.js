import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useVoice Hook
 * Provides bidirectional voice conversation:
 * 1. Speech Recognition (Microphone input -> Text)
 * 2. Speech Synthesis (Maya's Voice -> Audio with emotion acoustic modulation)
 * 3. Voice Assistant State & Controls (One-click enable, greeting, auto-resume)
 */
export function useVoice() {
  // Speech Recognition (Mic) State
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [micError, setMicError] = useState(null);
  const recognitionRef = useRef(null);
  const currentTranscriptRef = useRef('');

  // Speech Synthesis (Voice output) State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    try {
      // By default, voice assistance is enabled unless explicitly muted
      const saved = localStorage.getItem('maya_voice_muted');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [voices, setVoices] = useState([]);
  const selectedVoiceRef = useRef(null);
  const keepAliveTimerRef = useRef(null);

  // Check Speech Recognition capability
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setMicSupported(Boolean(SpeechRecognition));
  }, []);

  // Initialize Available Voices for Text-To-Speech
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (!available || available.length === 0) return;
      setVoices(available);

      // Prefer natural, warm, expressive English voices
      const preferred = available.find(v => 
        (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Google US English') || v.name.includes('Karen') || v.name.includes('Jenny')) &&
        v.lang.startsWith('en')
      ) || available.find(v => v.lang.startsWith('en'));

      selectedVoiceRef.current = preferred || available[0];
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (keepAliveTimerRef.current) {
        clearInterval(keepAliveTimerRef.current);
      }
    };
  }, []);

  // Sync Mute state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('maya_voice_muted', String(isMuted));
    } catch (e) {
      console.warn('Could not persist mute setting:', e);
    }
    if (isMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isMuted]);

  // Clean Markdown & Emojis before speaking
  const cleanTextForSpeech = (rawText) => {
    if (!rawText) return '';
    return rawText
      .replace(/[*#`_~[\]()]/g, '') // strip markdown symbols
      .replace(/https?:\/\/\S+/g, '') // strip links
      .replace(/[-•]\s/g, '') // strip bullets
      .trim();
  };

  // Speak Maya's Response with Emotion Modulation
  const speak = useCallback((text, emotion = 'warm') => {
    if (isMuted || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const clean = cleanTextForSpeech(text);
      if (!clean) return;

      const utterance = new SpeechSynthesisUtterance(clean);

      // Re-check voices if not yet cached
      if (!selectedVoiceRef.current) {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          const preferred = available.find(v => 
            (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Google US English') || v.name.includes('Karen')) &&
            v.lang.startsWith('en')
          ) || available.find(v => v.lang.startsWith('en'));
          selectedVoiceRef.current = preferred || available[0];
        }
      }

      if (selectedVoiceRef.current) {
        utterance.voice = selectedVoiceRef.current;
      }

      // Emotion Acoustic Modulation
      switch (emotion) {
        case 'calm':
          utterance.rate = 0.85;
          utterance.pitch = 0.92;
          break;
        case 'empathetic':
          utterance.rate = 0.88;
          utterance.pitch = 0.98;
          break;
        case 'thoughtful':
          utterance.rate = 0.88;
          utterance.pitch = 0.95;
          break;
        case 'playful':
          utterance.rate = 1.05;
          utterance.pitch = 1.15;
          break;
        case 'curious':
          utterance.rate = 1.02;
          utterance.pitch = 1.12;
          break;
        case 'optimistic':
          utterance.rate = 1.00;
          utterance.pitch = 1.08;
          break;
        case 'warm':
        default:
          utterance.rate = 0.95;
          utterance.pitch = 1.05;
          break;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        // Chromium keepalive workaround for long utterances
        if (keepAliveTimerRef.current) clearInterval(keepAliveTimerRef.current);
        keepAliveTimerRef.current = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(keepAliveTimerRef.current);
          } else {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 10000);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (keepAliveTimerRef.current) clearInterval(keepAliveTimerRef.current);
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error/cancelled:', e);
        setIsSpeaking(false);
        if (keepAliveTimerRef.current) clearInterval(keepAliveTimerRef.current);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Failed to speak:', err);
      setIsSpeaking(false);
    }
  }, [isMuted]);

  // Stop Speaking Immediately
  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (keepAliveTimerRef.current) {
      clearInterval(keepAliveTimerRef.current);
    }
    setIsSpeaking(false);
  }, []);

  // Explicitly Enable Voice Assistant with optional greeting
  const enableVoiceAssistant = useCallback((greeting = "Voice assistance enabled. I am listening to you.") => {
    setIsMuted(false);
    try {
      localStorage.setItem('maya_voice_muted', 'false');
    } catch {}

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      if (greeting) {
        speak(greeting, 'warm');
      }
    }
    return true;
  }, [speak]);

  // Explicitly Toggle Voice Assistant
  const toggleVoiceAssistant = useCallback(() => {
    if (isMuted) {
      enableVoiceAssistant("Voice assistance enabled.");
    } else {
      stopSpeaking();
      setIsMuted(true);
      try {
        localStorage.setItem('maya_voice_muted', 'true');
      } catch {}
    }
  }, [isMuted, enableVoiceAssistant, stopSpeaking]);

  // Active listening intent and accumulated text across speech bursts
  const shouldListenRef = useRef(false);
  const accumulatedTranscriptRef = useRef('');

  // Clear any existing mic error
  const clearMicError = useCallback(() => {
    setMicError(null);
  }, []);

  // Stop Microphone Listening
  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        try {
          recognitionRef.current.abort();
        } catch (err) {}
      }
    }
  }, []);

  // Start Microphone Listening with English / Kannada language support
  const startListening = useCallback(async (onResultCallback, onEndCallback, lang = 'en-IN') => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError('unsupported');
      return;
    }

    // Pre-check / Request microphone hardware permission explicitly
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (permErr) {
        console.warn('Microphone permission check denied:', permErr);
        setMicError('not-allowed');
        setIsListening(false);
        shouldListenRef.current = false;
        return;
      }
    }

    try {
      setMicError(null);
      shouldListenRef.current = true;
      accumulatedTranscriptRef.current = '';
      currentTranscriptRef.current = '';

      // Safely cleanup any active session before starting a new one
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = lang; // 'en-IN', 'en-US', or 'kn-IN'
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let interim = '';
        let finalSegment = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalSegment += (finalSegment ? ' ' : '') + item[0].transcript;
          } else {
            interim += (interim ? ' ' : '') + item[0].transcript;
          }
        }

        if (finalSegment) {
          accumulatedTranscriptRef.current = accumulatedTranscriptRef.current
            ? `${accumulatedTranscriptRef.current} ${finalSegment}`
            : finalSegment;
        }

        const currentTotal = accumulatedTranscriptRef.current
          ? (interim ? `${accumulatedTranscriptRef.current} ${interim}` : accumulatedTranscriptRef.current)
          : interim;

        currentTranscriptRef.current = currentTotal.trim();

        if (onResultCallback) {
          onResultCallback(currentTranscriptRef.current);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error event:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          shouldListenRef.current = false;
          setMicError('not-allowed');
          setIsListening(false);
        } else if (event.error === 'no-speech') {
          // Do not kill session on silence pause
        } else if (event.error === 'network') {
          console.warn('Speech recognition network event handled gracefully');
        } else if (event.error !== 'aborted') {
          setMicError(event.error);
        }
      };

      recognition.onend = () => {
        // If user is still intending to speak, seamlessly restart recognition
        if (shouldListenRef.current) {
          try {
            recognition.start();
            return;
          } catch (restartErr) {
            console.warn('Speech recognition auto-restart:', restartErr);
          }
        }
        setIsListening(false);
        if (onEndCallback) {
          onEndCallback(currentTranscriptRef.current);
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      if (err.name === 'NotAllowedError') {
        setMicError('not-allowed');
      } else {
        setMicError(err.message || 'error');
      }
      setIsListening(false);
      shouldListenRef.current = false;
    }
  }, []);

  return {
    isListening,
    micSupported,
    micError,
    clearMicError,
    startListening,
    stopListening,
    isSpeaking,
    isMuted,
    setIsMuted,
    enableVoiceAssistant,
    toggleVoiceAssistant,
    speak,
    stopSpeaking,
  };
}
