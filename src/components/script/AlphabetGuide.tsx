import React, { useState } from 'react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { playCardFlipSound, triggerHaptic } from '@/lib/feedback';
import { VolumeIcon } from '@/components/common/Icons';
import styles from './AlphabetGuide.module.css';

interface LetterItem {
  kannada: string;
  roman: string;
  soundHint: string;
  example: string;
}

const VOWELS: LetterItem[] = [
  { kannada: 'ಅ', roman: 'a', soundHint: 'Short /a/ as in "alive"', example: 'ಅಮ್ಮ (Amma)' },
  {
    kannada: 'ಆ',
    roman: 'aa',
    soundHint: 'Long /aa/ as in "father"',
    example: 'ಆನೆ (Aane - Elephant)',
  },
  { kannada: 'ಇ', roman: 'i', soundHint: 'Short /i/ as in "sit"', example: 'ಇಲ್ಲಿ (Illi - Here)' },
  { kannada: 'ಈ', roman: 'ee', soundHint: 'Long /ee/ as in "feel"', example: 'ಈಗ (Eega - Now)' },
  { kannada: 'ಉ', roman: 'u', soundHint: 'Short /u/ as in "put"', example: 'ಊರು (Ooru - Town)' },
  { kannada: 'ಊ', roman: 'oo', soundHint: 'Long /oo/ as in "boot"', example: 'ಊಟ (Oota - Meal)' },
  {
    kannada: 'ಋ',
    roman: 'ru',
    soundHint: 'Vocalic /ru/ as in "rishi"',
    example: 'ಋತು (Rutu - Season)',
  },
  { kannada: 'ಎ', roman: 'e', soundHint: 'Short /e/ as in "pet"', example: 'ಎಲ್ಲಿ (Elli - Where)' },
  { kannada: 'ಏ', roman: 'ee', soundHint: 'Long /ee/ as in "plane"', example: 'ಏನು (Eenu - What)' },
  {
    kannada: 'ಐ',
    roman: 'ai',
    soundHint: 'Diphthong /ai/ as in "aisle"',
    example: 'ಐದು (Aidu - Five)',
  },
  { kannada: 'ಒ', roman: 'o', soundHint: 'Short /o/ as in "lot"', example: 'ಒಂದು (Ondu - One)' },
  { kannada: 'ಓ', roman: 'oo', soundHint: 'Long /oo/ as in "boat"', example: 'ಓದು (Oodu - Read)' },
  {
    kannada: 'ಔ',
    roman: 'au',
    soundHint: 'Diphthong /au/ as in "cow"',
    example: 'ಔಷಧ (Aushadha - Medicine)',
  },
  {
    kannada: 'ಅಂ',
    roman: 'am',
    soundHint: 'Anusvara /am/ nasal',
    example: 'ಅಂಗಡಿ (Angadi - Shop)',
  },
  {
    kannada: 'ಅಃ',
    roman: 'aha',
    soundHint: 'Visarga /aha/ aspirate',
    example: 'ದುಃಖ (Dukha - Grief)',
  },
];

