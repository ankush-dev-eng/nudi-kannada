import { SM2Card, ReviewRating } from '@/types/progress';

export type UserReviewGrade = 'again' | 'hard' | 'good' | 'easy';

export const GRADE_TO_QUALITY: Record<UserReviewGrade, ReviewRating> = {
  again: 1,
  hard: 2,
  good: 4,
  easy: 5,
};

/**
 * Creates a brand new SM-2 card for a phrase.
 */
export function createInitialCard(phraseId: string, initialDueDate?: string): SM2Card {
  const today = initialDueDate || new Date().toISOString().split('T')[0];
  return {
    phraseId,
    interval: 0,
    repetition: 0,
    easeFactor: 2.5,
    dueDate: today,
    lapses: 0,
  };
}

/**
 * Calculates the next SM-2 spaced repetition schedule based on user rating.
 * Rating scale:
 * 5 - perfect response
 * 4 - correct response after a hesitation
 * 3 - correct response recalled with serious difficulty
 * 2 - incorrect response; where the correct one seemed easy to recall
 * 1 - incorrect response; the correct one remembered
 * 0 - complete blackout
 *
 * @param card The current SM2Card state
 * @param quality Quality rating 0 to 5
 * @param currentDate Current date in YYYY-MM-DD format (defaults to today)
 * @returns Updated SM2Card with new interval, repetition, ease factor, and dueDate
 */
export function calculateNextReview(
  card: SM2Card,
  quality: ReviewRating,
  currentDate?: string
): SM2Card {
  const baseDateStr = currentDate || new Date().toISOString().split('T')[0];
  let { interval, repetition, easeFactor, lapses } = card;

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const delta = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  easeFactor = Math.max(1.3, Number((easeFactor + delta).toFixed(2)));

  if (quality >= 3) {
    // Correct recall
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetition += 1;
  } else {
    // Incorrect / Lapse
    repetition = 0;
    interval = 1;
    lapses += 1;
  }

  // Calculate new due date by adding interval in days
  const baseDate = new Date(baseDateStr);
  baseDate.setDate(baseDate.getDate() + interval);
  const dueDate = baseDate.toISOString().split('T')[0];

  return {
    ...card,
    interval,
    repetition,
    easeFactor,
    dueDate,
    lastReviewedDate: baseDateStr,
    lapses,
  };
}

/**
 * Convenience function to calculate review using standard user buttons:
 * 'again' (fail, 1), 'hard' (pass with struggle, 2), 'good' (solid, 4), 'easy' (instant, 5)
 */
export function calculateReviewByGrade(
  card: SM2Card,
  grade: UserReviewGrade,
  currentDate?: string
): SM2Card {
  const quality = GRADE_TO_QUALITY[grade];
  return calculateNextReview(card, quality, currentDate);
}

/**
 * Checks if a card is considered "mastered" (e.g. successfully recalled 3+ times in a row)
 */
export function isCardMastered(card: SM2Card): boolean {
  return card.repetition >= 3 && card.interval >= 10;
}
