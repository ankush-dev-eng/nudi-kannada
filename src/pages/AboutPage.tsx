import React from 'react';
import { Link } from 'react-router-dom';
import { MysoreBorder } from '@/components/common/MysoreBorder';
import { ChevronLeftIcon } from '@/components/common/Icons';
import styles from './AboutPage.module.css';

export const AboutPage: React.FC = () => {
  return (
    <main className={styles.pageContainer}>
      <header className={styles.topBar}>
        <Link to="/" className={styles.backLink} aria-label="Back to home">
          <ChevronLeftIcon size={16} /> Home
        </Link>
      </header>

      <section className={styles.pageHeader}>
        <h1 className={styles.titleKannada}>ನುಡಿಯ ಬಗ್ಗೆ</h1>
        <div className={styles.titleEnglish}>About Nudi (Kannada for Everyday Life)</div>
      </section>

      <MysoreBorder variant="kumkuma" height={12} />

      <article className={styles.aboutCard}>
        <h2 className={styles.cardHeading}>Our Mission</h2>
        <p>
          Moving to Bengaluru or anywhere in Karnataka as an engineer, student, or healthcare worker can feel daunting when you want to connect with locals respectfully. Many apps start with abstract grammar or formal literature that don&apos;t help you hail an auto rickshaw on 100 Feet Road, ask for coriander leaves at the local market, or politely greet your security personnel.
        </p>
        <p>
          <strong>Nudi (ನುಡಿ)</strong> is designed <em>situation-first</em>. We believe language learning is about confidence, empathy, and community belonging. By focusing on the exact phrases needed in high-frequency daily situations, Nudi helps newcomers feel at home in Karnataka from day one.
        </p>
      </article>

      <article className={styles.aboutCard}>
        <h2 className={styles.cardHeading}>Four Core Design Pillars</h2>
        <div className={styles.pillarList}>
          <div className={styles.pillarItem}>
            <div className={styles.pillarTitle}>1. Situation-First Context</div>
            <p className={styles.pillarText}>
              Organized around 6 realistic everyday spheres: Travel, Shopping, Healthcare, Transport, Education, and Workplace.
            </p>
          </div>

          <div className={styles.pillarItem}>
            <div className={styles.pillarTitle}>2. Pronunciation & Voice Tolerance</div>
            <p className={styles.pillarText}>
              Leveraging the Web Speech API with Levenshtein phonetic distance tolerance, rewarding effort and highlighting missed syllables without harsh punishment.
            </p>
          </div>

          <div className={styles.pillarItem}>
            <div className={styles.pillarTitle}>3. Spaced Repetition (SM-2 Algorithm)</div>
            <p className={styles.pillarText}>
              SuperMemo SM-2 interval scheduling automatically queues phrases just as your brain is about to forget them, converting short-term practice into permanent muscle memory.
            </p>
          </div>

          <div className={styles.pillarItem}>
            <div className={styles.pillarTitle}>4. 100% Offline & Private PWA</div>
            <p className={styles.pillarText}>
              Zero runtime network calls, zero telemetry, zero advertising. All progress is preserved locally in IndexedDB, completely accessible on BMTC buses, Namma Metro underground tunnels, or remote hill stations.
            </p>
          </div>
        </div>
      </article>

      <section className={styles.disclaimerBox}>
        <strong>Community Verification & Dialect Disclaimer:</strong>
        <p style={{ margin: '0.35rem 0 0 0' }}>
          Kannada is a rich language with centuries of history and vibrant regional dialect variations — from Bengaluru colloquial phrasing to Old Mysore etiquette and North Karnataka warmth. The phrases in Nudi are crafted for pragmatic, respectful everyday communication. All phrases are openly validated via our automated Go toolchain and welcoming to community contributions and refinements on GitHub.
        </p>
      </section>

      <article className={styles.aboutCard} style={{ marginTop: '1.5rem' }}>
        <h2 className={styles.cardHeading}>Credits & Heritage</h2>
        <p style={{ margin: 0 }}>
          Designed with pride in Karnataka. Visual palette inspired by Mysore Sandalwood, Kumkuma, Turmeric, Western Ghats greenery, and traditional Mysore silk saree zari motifs.
        </p>
        <ul className={styles.creditsList}>
          <li>Typography: Tiro Kannada (Kannada serif), Anek Kannada, Playfair Display &amp; Inter.</li>
          <li>Sound Engineering: Web Audio API pentatonic synthetic feedback.</li>
          <li>Dataset Validation: Go 1.22+ automated validator tool.</li>
          <li>License: Open Source under the MIT License.</li>
        </ul>
      </article>
    </main>
  );
};
