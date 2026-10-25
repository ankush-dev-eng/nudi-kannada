import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { PhraseFlipCard } from '../components/learn/PhraseFlipCard';
import { ChevronLeftIcon, ChevronRightIcon, MicIcon, UsersIcon } from '../components/common/Icons';
import styles from './LearnPage.module.css';

export const LearnPage: React.FC = () => {
  const { situationId } = useParams<{ situationId: string }>();
  const navigate = useNavigate();
  const { situations, progress, toggleMasteredPhrase } = useAppStore();

  const situation = situations.find((s) => s.id === situationId) || situations[0];
  const phrases = situation ? situation.phrases : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when situation changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [situationId]);

  const currentPhrase = phrases[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < phrases.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, phrases.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation: ArrowLeft, ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (!situation || phrases.length === 0) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.situationHeading}>
          <h2 className={styles.titleEnglish}>Situation Not Found</h2>
          <p>Please select a valid category from the home page.</p>
          <Link to="/" className={styles.backLink} style={{ justifyContent: 'center', marginTop: '1rem' }}>
            <ChevronLeftIcon size={18} /> Back to Situations
          </Link>
        </div>
      </main>
    );
  }

  const isMastered = currentPhrase ? progress.masteredPhraseIds.includes(currentPhrase.id) : false;
  const progressPercent = Math.round(((currentIndex + 1) / phrases.length) * 100);

  return (
    <main className={styles.pageContainer}>
      <header className={styles.topBar}>
        <Link to="/" className={styles.backLink} aria-label="Back to home">
          <ChevronLeftIcon size={16} /> All Situations
        </Link>
        <span className={styles.cardPaginationInfo}>
          {currentIndex + 1} of {phrases.length}
        </span>
      </header>

      <section className={styles.situationHeading}>
        <h1 className={styles.titleKannada}>{situation.nameKannada}</h1>
        <div className={styles.titleEnglish}>{situation.nameEnglish}</div>
      </section>

      <div
        className={styles.progressBarContainer}
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Situation learning progress"
      >
        <div className={styles.progressBarFill} style={{ width: `${progressPercent}%` }} />
      </div>

      {currentPhrase && (
        <PhraseFlipCard
          phrase={currentPhrase}
          isMastered={isMastered}
          onToggleMastered={() => toggleMasteredPhrase(currentPhrase.id)}
          onNext={currentIndex < phrases.length - 1 ? handleNext : undefined}
          onPrev={currentIndex > 0 ? handlePrev : undefined}
        />
      )}

      <footer className={styles.paginationControls}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={handlePrev}
          disabled={currentIndex === 0}
          aria-label="Previous phrase"
        >
          <ChevronLeftIcon size={18} /> Previous
        </button>

        {currentIndex === phrases.length - 1 ? (
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => navigate(`/speak?situation=${situation.id}`)}
            style={{ backgroundColor: 'var(--kumkuma)', color: '#FFF', borderColor: 'var(--kumkuma)' }}
          >
            Practice Speaking <ChevronRightIcon size={18} />
          </button>
        ) : (
          <button
            type="button"
            className={styles.navBtn}
            onClick={handleNext}
            aria-label="Next phrase"
          >
            Next <ChevronRightIcon size={18} />
          </button>
        )}
      </footer>

      <section className={styles.secondaryActions}>
        <Link
          to={`/speak?situation=${situation.id}&phrase=${currentPhrase?.id}`}
          className={styles.quickActionLink}
        >
          <MicIcon size={16} /> Speak Practice
        </Link>
        <Link
          to={`/roleplay?situation=${situation.id}`}
          className={styles.quickActionLink}
        >
          <UsersIcon size={16} /> Situation Roleplay
        </Link>
      </section>
    </main>
  );
};
