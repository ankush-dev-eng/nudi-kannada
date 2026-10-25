import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechSynthesisReturn {
  speak: (text: string, rate?: number) => void;
  cancel: () => void;
  speaking: boolean;
  isSupported: boolean;
  hasKannadaVoice: boolean;
  availableVoices: SpeechSynthesisVoice[];
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [hasKannadaVoice, setHasKannadaVoice] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);

      // Prioritize explicit Kannada voice (kn-IN)
      const knVoice = voices.find(
        (v) =>
          v.lang.toLowerCase() === 'kn-in' ||
          v.lang.toLowerCase().startsWith('kn') ||
          v.name.toLowerCase().includes('kannada')
      );

      if (knVoice) {
        selectedVoiceRef.current = knVoice;
        setHasKannadaVoice(true);
      } else {
        // Fallback to Indian English or first Indic voice if present, else default
        const indicVoice = voices.find(
          (v) => v.lang.toLowerCase().includes('in') || v.lang.toLowerCase().startsWith('hi')
        );
        selectedVoiceRef.current = indicVoice || voices[0] || null;
        setHasKannadaVoice(false);
      }
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  const speak = useCallback((text: string, rate: number = 1.0) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate; // 1.0 = normal, 0.75 = slow
    utterance.pitch = 1.0;
    utterance.lang = 'kn-IN';

    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  return {
    speak,
    cancel,
    speaking,
    isSupported,
    hasKannadaVoice,
    availableVoices,
  };
}
