import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { SituationCard } from '@/components/situation/SituationCard';
import { ReviewIcon } from '@/components/common/Icons';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  const situations = useAppStore((state) => state.situations);
  const getDueReviewPhrases = useAppStore((state) => state.getDueReviewPhrases);
  const duePhrases = getDueReviewPhrases();

  return (
    <div className={styles.pageContainer}>
      <section className={styles.hero} aria-labelledby="hero-heading">
        <h1 id="hero-heading" className={styles.heroKannada}>
          ಕನ್ನಡ ಕಲಿಯಿರಿ • Speak Kannada
        </h1>
        <div className={styles.heroSubtitle}>A situation-first Kannada companion for real life</div>
        <p className={styles.heroDescription}>
          Pick a real-world situation, master the 8 to 10 sentences that matter, practice speaking
          with audio feedback, and retain them with offline spaced repetition.
        </p>
      </section>

      {duePhrases.length > 0 && (
        <aside className={styles.reviewAlertCard} aria-label="Daily review queue alert">
          <div className={styles.reviewAlertText}>
            <span className={styles.reviewAlertTitle}>
              {duePhrases.length} phrase{duePhrases.length === 1 ? '' : 's'} due for spaced repetition today
            </span>
            <span className={styles.reviewAlertSubtitle}>
              Reinforce what you learned before you forget (SM-2 scheduler)
            </span>
          </div>
          <Link to="/review" className={styles.reviewAlertBtn}>
            <ReviewIcon size={16} /> Start Daily Review
          </Link>
        </aside>
      )}

      <section aria-labelledby="situations-heading">
        <div className={styles.sectionHeader}>
          <h2 id="situations-heading" className={styles.sectionTitle}>
            Situations • ಸಂದರ್ಭಗಳು
          </h2>
          <span className={styles.sectionSubtitle}>6 Real-world Domains</span>
        </div>

        <div className={styles.grid}>
          {situations.map((sit) => (
            <SituationCard key={sit.id} situation={sit} />
          ))}
        </div>
      </section>
    </div>
  );
};
