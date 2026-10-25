import { PronunciationResult, PronunciationWordResult } from '@/types/progress';

/**
 * Standard Levenshtein edit distance between two strings
 */
export function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Normalizes text by removing punctuation, normalizing whitespace, and trimming.
 */
export function normalizeKannada(text: string): string {
  return text
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?'"!,]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes Latin / romanized text for phonetics matching
 */
export function normalizeRomanization(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?'"!,]/g, '')
    .replace(/aa/g, 'a')
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/dh/g, 'd')
    .replace(/th/g, 't')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates string similarity ratio between 0 and 1 using Levenshtein distance
 */
export function stringSimilarity(str1: string, str2: string): number {
  const s1 = str1.trim();
  const s2 = str2.trim();
  if (s1 === s2) return 1.0;
  if (!s1.length || !s2.length) return 0.0;

  const maxLen = Math.max(s1.length, s2.length);
  const distance = levenshteinDistance(s1, s2);
  return Math.max(0, (maxLen - distance) / maxLen);
}

/**
 * Evaluates spoken user utterance against expected Kannada target and romanization.
 */
export function scorePronunciation(
  targetKannada: string,
  targetRomanization: string,
  spokenText: string
): PronunciationResult {
  const normTargetKn = normalizeKannada(targetKannada);
  const normSpoken = normalizeKannada(spokenText);

  // Character-level similarities
  const kannadaSim = stringSimilarity(normTargetKn, normSpoken);
  const romanSim = stringSimilarity(
    normalizeRomanization(targetRomanization),
    normalizeRomanization(spokenText)
  );

  // Best base similarity
  const baseSim = Math.max(kannadaSim, romanSim);

  // Word-by-word breakdown
  const targetWords = normTargetKn.split(' ').filter(Boolean);
  const romanWords = normalizeRomanization(targetRomanization).split(' ').filter(Boolean);
  const spokenWords = normSpoken.split(' ').filter(Boolean);

  const wordResults: PronunciationWordResult[] = targetWords.map((word, idx) => {
    const romanEquivalent = romanWords[idx] || '';
    let bestMatchScore = 0;
    let bestSpokenWord = '';

    for (const spoken of spokenWords) {
      const simKn = stringSimilarity(word, spoken);
      const simRom = romanEquivalent
        ? stringSimilarity(romanEquivalent, normalizeRomanization(spoken))
        : 0;
      const score = Math.max(simKn, simRom);

      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestSpokenWord = spoken;
      }
    }

    const matched = bestMatchScore >= 0.65;
    return {
      expected: word,
      spoken: bestSpokenWord || '(missed)',
      matched,
      score: Math.round(bestMatchScore * 100),
    };
  });

  const matchedCount = wordResults.filter((w) => w.matched).length;
  const wordMatchRatio = targetWords.length > 0 ? matchedCount / targetWords.length : 0;

  // Composite score: 60% word match coverage + 40% overall string edit similarity
  const compositeScore = Math.round((wordMatchRatio * 0.6 + baseSim * 0.4) * 100);
  const finalScore = Math.min(100, Math.max(0, compositeScore));
  const passed = finalScore >= 70;

  let feedback = 'ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ! Try saying it a bit slower and clearer.';
  if (finalScore >= 90) {
    feedback = 'ಅದ್ಭುತ! Excellent Kannada pronunciation!';
  } else if (finalScore >= 70) {
    feedback = 'ತುಂಬಾ ಒಳ್ಳೆಯ ಪ್ರಯತ್ನ! Good job, understandable and clear!';
  } else if (finalScore >= 50) {
    feedback = 'ಚೆನ್ನಾಗಿದೆ, ಇನ್ನೊಂದು ಬಾರಿ ಪ್ರಯತ್ನಿಸಿ. Almost there, practice the missed words.';
  }

  return {
    score: finalScore,
    passed,
    targetKannada,
    recognizedText: spokenText,
    wordResults,
    feedback,
  };
}
