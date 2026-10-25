import React from 'react';
import { Link } from 'react-router-dom';
import { MysoreBorder } from '@/components/common/MysoreBorder';
import { HomeIcon } from '@/components/common/Icons';
import { getAllSituations } from '@/lib/situations';
import styles from './SituationNotFound.module.css';

interface SituationNotFoundProps {
  requestedSlug?: string;
  mode?: 'learn' | 'speak' | 'roleplay';
}

export const SituationNotFound: React.FC<SituationNotFoundProps> = ({
  requestedSlug,
  mode = 'learn',
}) => {
  const allSituations = getAllSituations();

  const getTargetUrl = (situationId: string) => {
    switch (mode) {
      case 'speak':
        return `/speak/${situationId}`;
      case 'roleplay':
        return `/roleplay/${situationId}`;
      case 'learn':
      default:
        return `/learn/${situationId}`;
    }
  };

  const modeName =
    mode === 'speak' ? 'Speaking Practice' : mode === 'roleplay' ? 'Roleplay' : 'Phrase Learning';

  return (
    <main className={styles.container} role="alert" aria-live="polite">
      <div className={styles.icon} aria-hidden="true">
        🧭
      </div>
      <h1 className={styles.titleKannada}>ಸಂದರ್ಭ ಕಂಡುಬಂದಿಲ್ಲ</h1>
      <div className={styles.titleEnglish}>Situation Not Found</div>

      <MysoreBorder variant="kumkuma" height={8} />

      <p className={styles.message}>
        {requestedSlug ? (
          <>
            The situation <strong>&ldquo;{requestedSlug}&rdquo;</strong> is not recognized for{' '}
            {modeName}.
          </>
        ) : (
          <>Please select one of the 6 everyday situations to start {modeName}.</>
        )}
        <br />
        Choose from our curated daily scenarios below to jump straight in:
      </p>

      <div className={styles.situationGrid} aria-label="Available situations">
        {allSituations.map((sit) => (
          <Link
            key={sit.id}
            to={getTargetUrl(sit.id)}
            className={styles.situationCard}
            aria-label={`${sit.title} (${sit.titleKannada})`}
          >
            <span className={styles.sitKannada}>{sit.titleKannada}</span>
            <span className={styles.sitEnglish}>{sit.title}</span>
          </Link>
        ))}
      </div>

      <Link to="/" className={styles.backBtn}>
        <HomeIcon size={16} /> All Situations (ಮುಖಪುಟ)
      </Link>
    </main>
  );
};
