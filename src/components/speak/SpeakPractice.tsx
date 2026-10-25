import React, { useState, useEffect, useCallback } from 'react';
import { Phrase } from '@/types/phrase';
import { PronunciationResult } from '@/types/progress';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { scorePronunciation } from '@/lib/scoring';
import { playSuccessSound, playErrorSound, triggerHaptic } from '@/lib/feedback';
import { useAppStore } from '@/store/useAppStore';
import { AudioWaveform } from './AudioWaveform';
import { VolumeIcon, MicIcon, RefreshIcon } from '@/components/common/Icons';
import styles from './SpeakPractice.module.css';

interface SpeakPracticeProps {
  phrase: Phrase;
  onAttemptComplete?: (result: PronunciationResult) => void;
}

export const SpeakPractice: React.FC<SpeakPracticeProps> = ({ phrase, onAttemptComplete }) => {
  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } =
    useSpeechRecognition();
  const { speak, speaking } = useSpeechSynthesis();
  const { markPhraseLearned } = useAppStore();

  const [lastResult, setLastResult] = useState<PronunciationResult | null>(null);
  const [showFallback, setShowFallback] = useState<boolean>(!isSupported);
  const [fallbackText, setFallbackText] = useState<string>('');

  const evaluateSpeech = useCallback(
    (spokenText: string) => {
      const result = scorePronunciation(phrase.kannada, phrase.romanization, spokenText);
      setLastResult(result);

      // Audio & haptic feedback
      if (result.passed) {
        playSuccessSound();
        triggerHaptic('success');
        markPhraseLearned(phrase.id, phrase.situationId);
      } else {
        playErrorSound();
        triggerHaptic('medium');
      }

      if (onAttemptComplete) {
        onAttemptComplete(result);
      }
    },
    [phrase, markPhraseLearned, onAttemptComplete]
  );

  // Handle speech recognition completion
  useEffect(() => {
    if (transcript && !isListening) {
      evaluateSpeech(transcript);
    }
  }, [transcript, isListening, evaluateSpeech]);

  const handleToggleRecord = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setLastResult(null);
      startListening();
      triggerHaptic('light');
    }
  };

  const handleFallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fallbackText.trim()) return;
    evaluateSpeech(fallbackText.trim());
  };

  const handleListen = (slow = false) => {
    speak(phrase.kannada, slow ? 0.75 : 1.0);
    triggerHaptic('light');
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <span className={`${styles.badge} ${phrase.formality === 'polite' ? styles.formal : ''}`}>
          {phrase.formality}
        </span>
        <button
          type="button"
          className={styles.listenBtn}
          onClick={() => {
            setLastResult(null);
            resetTranscript();
            setFallbackText('');
          }}
          title="Reset practice"
        >
          <RefreshIcon size={14} /> Clear
        </button>
      </header>

      <section className={styles.targetCard}>
        <div className={styles.kannadaText}>{phrase.kannada}</div>
        <div className={styles.romanText}>{phrase.romanization}</div>
        <div className={styles.englishText}>{phrase.english}</div>

        <div className={styles.audioControls}>
          <button
            type="button"
            className={styles.listenBtn}
            onClick={() => handleListen(false)}
            disabled={speaking}
          >
            <VolumeIcon size={16} /> Listen (1.0x)
          </button>
          <button
            type="button"
            className={styles.listenBtn}
            onClick={() => handleListen(true)}
            disabled={speaking}
          >
            <VolumeIcon size={16} /> Slow (0.75x)
          </button>
        </div>
      </section>

      <AudioWaveform isRecording={isListening} />

      <section className={styles.micSection}>
        <button
          type="button"
          className={`${styles.recordBtn} ${isListening ? styles.recording : ''}`}
          onClick={handleToggleRecord}
          aria-label={isListening ? 'Stop speaking' : 'Start speaking'}
        >
          <MicIcon size={32} />
        </button>
        <div className={styles.micHint}>
          {isListening
            ? 'Listening... Click again when finished speaking'
            : 'Tap the mic and speak the Kannada phrase aloud'}
        </div>
      </section>

      {lastResult && (
        <section className={styles.resultCard} aria-live="polite">
          <div className={styles.scoreHeader}>
            <span className={styles.scoreLabel}>{lastResult.feedback}</span>
            <span
              className={`${styles.scorePercent} ${
                lastResult.score >= 80
                  ? styles.good
                  : lastResult.score >= 60
                    ? styles.moderate
                    : styles.low
              }`}
            >
              {lastResult.score}%
            </span>
          </div>

          <div className={styles.transcriptRow}>
            <strong>You said:</strong> {lastResult.recognizedText || '(No speech detected)'}
          </div>

          {lastResult.wordResults.length > 0 && (
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.2rem' }}>
                Word accuracy:
              </div>
              <div className={styles.wordMatchContainer}>
                {lastResult.wordResults.map((w, idx) => (
                  <span
                    key={idx}
                    className={`${styles.wordChip} ${w.matched ? styles.matched : styles.missed}`}
                  >
                    {w.expected}: {w.spoken} {w.matched ? '✓' : '✗'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <div>
        <button
          type="button"
          className={styles.fallbackToggleBtn}
          onClick={() => setShowFallback(!showFallback)}
        >
          {showFallback
            ? 'Hide text fallback'
            : 'Having microphone or voice recognition issues? Use text fallback'}
        </button>

        {showFallback && (
          <form onSubmit={handleFallbackSubmit} className={styles.textFallbackInputGroup}>
            <input
              type="text"
              value={fallbackText}
              onChange={(e) => setFallbackText(e.target.value)}
              placeholder="Type in Kannada or English script (e.g. namaskara)"
              className={styles.fallbackInput}
              aria-label="Text pronunciation input"
            />
            <button type="submit" className={styles.fallbackSubmitBtn}>
              Score
            </button>
          </form>
        )}
      </div>
    </article>
  );
};
