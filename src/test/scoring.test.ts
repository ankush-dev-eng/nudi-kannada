import { describe, it, expect } from 'vitest';
import {
  levenshteinDistance,
  stringSimilarity,
  normalizeKannada,
  normalizeRomanization,
  scorePronunciation,
} from '@/lib/scoring';

describe('Pronunciation Scoring Engine', () => {
  it('calculates exact Levenshtein distance and similarity', () => {
    expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
    expect(levenshteinDistance('ನಮಸ್ಕಾರ', 'ನಮಸ್ಕಾರ')).toBe(0);
    expect(levenshteinDistance('', 'ಬಸ್')).toBe(3);
    expect(stringSimilarity('ನಮಸ್ಕಾರ', 'ನಮಸ್ಕಾರ')).toBe(1.0);
  });

  it('normalizes Kannada and romanized strings by stripping punctuation and spacing', () => {
    expect(normalizeKannada('ನಮಸ್ಕಾರ, ಈ ಬಸ್! ')).toBe('ನಮಸ್ಕಾರ ಈ ಬಸ್');
    expect(normalizeRomanization('Namaskara! Ee bus?')).toBe('namaskara i bus');
  });

  it('awards 100% score for exact match', () => {
    const targetKn = 'ನಮಸ್ಕಾರ, ಈ ಬಸ್ ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗುತ್ತಾ?';
    const targetRom = 'Namaskara, ee bus Majestic-ge hogutta?';
    const spoken = 'ನಮಸ್ಕಾರ, ಈ ಬಸ್ ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗುತ್ತಾ?';

    const result = scorePronunciation(targetKn, targetRom, spoken);
    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.wordResults.every((w) => w.matched)).toBe(true);
    expect(result.feedback).toContain('ಅದ್ಭುತ');
  });

  it('tolerates romanized / Latin phonetic spoken recognition from speech engines', () => {
    const targetKn = 'ಒಂದು ಟಿಕೆಟ್ ಕೊಡಿ.';
    const targetRom = 'Ondu ticket kodi.';
    const spoken = 'ondu ticket kodi';

    const result = scorePronunciation(targetKn, targetRom, spoken);
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.passed).toBe(true);
  });

  it('identifies missed words when user drops words', () => {
    const targetKn = 'ಈ ರಸ್ತೆಯಲ್ಲಿ ನೇರವಾಗಿ ಹೋಗಿ.';
    const targetRom = 'Ee rasteyalli neravaagi hogi.';
    const spoken = 'ಈ ರಸ್ತೆಯಲ್ಲಿ ಹೋಗಿ'; // missed "ನೇರವಾಗಿ"

    const result = scorePronunciation(targetKn, targetRom, spoken);
    const missedWord = result.wordResults.find((w) => w.expected === 'ನೇರವಾಗಿ');

    expect(missedWord).toBeDefined();
    expect(missedWord?.matched).toBe(false);
  });

  it('fails completely irrelevant or empty utterances', () => {
    const targetKn = 'ಆಟೋ ಮೀಟರ್ ಹಾಕಿ.';
    const targetRom = 'Auto meter haaki.';
    const spoken = 'xyz random irrelevant noise';

    const result = scorePronunciation(targetKn, targetRom, spoken);
    expect(result.score).toBeLessThan(50);
    expect(result.passed).toBe(false);
  });
});