const CONSONANTS: LetterItem[] = [
  {
    kannada: 'ಕ',
    roman: 'ka',
    soundHint: 'Unvoiced /ka/ as in "skate"',
    example: 'ಕನ್ನಡ (Kannada)',
  },
  {
    kannada: 'ಖ',
    roman: 'kha',
    soundHint: 'Aspirated /kha/ as in "khaki"',
    example: 'ಖಂಡಿತ (Khanditha - Definitely)',
  },
  {
    kannada: 'ಗ',
    roman: 'ga',
    soundHint: 'Voiced /ga/ as in "garden"',
    example: 'ಗೊತ್ತು (Gottu - Know)',
  },
  {
    kannada: 'ಘ',
    roman: 'gha',
    soundHint: 'Aspirated /gha/ as in "ghost"',
    example: 'ಘಂಟೆ (Ghante - Hour)',
  },
  {
    kannada: 'ಚ',
    roman: 'cha',
    soundHint: 'Soft /cha/ as in "church"',
    example: 'ಚೆನ್ನಾಗಿದೆ (Chennagide - Good)',
  },
  {
    kannada: 'ಛ',
    roman: 'chha',
    soundHint: 'Aspirated /chha/',
    example: 'ಛತ್ರಿ (Chhatri - Umbrella)',
  },
  {
    kannada: 'ಜ',
    roman: 'ja',
    soundHint: 'Voiced /ja/ as in "jug"',
    example: 'ಜಾಗ (Jaaga - Place)',
  },
  { kannada: 'ಝ', roman: 'jha', soundHint: 'Aspirated /jha/', example: 'ಝರಿ (Jhari - Stream)' },
  {
    kannada: 'ಟ',
    roman: 'ta',
    soundHint: 'Retroflex /ta/ with curled tongue',
    example: 'ಟಿಕೆಟ್ (Ticket)',
  },
  {
    kannada: 'ಠ',
    roman: 'tha',
    soundHint: 'Aspirated retroflex /tha/',
    example: 'ಪಾಠ (Paatha - Lesson)',
  },
  { kannada: 'ಡ', roman: 'da', soundHint: 'Retroflex /da/', example: 'ಡಬ್ಬ (Dabba - Box)' },
  {
    kannada: 'ಢ',
    roman: 'dha',
    soundHint: 'Aspirated retroflex /dha/',
    example: 'ಢಾಳ (Dhaala - Bright)',
  },
  { kannada: 'ಣ', roman: 'na', soundHint: 'Retroflex nasal /na/', example: 'ಹಣ (Hana - Money)' },
  {
    kannada: 'ತ',
    roman: 'tha',
    soundHint: 'Dental /tha/ with tongue to upper teeth',
    example: 'ತಗೋಳಿ (Tagoli - Take it)',
  },
  {
    kannada: 'ಥ',
    roman: 'thha',
    soundHint: 'Aspirated dental /thha/',
    example: 'ಕಥೆ (Kathe - Story)',
  },
  {
    kannada: 'ದ',
    roman: 'da',
    soundHint: 'Dental /da/ as in "then"',
    example: 'ದಯವಿಟ್ಟು (Dayavittu - Please)',
  },
  {
    kannada: 'ಧ',
    roman: 'dha',
    soundHint: 'Aspirated dental /dha/',
    example: 'ಧನ್ಯವಾದಗಳು (Dhanyavadagalu - Thanks)',
  },
  {
    kannada: 'ನ',
    roman: 'na',
    soundHint: 'Dental /na/ as in "name"',
    example: 'ನಮಸ್ಕಾರ (Namaskara - Hello)',
  },
  {
    kannada: 'ಪ',
    roman: 'pa',
    soundHint: 'Unvoiced bilabial /pa/ as in "spin"',
    example: 'ಪುಸ್ತಕ (Pustaka - Book)',
  },
  {
    kannada: 'ಫ',
    roman: 'pha',
    soundHint: 'Aspirated /pha/ or /fa/',
    example: 'ಫಲಿತಾಂಶ (Phalitamsha - Result)',
  },
  {
    kannada: 'ಬ',
    roman: 'ba',
    soundHint: 'Voiced bilabial /ba/ as in "bus"',
    example: 'ಬನ್ನಿ (Banni - Please come)',
  },
  { kannada: 'ಭ', roman: 'bha', soundHint: 'Aspirated /bha/', example: 'ಭಾರತ (Bharata - India)' },
  {
    kannada: 'ಮ',
    roman: 'ma',
    soundHint: 'Bilabial nasal /ma/ as in "mother"',
    example: 'ಮನೆ (Mane - House)',
  },
  {
    kannada: 'ಯ',
    roman: 'ya',
    soundHint: 'Palatal glide /ya/ as in "yes"',
    example: 'ಯಾವಾಗ (Yaavaaga - When)',
  },
  { kannada: 'ರ', roman: 'ra', soundHint: 'Alveolar flap /ra/', example: 'ರಸ್ತೆ (Raste - Road)' },
  {
    kannada: 'ಲ',
    roman: 'la',
    soundHint: 'Lateral /la/ as in "light"',
    example: 'ಲಾಭ (Laabha - Profit)',
  },
  {
    kannada: 'ವ',
    roman: 'va',
    soundHint: 'Labiodental approximant /va/',
    example: 'ವಂದನೆ (Vandane - Salutation)',
  },
  {
    kannada: 'ಶ',
    roman: 'sha',
    soundHint: 'Palatal fricative /sha/',
    example: 'ಶಾಲೆ (Shaale - School)',
  },
  {
    kannada: 'ಷ',
    roman: 'ssa',
    soundHint: 'Retroflex /sha/',
    example: 'ಕಷ್ಟ (Kashta - Difficulty)',
  },
  {
    kannada: 'ಸ',
    roman: 'sa',
    soundHint: 'Dental sibilant /sa/ as in "sun"',
    example: 'ಸಮಯ (Samaya - Time)',
  },
  {
    kannada: 'ಹ',
    roman: 'ha',
    soundHint: 'Glottal /ha/ as in "house"',
    example: 'ಹೌದು (Haudu - Yes)',
  },
  {
    kannada: 'ಳ',
    roman: 'lla',
    soundHint: 'Unique Kannada retroflex lateral /lla/',
    example: 'ಕೇಳಿ (Keli - Listen)',
  },
];

