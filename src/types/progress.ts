import { SituationId } from './phrase';

export type ReviewRating = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * SM-2 Spaced Repetition Card State
 */
export interface SM2Card {
  phraseId: string;
  interval: number; // days until next review
  repetition: number; // consecutive correct reviews
  easeFactor: number; // SM-2 ease factor (initial 2.5)
  dueDate: string; // ISO date string (YYYY-MM-DD)
  lastReviewedDate?: string;
  lapses: number;
}

export interface PronunciationWordResult {
  expected: string;
  spoken: string;
  matched: boolean;
  score: number; // 0 - 100
}

export interface PronunciationResult {
  score: number; // overall 0 - 100
  passed: boolean; // threshold (e.g., >= 70)
  targetKannada: string;
  recognizedText: string;
  wordResults: PronunciationWordResult[];
  feedback: string;
}

export interface SituationProgress {
  situationId: SituationId;
  phrasesLearned: string[]; // phrase IDs
  phrasesMastered: string[]; // phrase IDs (repetition >= 3)
  roleplaysCompleted: string[]; // roleplay IDs
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalPracticeDays: number;
}

export type RomanizationStyle = 'conversational' | 'academic';
export type AppTheme = 'light' | 'dark';

export interface UserSettings {
  theme: AppTheme;
  romanizationStyle: RomanizationStyle;
  audioSpeed: number; // 0.75 or 1.0
  autoPlayAudio: boolean;
}

export interface UserStateExport {
  version: string;
  exportedAt: string;
  streak: UserStreak;
  settings: UserSettings;
  progress: Record<SituationId, SituationProgress>;
  cards: Record<string, SM2Card>;
}
