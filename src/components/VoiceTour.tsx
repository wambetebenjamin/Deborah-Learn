"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const script = `Welcome to Deborah Learn. We are an online school built for East African learners who want to grow their skills from wherever they are. Browse courses across business, technology, health, and more. Enrol, learn at your own pace, and earn a certificate you can share and verify. Your next skill starts today.`;

export default function VoiceTour() {
  const [speaking, setSpeaking] = useState(false);
  const [played, setPlayed] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggle = useCallback(() => {
    if (!supported) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.lang = "en-KE";
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setPlayed(true);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setPlayed(true);
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }, [speaking, supported]);

  const label = speaking ? "Stop the site tour" : played ? "Replay tour" : "Hear what this site is about";
  const tooltip = !supported
    ? "Voice tour is not supported in this browser"
    : speaking
      ? "Stop the tour"
      : played
        ? "Replay tour"
        : "Hear what this site is about";

  return (
    <button
      type="button"
      className="voice-button floating-action"
      onClick={toggle}
      aria-label={label}
      aria-pressed={speaking}
      disabled={!supported}
    >
      {speaking && <span className="voice-ring" aria-hidden="true" />}
      {speaking ? (
        <VolumeX size={24} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Volume2 size={24} strokeWidth={2} aria-hidden="true" />
      )}
      <span className="floating-tooltip" role="tooltip">
        {tooltip}
      </span>
    </button>
  );
}
