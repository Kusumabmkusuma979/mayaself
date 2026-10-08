import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Mic, MicOff, Compass, AlertCircle, X } from 'lucide-react';
import { getApiUrl } from '../utils/api';

export default function MessageInput({
  onSendMessage,
  isTyping = false,
  onOpenRealityCheck,
  placeholder = "Message Maya... (or click 🎤 to speak)"
}) {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState('en-US'); // 'en-US' (English) | 'kn-IN' (ಕನ್ನಡ)
  const [speechSupported, setSpeechSupported] = useState(true);
  const [micError, setMicError] = useState(null);

  const textareaRef = useRef(null);
  const baseTextRef = useRef('');
  const recognitionRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [text]);

  // Check Web Speech API availability on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition API is not supported in this browser.");
      setSpeechSupported(false);
    }
  }, []);

  // Cleanup any running recognition on unmount
  useEffect(() => {
    return () => {
      console.log("[SPEECH TRACKER] MessageInput component unmounted / cleanup running");
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
        recognitionRef.current = null;
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || isTyping) return;

    // Safely stop recognition if active
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
      recognitionRef.current = null;
      setIsListening(false);
    }

    onSendMessage(text.trim());
    setText('');
    baseTextRef.current = '';
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const [lastSpeechEvent, setLastSpeechEvent] = useState(null);
  const lastEventRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const hasResultRef = useRef(false);

  // Helper to safely stop media recorder and release hardware mic tracks
  const stopHardwareMediaStream = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      } catch (e) {}
      mediaStreamRef.current = null;
    }
  };

  // Helper to transcribe captured audio buffer via backend fallback
  const processFallbackAudio = async (targetLang) => {
    if (hasResultRef.current || audioChunksRef.current.length === 0) return;

    try {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      if (blob.size < 1200) return; // Insignificant audio data

      console.log("[SPEECH FALLBACK] Web Speech API produced no transcript. Invoking backend transcription fallback...");
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result.split(',')[1];
          const response = await fetch(getApiUrl('/api/transcribe'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audio: base64Data,
              mimeType: blob.type || 'audio/webm',
              lang: targetLang
            })
          });

          const result = await response.json();
          if (result.success && result.transcript && result.transcript.trim()) {
            const transcript = result.transcript.trim();
            console.log("SPEECH RESULT:", transcript);
            hasResultRef.current = true;
            const base = baseTextRef.current ? baseTextRef.current + " " : "";
            setText(base + transcript);
            setMicError(null);
          }
        } catch (postErr) {
          console.warn("[SPEECH FALLBACK] Fallback request failed:", postErr);
        }
      };
      reader.readAsDataURL(blob);
    } catch (fallbackErr) {
      console.warn("[SPEECH FALLBACK] Could not process audio fallback:", fallbackErr);
    }
  };

  const handleMicToggle = async () => {
    console.log("MIC BUTTON CLICKED");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition API is not supported in this browser.");
      setSpeechSupported(false);
      setMicError("unsupported");
      return;
    }

    // 1. If currently listening, stop recognition safely
    if (isListening || recognitionRef.current) {
      console.log("STOPPING SPEECH RECOGNITION (User toggle)");
      const currentTargetLang = speechLang === "kn-IN" ? "kn-IN" : "en-US";
      stopHardwareMediaStream();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.warn("Recognition stop warning:", err);
        }
        recognitionRef.current = null;
      }
      setIsListening(false);
      // If user stopped and no Web Speech result yet, try audio fallback
      setTimeout(() => processFallbackAudio(currentTargetLang), 300);
      return;
    }

    // 2. Prevent duplicate recognition instances - safely stop prior instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }

    stopHardwareMediaStream();
    setMicError(null);
    setLastSpeechEvent('initializing');
    lastEventRef.current = 'initializing';
    hasResultRef.current = false;
    audioChunksRef.current = [];

    // Save existing typed text before voice input starts
    baseTextRef.current = text.trim();

    const targetLang = speechLang === "kn-IN" ? "kn-IN" : "en-US";

    // Start background audio recording to guarantee audio fallback if Web Speech service times out
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        mediaStreamRef.current = stream;

        if (typeof MediaRecorder !== 'undefined') {
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;
          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };
          recorder.start(250);
        }
      } catch (mediaErr) {
        console.warn("[SPEECH AUDIO] Hardware stream notice:", mediaErr);
      }
    }

    try {
      // 3. Create recognition instance
      const recognition = new SpeechRecognition();
      console.log("SPEECH RECOGNITION CREATED");

      // 4. Configure recognition parameters exactly as required
      recognition.lang = targetLang;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Log requested system diagnostics
      console.log("=== SPEECH RECOGNITION CONFIGURATION & ENVIRONMENT ===");
      console.log("recognition.lang:", recognition.lang);
      console.log("recognition.continuous:", recognition.continuous);
      console.log("recognition.interimResults:", recognition.interimResults);
      console.log("recognition.maxAlternatives:", recognition.maxAlternatives);
      console.log("navigator.mediaDevices:", navigator.mediaDevices);
      console.log("window.SpeechRecognition:", window.SpeechRecognition);
      console.log("window.webkitSpeechRecognition:", window.webkitSpeechRecognition);
      console.log("======================================================");

      const trackEvent = (eventName) => {
        lastEventRef.current = eventName;
        setLastSpeechEvent(eventName);
        console.log(`[SPEECH TRACKER] Last event received so far: ${eventName}`);
      };

      // 5. Wire all 10 SpeechRecognition lifecycle events with required logs
      recognition.onstart = () => {
        console.log("SPEECH STARTED");
        console.log("[SPEECH EVENT] onstart: Speech recognition service has started");
        trackEvent('onstart');
        setIsListening(true);
        setMicError(null);
      };

      recognition.onaudiostart = () => {
        console.log("AUDIO STARTED");
        console.log("[SPEECH EVENT] onaudiostart: Audio capture started by browser");
        trackEvent('onaudiostart');
      };

      recognition.onsoundstart = () => {
        console.log("SOUND STARTED");
        console.log("[SPEECH EVENT] onsoundstart: Sound has been detected by microphone");
        trackEvent('onsoundstart');
      };

      recognition.onspeechstart = () => {
        console.log("SPEECH DETECTED");
        console.log("[SPEECH EVENT] onspeechstart: Human speech recognized by speech engine");
        trackEvent('onspeechstart');
      };

      recognition.onresult = (event) => {
        let transcript = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          transcript += event.results[i][0].transcript;
        }

        console.log("SPEECH RESULT:", transcript);
        hasResultRef.current = true;
        trackEvent('onresult');

        // Put transcript directly into the existing MAYA message input without auto-send
        const base = baseTextRef.current ? baseTextRef.current + " " : "";
        setText(base + transcript);
      };

      recognition.onspeechend = () => {
        console.log("SPEECH ENDED");
        console.log("[SPEECH EVENT] onspeechend: Human speech has stopped");
        trackEvent('onspeechend');
      };

      recognition.onsoundend = () => {
        console.log("SOUND ENDED");
        console.log("[SPEECH EVENT] onsoundend: Sound input has stopped");
        trackEvent('onsoundend');
      };

      recognition.onaudioend = () => {
        console.log("AUDIO ENDED");
        console.log("[SPEECH EVENT] onaudioend: Audio capture stopped by browser");
        trackEvent('onaudioend');
      };

      recognition.onerror = (event) => {
        const errorDetail = event.error || "unknown-error";
        console.error("SPEECH ERROR:", errorDetail, event);
        console.error("[SPEECH EVENT] onerror: EXACT ERROR:", errorDetail, "| Event object:", event);
        trackEvent(`onerror (${errorDetail})`);
        setIsListening(false);
        recognitionRef.current = null;
        stopHardwareMediaStream();

        // If no-speech occurred, trigger backend audio fallback to ensure user voice is transcribed
        if (errorDetail === 'no-speech' && !hasResultRef.current) {
          setTimeout(() => processFallbackAudio(targetLang), 100);
        } else {
          setMicError(errorDetail);
        }
      };

      recognition.onend = () => {
        console.log(`RECOGNITION ENDED`);
        console.log(`[SPEECH EVENT] onend: Session ended. Last event was: ${lastEventRef.current}`);
        trackEvent('onend');
        setIsListening(false);
        recognitionRef.current = null;
        stopHardwareMediaStream();

        // If session finished without transcript, attempt backend audio fallback
        if (!hasResultRef.current) {
          setTimeout(() => processFallbackAudio(targetLang), 150);
        }
      };

      recognitionRef.current = recognition;

      // 6. Start speech recognition
      recognition.start();
    } catch (err) {
      console.error("SPEECH ERROR:", err);
      console.error("[SPEECH ERROR] Exception during recognition.start():", err);
      setIsListening(false);
      recognitionRef.current = null;
      stopHardwareMediaStream();
      setMicError(err.message || "start-failed");
      lastEventRef.current = "start-failed";
      setLastSpeechEvent("start-failed");
    }
  };

  const handleLanguageChange = (lang) => {
    setSpeechLang(lang);
    // If active, stop safely so next mic click uses new language
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
      setIsListening(false);
    }
  };

  const isKannada = speechLang === 'kn-IN';

  return (
    <div className="relative w-full">
      {/* ⚠️ Microphone Permission Blocked Notice */}
      {(micError === 'not-allowed' || micError === 'permission-denied') && (
        <div className="mb-2 p-3 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs shadow-xl animate-fade-in flex items-start justify-between gap-3 backdrop-blur-md">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-100">Microphone Permission Blocked</span>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                Microphone access was denied. To enable voice input: Click the <strong>lock icon 🔒</strong> in your browser's address bar, set <strong>Microphone to "Allow"</strong>, and reload this page.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMicError(null)}
            className="p-1 rounded-lg hover:bg-white/10 text-amber-300 hover:text-white transition-colors cursor-pointer"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ⚠️ Specific Speech Recognition Error Notices */}
      {micError && micError !== 'not-allowed' && micError !== 'permission-denied' && micError !== 'unsupported' && (
        <div className="mb-2 p-2.5 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs shadow-lg animate-fade-in flex items-center justify-between gap-2 backdrop-blur-md">
          <div className="flex items-center gap-2 text-[11px]">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>
              <strong>Speech Error: "{micError}"</strong>
              <span className="ml-1 opacity-80">(Last event: {lastSpeechEvent || 'none'})</span>
              {micError === 'no-speech' && " — No speech was detected before timeout. Please speak closer to your microphone."}
              {micError === 'audio-capture' && " — No microphone detected or microphone is in use."}
              {micError === 'network' && " — Network connection to speech service failed. Please check internet access."}
              {micError === 'language-not-supported' && " — The selected language is not supported by your speech engine."}
            </span>
          </div>
          <button
            type="button"
            onClick={() => { setMicError(null); setLastSpeechEvent(null); }}
            className="p-1 rounded hover:bg-white/10 text-red-300 hover:text-white cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ⚠️ Unsupported Browser Notice */}
      {(micError === 'unsupported' || !speechSupported) && (
        <div className="mb-2 p-3 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs shadow-xl animate-fade-in flex items-start justify-between gap-3 backdrop-blur-md">
          <div className="flex items-start gap-2.5">
            <MicOff className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white">Voice Input Not Supported</span>
              <p className="text-[11px] text-purple-200/90 leading-relaxed">
                Voice input is not supported in this browser. Please use Microsoft Edge or Google Chrome.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMicError(null)}
            className="p-1 rounded-lg hover:bg-white/10 text-purple-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 🔴 Active Listening Visual State Banner (Never shows if micError exists) */}
      {isListening && !micError && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-950/80 via-purple-950/60 to-midnight-900/80 border border-red-500/40 text-xs text-red-200 shadow-lg animate-pulse flex items-center justify-between gap-2 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="font-semibold text-white text-[11px] sm:text-xs">
              {isKannada
                ? `ಕೇಳಿಸಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ... [${lastSpeechEvent || 'onstart'}] ಮಾತನಾಡಿ...`
                : `Listening... [Event: ${lastSpeechEvent || 'onstart'}] — speak now ("Hello Maya")...`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleMicToggle}
            className="px-2 py-0.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-[11px] font-semibold transition-colors cursor-pointer"
            title="Click to stop recording"
          >
            Stop ⏹️
          </button>
        </div>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`glass-panel rounded-2xl p-2 border transition-all duration-300 shadow-xl ${
          isListening
            ? 'border-red-400/80 ring-2 ring-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.25)]'
            : 'border-purple-500/25 focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-500/20'
        }`}>
          <div className="flex items-end gap-2 px-2 py-1">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening
                  ? (isKannada ? "ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ... (Speak in Kannada...)" : "Listening... speak now...")
                  : placeholder
              }
              disabled={isTyping}
              className="flex-1 bg-transparent border-0 text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none max-h-36 py-2 px-1 leading-relaxed"
            />

            {/* Language Selector: English (en-US) / Kannada (kn-IN) */}
            <div className="flex items-center rounded-xl bg-midnight-950/80 border border-purple-500/20 p-0.5 shrink-0" title="Select Voice Input Language">
              <button
                type="button"
                onClick={() => handleLanguageChange('en-US')}
                disabled={isTyping}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  !isKannada
                    ? 'bg-purple-600/35 text-cyan-200 border border-purple-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="English Voice Input (en-US)"
                aria-label="Set voice input to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('kn-IN')}
                disabled={isTyping}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  isKannada
                    ? 'bg-cyan-600/35 text-cyan-200 border border-cyan-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="ಕನ್ನಡ (Kannada) Voice Input (kn-IN)"
                aria-label="Set voice input to Kannada"
              >
                ಕನ್ನಡ
              </button>
            </div>

            {/* 🎤 Microphone Voice Input Button */}
            <button
              type="button"
              onClick={handleMicToggle}
              disabled={isTyping}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-red-500/25 text-red-300 border border-red-500/60 shadow-lg shadow-red-500/30 scale-105'
                  : speechSupported
                  ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-300 border border-white/10'
                  : 'bg-white/5 text-slate-600 border border-white/5 opacity-50 cursor-not-allowed'
              }`}
              title={
                !speechSupported
                  ? "Voice input is not supported in this browser. Please use Microsoft Edge or Google Chrome."
                  : isListening
                  ? "Listening... Click to stop recording"
                  : `Click to speak (${isKannada ? 'Kannada' : 'English'})`
              }
              aria-label={isListening ? "Stop voice recording" : "Start voice recording"}
            >
              {isListening ? (
                <div className="relative flex items-center justify-center">
                  <Mic className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-red-400 animate-ping" />
                </div>
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            {/* Send Message Button (User explicitly reviews and sends) */}
            <button
              type="submit"
              disabled={!text.trim() || isTyping}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 ${
                text.trim() && !isTyping
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 cursor-pointer'
                  : 'bg-white/5 text-slate-500 cursor-not-allowed'
              }`}
              aria-label="Send message"
              title={text.trim() ? "Send message" : "Type or speak a message to send"}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Footer Shortcuts & Grounding Tools */}
          <div className="flex items-center justify-between px-3 pt-1.5 pb-0.5 border-t border-white/5 text-[10px] text-slate-500">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-slate-400">
                <Sparkles className="w-3 h-3 text-cyan-400/70" />
                <span>Voice: <strong>{isKannada ? 'ಕನ್ನಡ (kn-IN)' : 'English (en-US)'}</strong></span>
              </span>

              <span>•</span>

              {/* Quick Reality Check Button */}
              <button
                type="button"
                onClick={onOpenRealityCheck}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-cyan-200 border border-purple-500/20 transition-all font-medium cursor-pointer"
                title="Need grounding? Get an objective reality check"
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reality Check</span>
              </button>
            </div>

            <span className="hidden sm:inline text-slate-500">
              Review text & press <kbd className="px-1 py-0.5 rounded bg-white/5 font-mono text-[9px] text-slate-400">Enter</kbd> to send
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
