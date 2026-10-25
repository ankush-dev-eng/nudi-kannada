import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlphabetGuide } from '@/components/script/AlphabetGuide';
import { SignQuiz } from '@/components/script/SignQuiz';
import { ChevronLeftIcon } from '@/components/common/Icons';
import styles from './ScriptPage.module.css';

export const ScriptPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alphabet' | 'signs'>('alphabet');

  return (
    <main className={styles.pageContainer}>
      <header className={styles.topBar}>
        <Link to="/" className={styles.backLink} aria-label="Back to home">
          <ChevronLeftIcon size={16} /> Home
        </Link>
      </header>

      <section className={styles.pageHeader}>
        <h1 className={styles.titleKannada}>ಲಿಪಿ ಸಹಾಯಕ</h1>
        <div className={styles.titleEnglish}>Kannada Script Helper & Civic Signs</div>
      </section>

      <section className={styles.introBox}>
        <strong>Did you know?</strong> Kannada is almost 100% phonetic — every letter corresponds to exactly one sound. Unlike English where letters can be silent or irregular, once you recognize the 49 letters of the <em>Varnamale</em>, you can accurately read any street sign, metro station name, or shop board in Bengaluru and Karnataka!
      </section>

      <nav className={styles.tabBar} aria-label="Script sections">
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'alphabet' ? styles.active : ''}`}
          onClick={() => setActiveTab('alphabet')}
        >
          ವರ್ಣಮಾಲೆ (Alphabet & Phonetics)
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'signs' ? styles.active : ''}`}
          onClick={() => setActiveTab('signs')}
        >
          ಸಾರ್ವಜನಿಕ ಫಲಕಗಳು (Civic Signs Quiz)
        </button>
      </nav>

      {activeTab === 'alphabet' ? <AlphabetGuide /> : <SignQuiz />}
    </main>
  );
};
