import React, { useState } from 'react';
import { Phrase } from '@/types/phrase';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { playCardFlipSound, triggerHaptic } from '@/lib/feedback';
import { VolumeIcon, SlowAudioIcon, FlipIcon } from '@/components/common/Icons';
import styles from './PhraseFlipCard.module.css';

interface PhraseFlipCardProps {
  phrase: Phrase;
  onLearned?: () => void;
}

export const PhraseFlipCard: React.FC<PhraseFlipCardProps> = ({ phrase, onLearned }) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const { speak, speaking } = useSpeechSynthesis();

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    playCardFlipSound();
    triggerHaptic('light');
    if (!isFlipped && onLearned) {
      onLearned();
    }
  };

  const handlePlayAudio = (e: React.MouseEvent, rate: number = 1.0) => {
    e.stopPropagation();
    speak(phrase.kannada, rate);
    triggerHaptic('light');
  };

  return (
    <div
      className={styles.cardPerspective}
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleFlip();
        }
      }}
      aria-label={`Flashcard: ${phrase.kannada}. Press Space or Enter to flip.`}
    >
      <div className={`${styles.cardInner} ${isFlipped ? styles.flipped : ''}`}>
        {/* FRONT OF CARD: Kannada Script & Romanization & Audio */}
        <div className={styles.cardFace}>
          <div className={styles.cardHeader}>
            <div className={styles.badgeGroup}>
              <span className={styles.formalityBadge}>{phrase.formality}</span>
              {!phrase.reviewed && (
                <span className={styles.reviewBadge} title="Phrase drafted for learners; verification ongoing">
                  review pending
                </span>
              )}
            </div>
            <span className={styles.flipHint}>
              <FlipIcon size={14} /> Tap to see meaning
            </span>
          </div>

          <div className={styles.mainContent}>
            <div className={styles.kannadaScript} lang="kn">
              {phrase.kannada}
            </div>
            <div className={styles.romanization}>{phrase.romanization}</div>
          </div>

          <div className={styles.audioControls}>
            <button
              type="button"
              className={`${styles.audioBtn} ${speaking ? styles.audioBtnPlaying : ''}`}
              onClick={(e) => handlePlayAudio(e, 1.0)}
              aria-label="Play normal audio"
              title="Listen at normal speed"
            >
              <VolumeIcon size={16} /> Listen
            </button>
            <button
              type="button"
              className={styles.audioBtn}
              onClick={(e) => handlePlayAudio(e, 0.75)}
              aria-label="Play slow audio"
              title="Listen slowly (0.75x)"
            >
              <SlowAudioIcon size={16} /> Slow (0.75x)
            </button>
          </div>
        </div>

        {/* BACK OF CARD: English Meaning & Cultural Usage Note */}
        <div className={`${styles.cardFace} ${styles.cardBack}`}>
          <div className={styles.cardHeader}>
            <span className={styles.formalityBadge}>{phrase.formality}</span>
            <span className={styles.flipHint}>
              <FlipIcon size={14} /> Tap to return
            </span>
          </div>

          <div className={styles.mainContent}>
            <div className={styles.englishTranslation}>{phrase.english}</div>
            <div className={styles.romanization}>{phrase.romanization}</div>

            {phrase.note && (
              <div className={styles.noteBox}>
                <span className={styles.noteLabel}>Cultural & Usage Note</span>
                {phrase.note}
              </div>
            )}
          </div>

          <div className={styles.audioControls}>
            <button
              type="button"
              className={styles.audioBtn}
              onClick={(e) => handlePlayAudio(e, 1.0)}
              aria-label="Play audio again"
            >
              <VolumeIcon size={16} /> Listen Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
