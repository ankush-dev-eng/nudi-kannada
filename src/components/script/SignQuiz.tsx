import React, { useState } from 'react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { playSuccessSound, playErrorSound, triggerHaptic } from '@/lib/feedback';
import { VolumeIcon, RefreshIcon, ChevronRightIcon } from '@/components/common/Icons';
import styles from './SignQuiz.module.css';

interface CivicSign {
  id: string;
  kannada: string;
  roman: string;
  meaning: string;
  distractors: string[];
  context: string;
}

const CIVIC_SIGNS: CivicSign[] = [
  {
    id: 'sign-1',
    kannada: 'ಪ್ರವೇಶ',
    roman: 'Pravesha',
    meaning: 'Entrance / Entry',
    distractors: ['Exit', 'No Parking', 'Tickets'],
    context: 'Seen on doorways to metro stations, government buildings, and markets.',
  },
  {
    id: 'sign-2',
    kannada: 'ನಿರ್ಗಮನ',
    roman: 'Nirgamana',
    meaning: 'Exit / Way Out',
    distractors: ['Entrance', 'Elevator', 'Restroom'],
    context: 'Seen at all transit terminals and public gates.',
  },
  {
    id: 'sign-3',
    kannada: 'ಶೌಚಾಲಯ',
    roman: 'Shauchalaya',
    meaning: 'Restroom / Toilet',
    distractors: ['Cafeteria', 'Hospital', 'Waiting Room'],
    context: 'Essential civic marker at bus stands, parks, and complexes.',
  },
  {
    id: 'sign-4',
    kannada: 'ಧೂಮಪಾನ ನಿಷೇಧಿಸಲಾಗಿದೆ',
    roman: 'Dhoomapaana Nishedhisalaagide',
    meaning: 'Smoking is Prohibited',
    distractors: ['Littering Allowed', 'Silence Please', 'Staff Only'],
    context: 'Standard sign in public spaces and transit vehicles.',
  },
  {
    id: 'sign-5',
    kannada: 'ನಿಲ್ದಾಣ',
    roman: 'Nildaana',
    meaning: 'Station / Bus Stop',
    distractors: ['Highway', 'Post Office', 'School'],
    context: 'Bus stop (ಬಸ್ ನಿಲ್ದಾಣ - Bus Nildaana) or Railway Station.',
  },
  {
    id: 'sign-6',
    kannada: 'ಔಷಧಾಲಯ',
    roman: 'Aushadhalaya',
    meaning: 'Pharmacy / Chemist',
    distractors: ['Grocery Store', 'Bookstore', 'Bank'],
    context: 'Medical shops and hospital pharmacies across Karnataka.',
  },
  {
    id: 'sign-7',
    kannada: 'ಸಾಲು ನಿಲ್ಲಿ',
    roman: 'Saalu Nilli',
    meaning: 'Stand in Queue',
    distractors: ['Do Not Enter', 'Please Sit', 'Mind the Gap'],
    context: 'Found near ticket counters, BMTC/Namma Metro gates.',
  },
  {
    id: 'sign-8',
    kannada: 'ಆಸ್ಪತ್ರೆ',
    roman: 'Aaspatre',
    meaning: 'Hospital',
    distractors: ['Hotel', 'Court', 'Police Station'],
    context: 'Emergency civic indicator near medical care facilities.',
  },
];

export const SignQuiz: React.FC = () => {
  const { speak } = useSpeechSynthesis();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  const currentSign = CIVIC_SIGNS[currentIdx];

  // Prepare shuffled options for current sign
  const [options, setOptions] = useState<string[]>(() => {
    return [currentSign.meaning, ...currentSign.distractors].sort(() => Math.random() - 0.5);
  });

  const handleSelectOption = (chosen: string) => {
    if (selectedAnswer !== null) return; // already answered

    setSelectedAnswer(chosen);
    if (chosen === currentSign.meaning) {
      setScore((prev) => prev + 1);
      playSuccessSound();
      triggerHaptic('success');
    } else {
      playErrorSound();
      triggerHaptic('medium');
    }
  };

  const handleNext = () => {
    if (currentIdx < CIVIC_SIGNS.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setSelectedAnswer(null);
      setOptions(
        [CIVIC_SIGNS[nextIdx].meaning, ...CIVIC_SIGNS[nextIdx].distractors].sort(
          () => Math.random() - 0.5
        )
      );
    } else {
      // Completed all signs
      setCurrentIdx(CIVIC_SIGNS.length);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setOptions([CIVIC_SIGNS[0].meaning, ...CIVIC_SIGNS[0].distractors].sort(() => Math.random() - 0.5));
  };

  if (currentIdx >= CIVIC_SIGNS.length) {
    return (
      <div className={styles.quizContainer} style={{ textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-kannada-serif)', color: 'var(--ghats)', fontSize: '1.4rem' }}>
          ಕ್ವಿಜ್ ಪೂರ್ಣಗೊಂಡಿದೆ! Quiz Complete!
        </h3>
        <p style={{ color: 'var(--ink)' }}>
          You scored <strong>{score}</strong> out of {CIVIC_SIGNS.length} on Karnataka civic signs!
        </p>
        <div style={{ marginTop: '1rem' }}>
          <button type="button" className={styles.nextBtn} onClick={handleRestart}>
            <RefreshIcon size={16} /> Try Quiz Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quizContainer}>
      <header className={styles.quizHeader}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>
          Sign {currentIdx + 1} of {CIVIC_SIGNS.length}
        </span>
        <span className={styles.scorePill}>
          Score: {score} / {currentIdx}
        </span>
      </header>

      {/* Signboard Visual */}
      <section className={styles.signBoard} aria-label={`Sign: ${currentSign.kannada}`}>
        <div className={styles.signKannada}>{currentSign.kannada}</div>
        <button
          type="button"
          className={styles.signAudioBtn}
          onClick={() => speak(currentSign.kannada)}
        >
          <VolumeIcon size={14} /> Hear audio pronunciation
        </button>
      </section>

      {/* Multiple choice options */}
      <div className={styles.optionsGrid}>
        {options.map((opt, i) => {
          let btnClass = styles.optionBtn;
          if (selectedAnswer !== null) {
            if (opt === currentSign.meaning) {
              btnClass = `${styles.optionBtn} ${styles.correct}`;
            } else if (opt === selectedAnswer) {
              btnClass = `${styles.optionBtn} ${styles.wrong}`;
            }
          }
          return (
            <button
              key={i}
              type="button"
              className={btnClass}
              onClick={() => handleSelectOption(opt)}
              disabled={selectedAnswer !== null}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selectedAnswer !== null && (
        <aside className={styles.feedbackBox} aria-live="polite">
          <div className={styles.feedbackHeading}>
            {selectedAnswer === currentSign.meaning ? '✅ ಸರಿ! Correct!' : '❌ ತಪ್ಪಾಗಿದೆ. Incorrect.'}
          </div>
          <div>
            <strong>/{currentSign.roman}/</strong>: {currentSign.meaning}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
            Where you see it: {currentSign.context}
          </div>
          <button type="button" className={styles.nextBtn} onClick={handleNext}>
            Next Sign <ChevronRightIcon size={16} />
          </button>
        </aside>
      )}
    </div>
  );
};
