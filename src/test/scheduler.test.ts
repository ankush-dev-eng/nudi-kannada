import { describe, it, expect } from 'vitest';
import {
  createInitialCard,
  calculateNextReview,
  calculateReviewByGrade,
  isCardMastered,
} from '@/lib/scheduler';

describe('SM-2 Spaced Repetition Scheduler', () => {
  it('creates an initial card with correct default attributes', () => {
    const card = createInitialCard('phrase-123', '2026-10-25');
    expect(card.phraseId).toBe('phrase-123');
    expect(card.interval).toBe(0);
    expect(card.repetition).toBe(0);
    expect(card.easeFactor).toBe(2.5);
    expect(card.dueDate).toBe('2026-10-25');
    expect(card.lapses).toBe(0);
  });

  it('schedules interval of 1 day on first successful recall (repetition 0 -> 1)', () => {
    const card = createInitialCard('p1', '2026-10-25');
    const updated = calculateNextReview(card, 4, '2026-10-25');

    expect(updated.interval).toBe(1);
    expect(updated.repetition).toBe(1);
    expect(updated.dueDate).toBe('2026-10-26');
  });

  it('schedules interval of 6 days on second successful recall (repetition 1 -> 2)', () => {
    const card = createInitialCard('p1', '2026-10-25');
    const step1 = calculateNextReview(card, 4, '2026-10-25');
    const step2 = calculateNextReview(step1, 4, '2026-10-26');

    expect(step2.interval).toBe(6);
    expect(step2.repetition).toBe(2);
    expect(step2.dueDate).toBe('2026-11-01');
  });

  it('scales interval by easeFactor on third successful recall', () => {
    const card = createInitialCard('p1', '2026-10-25');
    const step1 = calculateNextReview(card, 4, '2026-10-25');
    const step2 = calculateNextReview(step1, 4, '2026-10-26');
    const step3 = calculateNextReview(step2, 4, '2026-11-01');

    // interval = Math.round(6 * EF) where EF is ~2.5
    expect(step3.interval).toBeGreaterThanOrEqual(14);
    expect(step3.repetition).toBe(3);
    expect(isCardMastered(step3)).toBe(true);
  });

  it('resets repetition and records lapse on failed review (grade again)', () => {
    const card = {
      phraseId: 'p1',
      interval: 15,
      repetition: 3,
      easeFactor: 2.5,
      dueDate: '2026-10-25',
      lapses: 0,
    };

    const failed = calculateReviewByGrade(card, 'again', '2026-10-25');
    expect(failed.interval).toBe(1);
    expect(failed.repetition).toBe(0);
    expect(failed.lapses).toBe(1);
    expect(failed.dueDate).toBe('2026-10-26');
    expect(isCardMastered(failed)).toBe(false);
  });

  it('enforces minimum easeFactor floor of 1.3 even under repeated failures', () => {
    let card = createInitialCard('p1', '2026-10-25');
    for (let i = 0; i < 10; i++) {
      card = calculateNextReview(card, 0, '2026-10-25');
    }
    expect(card.easeFactor).toBeGreaterThanOrEqual(1.3);
  });
});
