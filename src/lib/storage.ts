import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { SM2Card, SituationProgress, UserStreak, UserSettings, UserStateExport } from '@/types/progress';
import { SituationId } from '@/types/phrase';

interface NudiDBSchema extends DBSchema {
  cards: {
    key: string; // phraseId
    value: SM2Card;
    indexes: {
      'by-due': string;
      'by-repetition': number;
    };
  };
  progress: {
    key: string; // situationId
    value: SituationProgress;
  };
  meta: {
    key: string;
    value: unknown;
  };
}

const DB_NAME = 'nudi_kannada_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<NudiDBSchema>> | null = null;

export function getDB(): Promise<IDBPDatabase<NudiDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<NudiDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Cards store for SM-2
        if (!db.objectStoreNames.contains('cards')) {
          const cardStore = db.createObjectStore('cards', { keyPath: 'phraseId' });
          cardStore.createIndex('by-due', 'dueDate');
          cardStore.createIndex('by-repetition', 'repetition');
        }

        // Situation progress store
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'situationId' });
        }

        // Metadata store (streak, settings, stats)
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta');
        }
      },
    });
  }
  return dbPromise;
}

// Cards / Spaced Repetition Storage
export async function getSM2Card(phraseId: string): Promise<SM2Card | undefined> {
  const db = await getDB();
  return db.get('cards', phraseId);
}

export async function saveSM2Card(card: SM2Card): Promise<void> {
  const db = await getDB();
  await db.put('cards', card);
}

export async function getAllSM2Cards(): Promise<SM2Card[]> {
  const db = await getDB();
  return db.getAll('cards');
}

export async function getDueCards(todayIso: string): Promise<SM2Card[]> {
  const db = await getDB();
  const allCards = await db.getAll('cards');
  return allCards.filter((card) => card.dueDate <= todayIso);
}

// Situation Progress Storage
export async function getSituationProgress(
  situationId: SituationId
): Promise<SituationProgress | undefined> {
  const db = await getDB();
  return db.get('progress', situationId);
}

export async function saveSituationProgress(prog: SituationProgress): Promise<void> {
  const db = await getDB();
  await db.put('progress', prog);
}

export async function getAllProgress(): Promise<Record<SituationId, SituationProgress>> {
  const db = await getDB();
  const records = await db.getAll('progress');
  const result = {} as Record<SituationId, SituationProgress>;
  for (const item of records) {
    result[item.situationId] = item;
  }
  return result;
}

// Streak & Activity Storage
const STREAK_KEY = 'user_streak';
const SETTINGS_KEY = 'user_settings';

export const DEFAULT_STREAK: UserStreak = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  totalPracticeDays: 0,
};

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  romanizationStyle: 'conversational',
  audioSpeed: 1.0,
  autoPlayAudio: false,
};

export async function getStreak(): Promise<UserStreak> {
  const db = await getDB();
  const streak = (await db.get('meta', STREAK_KEY)) as UserStreak | undefined;
  return streak || DEFAULT_STREAK;
}

export async function saveStreak(streak: UserStreak): Promise<void> {
  const db = await getDB();
  await db.put('meta', streak, STREAK_KEY);
}

export async function recordTodayActivity(): Promise<UserStreak> {
  const current = await getStreak();
  const today = new Date().toISOString().split('T')[0];

  if (current.lastActiveDate === today) {
    return current;
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newCurrentStreak = 1;

  if (current.lastActiveDate === yesterday) {
    newCurrentStreak = current.currentStreak + 1;
  }

  const updated: UserStreak = {
    currentStreak: newCurrentStreak,
    longestStreak: Math.max(current.longestStreak, newCurrentStreak),
    lastActiveDate: today,
    totalPracticeDays: current.totalPracticeDays + 1,
  };

  await saveStreak(updated);
  return updated;
}

// Settings Storage
export async function getStoredSettings(): Promise<UserSettings> {
  const db = await getDB();
  const settings = (await db.get('meta', SETTINGS_KEY)) as UserSettings | undefined;
  return settings || DEFAULT_SETTINGS;
}

export async function saveStoredSettings(settings: UserSettings): Promise<void> {
  const db = await getDB();
  await db.put('meta', settings, SETTINGS_KEY);
}

// Export / Import / Reset
export async function exportUserData(): Promise<UserStateExport> {
  const streak = await getStreak();
  const settings = await getStoredSettings();
  const progress = await getAllProgress();
  const allCards = await getAllSM2Cards();

  const cardsMap: Record<string, SM2Card> = {};
  for (const c of allCards) {
    cardsMap[c.phraseId] = c;
  }

  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    streak,
    settings,
    progress,
    cards: cardsMap,
  };
}

export async function importUserData(data: UserStateExport): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['cards', 'progress', 'meta'], 'readwrite');

  // Clear existing
  await tx.objectStore('cards').clear();
  await tx.objectStore('progress').clear();
  await tx.objectStore('meta').clear();

  // Load cards
  if (data.cards) {
    for (const card of Object.values(data.cards)) {
      await tx.objectStore('cards').put(card);
    }
  }

  // Load progress
  if (data.progress) {
    for (const prog of Object.values(data.progress)) {
      await tx.objectStore('progress').put(prog);
    }
  }

  // Load streak and settings
  if (data.streak) {
    await tx.objectStore('meta').put(data.streak, STREAK_KEY);
  }
  if (data.settings) {
    await tx.objectStore('meta').put(data.settings, SETTINGS_KEY);
  }

  await tx.done;
}

export async function resetUserData(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['cards', 'progress', 'meta'], 'readwrite');
  await tx.objectStore('cards').clear();
  await tx.objectStore('progress').clear();
  await tx.objectStore('meta').clear();
  await tx.done;
}
