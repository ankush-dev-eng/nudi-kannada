import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { UserReviewGrade } from '@/lib/scheduler';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { playSuccessSound, playErrorSound, playCardFlipSound, triggerHaptic } from '@/lib/feedback';
import { ChevronLeftIcon, VolumeIcon, FlameIcon, CheckIcon } from '@/components/common/Icons';
import styles from './ReviewPage.module.css';

export const ReviewPage: React.FC = () => {
  const { getDueReviewPhrases, submitReview, streak, cards } = useAppStore();
  const { speak, speaking } = useSpeechSynthesis();

  const [dueQueue, setDueQueue] = useState<ReturnType<typeof getDueReviewPhrases>>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [sessionCount, setSessionCount] = useState<number>(0);

  useEffect(() => {
    const phrases = getDueReviewPhrases();
    setDueQueue(phrases);
    setCurrentIdx(0);
    setIsRevealed(false);
  }, [getDueReviewPhrases, cards]);

  const currentPhrase = dueQueue[currentIdx];

  const handleReveal = () => {
    setIsRevealed(true);
    playCardFlipSound();
    triggerHaptic('light');
  };

  const handleRate = async (grade: UserReviewGrade) => {
    if (!currentPhrase) return;

    if (grade === 'again') {
      playErrorSound();
      triggerHaptic('medium');
    } else {
      playSuccessSound();
      triggerHaptic('success');
    }

    await submitReview(currentPhrase.id, grade);
    setSessionCount((prev) => prev + 1);
    setIsRevealed(false);

    if (currentIdx < dueQueue.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Completed current queue
      setDueQueue([]);
    }
  };

  const progressPercent =
    dueQueue.length > 0 ? Math.round((currentIdx / dueQueue.length) * 100) : 100;

  return (
    <main className={styles.pageContainer}>
      <header className={styles.topBar}>
        <Link to="/" className={styles.backLink} aria-label="Back to home">
          <ChevronLeftIcon size={16} /> Home
        </Link>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--kumkuma)' }}
        >
          <FlameIcon size={18} />
          <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>
            {streak.currentStreak} day streak
          </span>
        </div>
      </header>

      <section className={styles.pageHeader}>
        <h1 className={styles.titleKannada}>ದೈನಂದಿನ ಪುನರಾವರ್ತನೆ</h1>
        <div className={styles.titleEnglish}>Spaced Repetition Review (SM-2)</div>
      </section>

      {dueQueue.length > 0 && currentPhrase ? (
        <>
          <div className={styles.queueProgress}>
            <span>
              Card {currentIdx + 1} of {dueQueue.length}
            </span>
            <span>{sessionCount} reviewed this session</span>
          </div>

          <div
            className={styles.progressBarContainer}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Review session progress"
          >
            <div className={styles.progressBarFill} style={{ width: `${progressPercent}%` }} />
          </div>

          <article className={styles.cardContainer}>
            <div className={styles.cardKannada}>{currentPhrase.kannada}</div>
            <div className={styles.cardRoman}>{currentPhrase.romanization}</div>

            <div style={{ margin: '0.25rem 0' }}>
              <button
                type="button"
                className={styles.revealBtn}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                onClick={() => speak(currentPhrase.kannada)}
                disabled={speaking}
              >
                <VolumeIcon size={16} /> Listen to Audio
              </button>
            </div>

            {!isRevealed ? (
              <button type="button" className={styles.revealBtn} onClick={handleReveal}>
                Show Meaning & Answer (ಉತ್ತರ ನೋಡಿ)
              </button>
            ) : (
              <>
                <div className={styles.cardEnglish}>{currentPhrase.english}</div>
                {currentPhrase.note && (
                  <div className={styles.cardNote}>Note: {currentPhrase.note}</div>
                )}

                <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                  How easily did you recall this phrase?
                </div>

                <div className={styles.ratingGrid}>
                  <button
                    type="button"
                    className={`${styles.rateBtn} ${styles.again}`}
                    onClick={() => handleRate('again')}
                  >
                    <span className={styles.rateLabel}>Again</span>
                    <span className={styles.rateSub}>1 day</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.rateBtn} ${styles.hard}`}
                    onClick={() => handleRate('hard')}
                  >
                    <span className={styles.rateLabel}>Hard</span>
                    <span className={styles.rateSub}>2 days</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.rateBtn} ${styles.good}`}
                    onClick={() => handleRate('good')}
                  >
                    <span className={styles.rateLabel}>Good</span>
                    <span className={styles.rateSub}>4 days</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.rateBtn} ${styles.easy}`}
                    onClick={() => handleRate('easy')}
                  >
                    <span className={styles.rateLabel}>Easy</span>
                    <span className={styles.rateSub}>7+ days</span>
                  </button>
                </div>
              </>
            )}
          </article>
        </>
      ) : (
        <section className={styles.emptyStateCard} aria-live="polite">
          <div className={styles.emptyIcon}>✨</div>
          <div className={styles.emptyTitle}>ಇಂದಿನ ಪುನರಾವರ್ತನೆ ಮುಗಿದಿದೆ!</div>
          <p className={styles.emptyText}>
            You have no pending review flashcards due today. You have reviewed{' '}
            <strong>{sessionCount}</strong> cards this session! Continue exploring new situations to
            build your vocabulary.
          </p>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
            Total memorized cards in memory: {Object.keys(cards).length}
          </div>
          <Link to="/" className={styles.homeActionBtn}>
            <CheckIcon size={16} /> Explore New Situations
          </Link>
        </section>
      )}
    </main>
  );
};
