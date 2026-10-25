import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { SituationId } from '@/types/phrase';
import { PronunciationResult } from '@/types/progress';
import { SpeakPractice } from '@/components/speak/SpeakPractice';
import { ChevronLeftIcon, ChevronRightIcon, FlameIcon } from '@/components/common/Icons';
import styles from './SpeakPage.module.css';

export const SpeakPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { situations, phrases, streak, getPhrasesBySituation } = useAppStore();

  const situationParam = (searchParams.get('situation') || 'travel') as SituationId;
  const phraseParam = searchParams.get('phrase');

  const [selectedSituation, setSelectedSituation] = useState<SituationId>(situationParam);
  const situationPhrases = getPhrasesBySituation(selectedSituation);

  const initialPhraseIndex = phraseParam
    ? Math.max(
        0,
        situationPhrases.findIndex((p) => p.id === phraseParam)
      )
    : 0;

  const [currentIdx, setCurrentIdx] = useState<number>(
    initialPhraseIndex !== -1 ? initialPhraseIndex : 0
  );

  // Session session counters
  const [sessionAttempts, setSessionAttempts] = useState<number>(0);
  const [sessionPassed, setSessionPassed] = useState<number>(0);
  const [lastScore, setLastScore] = useState<number | null>(null);

  // Update state if URL params change
  useEffect(() => {
    if (situationParam && situationParam !== selectedSituation) {
      setSelectedSituation(situationParam);
      setCurrentIdx(0);
    }
  }, [situationParam, selectedSituation]);

  const activePhrase = situationPhrases[currentIdx] || situationPhrases[0] || phrases[0];

  const handleSituationChange = (newSit: SituationId) => {
    setSelectedSituation(newSit);
    setCurrentIdx(0);
    setSearchParams({ situation: newSit });
  };

  const handleAttemptComplete = (result: PronunciationResult) => {
    setSessionAttempts((prev) => prev + 1);
    if (result.passed) {
      setSessionPassed((prev) => prev + 1);
    }
    setLastScore(result.score);
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      const newIdx = currentIdx - 1;
      setCurrentIdx(newIdx);
      setSearchParams({ situation: selectedSituation, phrase: situationPhrases[newIdx].id });
    }
  };

  const handleNext = () => {
    if (currentIdx < situationPhrases.length - 1) {
      const newIdx = currentIdx + 1;
      setCurrentIdx(newIdx);
      setSearchParams({ situation: selectedSituation, phrase: situationPhrases[newIdx].id });
    }
  };

  return (
    <main className={styles.pageContainer}>
      <header className={styles.topBar}>
        <Link to="/" className={styles.backLink} aria-label="Back to situations">
          <ChevronLeftIcon size={16} /> Situations
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

      <div className={styles.selectorBar}>
        <select
          value={selectedSituation}
          onChange={(e) => handleSituationChange(e.target.value as SituationId)}
          className={styles.selectInput}
          aria-label="Select situation category"
        >
          {situations.map((sit) => (
            <option key={sit.id} value={sit.id}>
              {sit.titleKannada} ({sit.title})
            </option>
          ))}
        </select>
      </div>

      <section className={styles.pageHeader}>
        <h1 className={styles.titleKannada}>ಧ್ವನಿ ಅಭ್ಯಾಸ</h1>
        <div className={styles.titleEnglish}>Pronunciation & Voice Practice</div>
      </section>

      <section className={styles.sessionStats} aria-label="Session statistics">
        <div className={styles.statItem}>
          <span className={styles.statVal}>{sessionAttempts}</span>
          <span className={styles.statLabel}>Attempts</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statVal}>{sessionPassed}</span>
          <span className={styles.statLabel}>Accurate</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statVal}>{lastScore !== null ? `${lastScore}%` : '—'}</span>
          <span className={styles.statLabel}>Latest Score</span>
        </div>
      </section>

      {activePhrase && (
        <SpeakPractice
          key={activePhrase.id}
          phrase={activePhrase}
          onAttemptComplete={handleAttemptComplete}
        />
      )}

      <footer className={styles.navigationBar}>
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className={styles.navBtn}
          aria-label="Previous phrase"
        >
          <ChevronLeftIcon size={16} /> Prev Phrase
        </button>
        <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
          {currentIdx + 1} of {situationPhrases.length}
        </span>
        <button
          type="button"
          onClick={handleNext}
          disabled={currentIdx >= situationPhrases.length - 1}
          className={styles.navBtn}
          aria-label="Next phrase"
        >
          Next Phrase <ChevronRightIcon size={16} />
        </button>
      </footer>
    </main>
  );
};
