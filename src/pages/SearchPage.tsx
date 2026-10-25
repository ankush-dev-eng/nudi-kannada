import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { SearchBar } from '@/components/search/SearchBar';
import { ChevronLeftIcon, VolumeIcon, MicIcon } from '@/components/common/Icons';
import styles from './SearchPage.module.css';

export const SearchPage: React.FC = () => {
  const { phrases, situations } = useAppStore();
  const { speak } = useSpeechSynthesis();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSituation, setSelectedSituation] = useState<string>('all');
  const [selectedFormality, setSelectedFormality] = useState<string>('all');

  const filteredPhrases = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return phrases.filter((phrase) => {
      // Category filter
      if (selectedSituation !== 'all' && phrase.situationId !== selectedSituation) {
        return false;
      }

      // Formality filter
      if (selectedFormality !== 'all' && phrase.formality !== selectedFormality) {
        return false;
      }

      // Query filter
      if (!q) return true;

      const matchKn = phrase.kannada.includes(q);
      const matchRom = phrase.romanization.toLowerCase().includes(q);
      const matchEn = phrase.english.toLowerCase().includes(q);
      const matchNote = phrase.note.toLowerCase().includes(q);
      const matchTags = phrase.tags.some((t) => t.toLowerCase().includes(q));

      return matchKn || matchRom || matchEn || matchNote || matchTags;
    });
  }, [phrases, searchQuery, selectedSituation, selectedFormality]);

  return (
    <main className={styles.pageContainer}>
      <header className={styles.topBar}>
        <Link to="/" className={styles.backLink} aria-label="Back to home">
          <ChevronLeftIcon size={16} /> Home
        </Link>
      </header>

      <section className={styles.pageHeader}>
        <h1 className={styles.titleKannada}>ಪದಕೋಶ ಹುಡುಕಾಟ</h1>
        <div className={styles.titleEnglish}>Instant Phrase Search & Dictionary</div>
      </section>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <section className={styles.filterRow} aria-label="Search filters">
        <select
          value={selectedSituation}
          onChange={(e) => setSelectedSituation(e.target.value)}
          className={styles.filterSelect}
          aria-label="Filter by situation category"
        >
          <option value="all">All Situations (ಎಲ್ಲಾ ಸಂದರ್ಭಗಳು)</option>
          {situations.map((sit) => (
            <option key={sit.id} value={sit.id}>
              {sit.titleKannada} ({sit.title})
            </option>
          ))}
        </select>

        <select
          value={selectedFormality}
          onChange={(e) => setSelectedFormality(e.target.value)}
          className={styles.filterSelect}
          aria-label="Filter by formality"
        >
          <option value="all">All Formalities</option>
          <option value="polite">Polite / Respectful (ಸಭ್ಯ)</option>
          <option value="casual">Casual / Friendly (ಆಡುಮಾತು)</option>
        </select>
      </section>

      <div className={styles.resultsMeta}>
        <span>Found {filteredPhrases.length} phrases</span>
        {searchQuery && (
          <span>
            matching &ldquo;<strong>{searchQuery}</strong>&rdquo;
          </span>
        )}
      </div>

      {filteredPhrases.length > 0 ? (
        <section className={styles.phraseList} aria-label="Search results">
          {filteredPhrases.map((phrase) => (
            <article key={phrase.id} className={styles.phraseCard}>
              <div className={styles.cardTopRow}>
                <div className={styles.badgeGroup}>
                  <span className={`${styles.badge} ${phrase.formality === 'polite' ? styles.polite : ''}`}>
                    {phrase.formality}
                  </span>
                  <span className={styles.badge}>{phrase.situationId}</span>
                </div>
              </div>

              <div className={styles.kannadaText}>{phrase.kannada}</div>
              <div className={styles.romanText}>{phrase.romanization}</div>
              <div className={styles.englishText}>{phrase.english}</div>
              {phrase.note && <div className={styles.noteText}>{phrase.note}</div>}

              <div className={styles.actionRow}>
                <button
                  type="button"
                  className={styles.listenBtn}
                  onClick={() => speak(phrase.kannada)}
                  aria-label={`Listen to ${phrase.kannada}`}
                >
                  <VolumeIcon size={14} /> Listen
                </button>
                <Link
                  to={`/speak?situation=${phrase.situationId}&phrase=${phrase.id}`}
                  className={styles.practiceLink}
                >
                  <MicIcon size={14} /> Practice Speaking
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className={styles.emptyResults}>
          <h3>ಯಾವುದೇ ಫಲಿತಾಂಶಗಳಿಲ್ಲ</h3>
          <p>No phrases matched your query. Try searching with different terms or reset your filters.</p>
        </div>
      )}
    </main>
  );
};
