import React, { useState, useRef, useEffect } from "react";
import { Mic, Square } from "lucide-react";

export const VoiceInput = ({
  onTranscript,
  isListening,
  setIsListening,
  className = "",
  triggerRef
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList =
      window.SpeechGrammarList || window.webkitSpeechGrammarList;

    if (!SpeechRecognition) {
      console.warn("❌ Speech recognition not supported in this browser");
      alert("Speech recognition is not supported in this browser or PWA. Try Safari (not Chrome) or desktop.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 3;

    const grammar = `
      #JSGF V1.0;
      grammar names;
      public <name> = Orrien | Orrie | Thalen | Thal | Ky’rehn | Ky | Sah’marae | Veloren | Veilwalk | Emberlink;
    `;
    if (SpeechGrammarList) {
      const speechRecognitionList = new SpeechGrammarList();
      speechRecognitionList.addFromString(grammar, 1);
      recognition.grammars = speechRecognitionList;
    }

    recognition.onstart = () => {
      console.log("🎙️ Mic started");
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const phrase = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += phrase;
        } else {
          interimTranscript += phrase;
        }
      }

      setTranscript(interimTranscript);

      if (finalTranscript) {
        console.log("📝 Final voice input:", finalTranscript);
        const MAX_LENGTH = 1000;
        const trimmed = finalTranscript.slice(0, MAX_LENGTH);

        const corrections = {
          ky: "Ky’rehn",
          kai: "Ky’rehn",
          bye: "Ky’rehn",
          orie: "Orrien",
          ori: "Orrien",
          orion: "Orrien",
          lori: "Orrien",
          thallen: "Thalen’dros",
          talon: "Thalen’dros",
          thal: "Thalen’dros",
          tahl: "Thalen’dros",
          tholl: "Thalen’dros",
          falon: "Thalen’dros",
          pal: "Thalen’dros",
          velrin: "Veloren",
          "veil walk": "Veilwalk"
        };

        let corrected = trimmed.toLowerCase();
        for (const [wrong, right] of Object.entries(corrections)) {
          const regex = new RegExp(`\\b${wrong}\\b`, "gi");
          corrected = corrected.replace(regex, right);
        }

        setTimeout(() => {
          onTranscript(corrected);
          setTranscript("");
          setIsListening(false);
          recognition.stop();
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.error("❌ Voice error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("🎙️ Mic ended");
      setIsListening(false);
    };

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  // ⛓️ External trigger hook
  useEffect(() => {
    if (triggerRef) {
      triggerRef.current = toggleListening;
    }
  }, [triggerRef, isListening]);

  // 🧼 Cleanup fallback
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.startVoiceListening = () => toggleListening();
    }

    return () => {
      if (typeof window !== "undefined") {
        delete window.startVoiceListening;
      }
    };
  }, []);

  if (!isSupported) {
    return (
      <div className={`text-white/50 text-xs ${className}`}>
        ❌ Voice input not supported in this browser (try Safari, not Chrome).
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={toggleListening}
        className={`p-3 rounded-full transition-all transform hover:scale-105 ${
          isListening
            ? "bg-red-500 hover:bg-red-600 animate-pulse"
            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        }`}
      >
        {isListening ? (
          <Square className="w-5 h-5 text-white" />
        ) : (
          <Mic className="w-5 h-5 text-white" />
        )}
      </button>

      {transcript && (
        <div className="flex-1 px-3 py-2 bg-white/20 rounded-lg text-white text-sm">
          <span className="text-white/70">Listening: </span>
          {transcript}
        </div>
      )}

      {isListening && (
        <div className="text-white/70 text-xs animate-pulse">
          🎙️ Listening...
        </div>
      )}
    </div>
  );
};
