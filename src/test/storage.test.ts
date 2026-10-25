import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import {
  saveSM2Card,
  getSM2Card,
  getAllSM2Cards,
  getDueCards,
  saveStreak,
  getStreak,
  saveStoredSettings,
  getStoredSettings,
  resetUserData,
  exportUserData,
  importUserData,
} from '@/lib/storage';
import { SM2Card } from '@/types/progress';

describe('Storage Layer (IndexedDB with idb)', () => {
  beforeEach(async () => {
    await resetUserData();
  });

  it('saves and retrieves SM2 flashcards', async () => {
    const card: SM2Card = {
      phraseId: 'travel-01',
      interval: 1,
      repetition: 1,
      easeFactor: 2.5,
      dueDate: '2026-10-25',
      lapses: 0,
    };

    await saveSM2Card(card);
    const retrieved = await getSM2Card('travel-01');

    expect(retrieved).toBeDefined();
    expect(retrieved?.phraseId).toBe('travel-01');
    expect(retrieved?.interval).toBe(1);
  });

  it('filters due cards based on current date', async () => {
    const cardPast: SM2Card = {
      phraseId: 'p-past',
      interval: 1,
      repetition: 1,
      easeFactor: 2.5,
      dueDate: '2026-10-20',
      lapses: 0,
    };
    const cardFuture: SM2Card = {
      phraseId: 'p-future',
      interval: 6,
      repetition: 2,
      easeFactor: 2.5,
      dueDate: '2026-10-30',
      lapses: 0,
    };

    await saveSM2Card(cardPast);
    await saveSM2Card(cardFuture);

    const dueCards = await getDueCards('2026-10-25');
    expect(dueCards.length).toBe(1);
    expect(dueCards[0].phraseId).toBe('p-past');
  });

  it('manages streak and settings persistence', async () => {
    const streak = {
      currentStreak: 5,
      longestStreak: 12,
      lastActiveDate: '2026-10-24',
      totalPracticeDays: 15,
    };

    await saveStreak(streak);
    const retrievedStreak = await getStreak();
    expect(retrievedStreak.currentStreak).toBe(5);

    const settings = {
      theme: 'dark' as const,
      romanizationStyle: 'academic' as const,
      audioSpeed: 0.75,
      autoPlayAudio: true,
    };

    await saveStoredSettings(settings);
    const retrievedSettings = await getStoredSettings();
    expect(retrievedSettings.theme).toBe('dark');
    expect(retrievedSettings.audioSpeed).toBe(0.75);
  });

  it('exports and imports complete user data', async () => {
    await saveSM2Card({
      phraseId: 'travel-05',
      interval: 3,
      repetition: 2,
      easeFactor: 2.6,
      dueDate: '2026-10-28',
      lapses: 0,
    });

    const exported = await exportUserData();
    expect(exported.cards['travel-05']).toBeDefined();

    await resetUserData();
    const afterReset = await getAllSM2Cards();
    expect(afterReset.length).toBe(0);

    await importUserData(exported);
    const restored = await getSM2Card('travel-05');
    expect(restored?.interval).toBe(3);
  });
});