export const AlphabetGuide: React.FC = () => {
  const { speak } = useSpeechSynthesis();
  const [selectedLetter, setSelectedLetter] = useState<LetterItem>(VOWELS[0]);

  const handleSelect = (item: LetterItem) => {
    setSelectedLetter(item);
    playCardFlipSound();
    triggerHaptic('light');
    speak(item.kannada);
  };

  return (
    <div className={styles.guideContainer}>
      {/* Vowels */}
      <section className={styles.categorySection}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionTitleKn}>ಸ್ವರಗಳು (Swaragalu)</span>
          <span className={styles.sectionTitleEn}>15 Vowels</span>
        </div>
        <div className={styles.letterGrid} role="grid" aria-label="Kannada vowels">
          {VOWELS.map((v) => (
            <button
              key={v.kannada}
              type="button"
              className={styles.letterTile}
              onClick={() => handleSelect(v)}
              aria-label={`Letter ${v.kannada}, sound ${v.roman}`}
            >
              <span className={styles.kannadaChar}>{v.kannada}</span>
              <span className={styles.romanChar}>{v.roman}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Consonants */}
      <section className={styles.categorySection}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionTitleKn}>ವ್ಯಂಜನಗಳು (Vyanjanagalu)</span>
          <span className={styles.sectionTitleEn}>34 Consonants</span>
        </div>
        <div className={styles.letterGrid} role="grid" aria-label="Kannada consonants">
          {CONSONANTS.map((c) => (
            <button
              key={c.kannada}
              type="button"
              className={styles.letterTile}
              onClick={() => handleSelect(c)}
              aria-label={`Letter ${c.kannada}, sound ${c.roman}`}
            >
              <span className={styles.kannadaChar}>{c.kannada}</span>
              <span className={styles.romanChar}>{c.roman}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Selected Letter Detail Card */}
      {selectedLetter && (
        <aside className={styles.selectedCard} aria-live="polite">
          <div className={styles.selectedMain}>
            <div className={styles.selectedChar}>{selectedLetter.kannada}</div>
            <div className={styles.selectedInfo}>
              <div className={styles.selectedSound}>
                /{selectedLetter.roman}/ — {selectedLetter.soundHint}
              </div>
              <div className={styles.selectedExample}>
                Example: <strong>{selectedLetter.example}</strong>
              </div>
            </div>
          </div>
          <button
            type="button"
            className={styles.pronounceBtn}
            onClick={() => speak(selectedLetter.kannada)}
          >
            <VolumeIcon size={16} /> Pronounce
          </button>
        </aside>
      )}
    </div>
  );
};
