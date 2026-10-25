import React from 'react';
import { Link } from 'react-router-dom';
import { SituationMeta } from '@/types/phrase';
import { useAppStore } from '@/store/useAppStore';
import { TravelIllustration } from '@/components/illustrations/TravelIllustration';
import { ShoppingIllustration } from '@/components/illustrations/ShoppingIllustration';
import { HealthcareIllustration } from '@/components/illustrations/HealthcareIllustration';
import { TransportIllustration } from '@/components/illustrations/TransportIllustration';
import { EducationIllustration } from '@/components/illustrations/EducationIllustration';
import { WorkplaceIllustration } from '@/components/illustrations/WorkplaceIllustration';
import { LearnIcon, MicIcon, ChatIcon } from '@/components/common/Icons';
import styles from './SituationCard.module.css';

interface SituationCardProps {
  situation: SituationMeta;
}

export const SituationCard: React.FC<SituationCardProps> = ({ situation }) => {
  const progressMap = useAppStore((state) => state.progress);
  const sitProg = progressMap[situation.id] || {
    situationId: situation.id,
    phrasesLearned: [],
    phrasesMastered: [],
    roleplaysCompleted: [],
  };

  const learnedCount = sitProg.phrasesLearned.length;
  const totalCount = situation.phraseCount || 10;
  const percentage = Math.min(100, Math.round((learnedCount / totalCount) * 100));

  // Progress ring math (radius 18, circumference ~113.1)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const renderIllustration = () => {
    switch (situation.id) {
      case 'travel':
        return <TravelIllustration size={90} />;
      case 'shopping':
        return <ShoppingIllustration size={90} />;
      case 'healthcare':
        return <HealthcareIllustration size={90} />;
      case 'transport':
        return <TransportIllustration size={90} />;
      case 'education':
        return <EducationIllustration size={90} />;
      case 'workplace':
        return <WorkplaceIllustration size={90} />;
      default:
        return null;
    }
  };

  return (
    <article className={styles.card} aria-labelledby={`sit-title-${situation.id}`}>
      <div>
        <div className={styles.cardTop}>
          <div className={styles.titleArea}>
            <h2 id={`sit-title-${situation.id}`} className={styles.titleKannada}>
              {situation.titleKannada}
            </h2>
            <div className={styles.titleEnglish}>{situation.title}</div>
            <p className={styles.description}>{situation.description}</p>
          </div>
          <div className={styles.illustrationWrapper}>{renderIllustration()}</div>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressRingWrapper} aria-hidden="true">
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle
                cx="22"
                cy="22"
                r={radius}
                fill="none"
                stroke="var(--line)"
                strokeWidth="4"
              />
              <circle
                cx="22"
                cy="22"
                r={radius}
                fill="none"
                stroke="var(--turmeric)"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 22 22)"
                style={{ transition: 'stroke-dashoffset 0.4s ease' }}
              />
            </svg>
            <span className={styles.progressRingText}>{percentage}%</span>
          </div>

          <div className={styles.progressDetails}>
            <span className={styles.progressCount}>
              {learnedCount} / {totalCount} Phrases
            </span>
            <span className={styles.progressLabel}>
              {sitProg.phrasesMastered.length} Mastered • {sitProg.roleplaysCompleted.length} Roleplays Done
            </span>
          </div>
        </div>
      </div>

      <div className={styles.actionGrid}>
        <Link
          to={`/learn/${situation.id}`}
          className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
          aria-label={`Learn phrases for ${situation.title}`}
        >
          <LearnIcon size={16} />
          <span>Learn</span>
          <span className={styles.actionSubLabel}>ಕಲಿ</span>
        </Link>

        <Link
          to={`/speak/${situation.id}`}
          className={styles.actionBtn}
          aria-label={`Practice speaking for ${situation.title}`}
        >
          <MicIcon size={16} />
          <span>Speak</span>
          <span className={styles.actionSubLabel}>ಮಾತನಾಡು</span>
        </Link>

        <Link
          to={`/roleplay/${situation.id}`}
          className={styles.actionBtn}
          aria-label={`Roleplay scenarios for ${situation.title}`}
        >
          <ChatIcon size={16} />
          <span>Roleplay</span>
          <span className={styles.actionSubLabel}>ಸಂಭಾಷಣೆ</span>
        </Link>
      </div>
    </article>
  );
};
