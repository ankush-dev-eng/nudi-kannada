import { create } from 'zustand';
import phrasesData from '@/data/phrases.json';
import { Phrase, SituationMeta, SituationId, RoleplayScenario } from '@/types/phrase';
import {
  SM2Card,
  SituationProgress,
  UserStreak,
  UserSettings,
} from '@/types/progress';
import {
  getAllProgress,
  getAllSM2Cards,
  getStreak,
  getStoredSettings,
  saveSM2Card,
  saveSituationProgress,
  saveStoredSettings,
  recordTodayActivity,
  resetUserData,
  exportUserData,
  importUserData,
  DEFAULT_SETTINGS,
  DEFAULT_STREAK,
} from '@/lib/storage';
import {
  createInitialCard,
  calculateReviewByGrade,
  isCardMastered,
  UserReviewGrade,
} from '@/lib/scheduler';

interface AppState {
  // Static content from dataset
  phrases: Phrase[];
  situations: SituationMeta[];
  roleplays: RoleplayScenario[];

  // Dynamic user progress from IndexedDB
  cards: Record<string, SM2Card>;
  progress: Record<SituationId, SituationProgress>;
  streak: UserStreak;
  settings: UserSettings;
  isLoading: boolean;

  // Actions
  initializeStore: () => Promise<void>;
  markPhraseLearned: (phraseId: string, situationId: SituationId) => Promise<void>;
  submitReview: (phraseId: string, grade: UserReviewGrade) => Promise<void>;
  completeRoleplay: (roleplayId: string, situationId: SituationId) => Promise<void>;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  toggleTheme: () => Promise<void>;
  resetProgress: () => Promise<void>;
  exportData: () => Promise<any>;
  importData: (data: any) => Promise<void>;

  // Getters
  getDueReviewPhrases: () => Phrase[];
  getPhrasesBySituation: (situationId: SituationId) => Phrase[];
  getRoleplaysBySituation: (situationId: SituationId) => RoleplayScenario[];
}

export const useAppStore = create<AppState>((set, get) => ({
  phrases: phrasesData.phrases as Phrase[],
  situations: phrasesData.situations as SituationMeta[],
  roleplays: phrasesData.roleplays as unknown as RoleplayScenario[],

  cards: {},
  progress: {
    travel: { situationId: 'travel', phrasesLearned: [], phrasesMastered: [], roleplaysCompleted: [] },
    shopping: { situationId: 'shopping', phrasesLearned: [], phrasesMastered: [], roleplaysCompleted: [] },
    healthcare: { situationId: 'healthcare', phrasesLearned: [], phrasesMastered: [], roleplaysCompleted: [] },
    transport: { situationId: 'transport', phrasesLearned: [], phrasesMastered: [], roleplaysCompleted: [] },
    education: { situationId: 'education', phrasesLearned: [], phrasesMastered: [], roleplaysCompleted: [] },
    workplace: { situationId: 'workplace', phrasesLearned: [], phrasesMastered: [], roleplaysCompleted: [] },
  },
  streak: DEFAULT_STREAK,
  settings: DEFAULT_SETTINGS,
  isLoading: true,

  initializeStore: async () => {
    try {
      const [storedProgress, storedCardsList, streak, settings] = await Promise.all([
        getAllProgress(),
        getAllSM2Cards(),
        getStreak(),
        getStoredSettings(),
      ]);

      const cardsMap: Record<string, SM2Card> = {};
      for (const card of storedCardsList) {
        cardsMap[card.phraseId] = card;
      }

      // Merge defaults with stored progress
      const currentProgress = get().progress;
      const mergedProgress = { ...currentProgress, ...storedProgress };

      // Apply theme attribute to document
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', settings.theme);
      }

      set({
        cards: cardsMap,
        progress: mergedProgress,
        streak,
        settings,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  markPhraseLearned: async (phraseId: string, situationId: SituationId) => {
    const { progress, cards } = get();
    const currentProg = progress[situationId] || {
      situationId,
      phrasesLearned: [],
      phrasesMastered: [],
      roleplaysCompleted: [],
    };

    if (!currentProg.phrasesLearned.includes(phraseId)) {
      const updatedProg = {
        ...currentProg,
        phrasesLearned: [...currentProg.phrasesLearned, phraseId],
      };

      await saveSituationProgress(updatedProg);

      // Create initial SM2 card if not already created
      if (!cards[phraseId]) {
        const newCard = createInitialCard(phraseId);
        await saveSM2Card(newCard);
        set((state) => ({
          cards: { ...state.cards, [phraseId]: newCard },
          progress: { ...state.progress, [situationId]: updatedProg },
        }));
      } else {
        set((state) => ({
          progress: { ...state.progress, [situationId]: updatedProg },
        }));
      }

      const updatedStreak = await recordTodayActivity();
      set({ streak: updatedStreak });
    }
  },

  submitReview: async (phraseId: string, grade: UserReviewGrade) => {
    const { cards, phrases, progress } = get();
    const currentCard = cards[phraseId] || createInitialCard(phraseId);
    const updatedCard = calculateReviewByGrade(currentCard, grade);

    await saveSM2Card(updatedCard);

    // Check if mastered
    const phrase = phrases.find((p) => p.id === phraseId);
    if (phrase) {
      const sitProg = progress[phrase.situationId];
      if (sitProg) {
        const mastered = isCardMastered(updatedCard);
        const hasMastered = sitProg.phrasesMastered.includes(phraseId);

        let updatedMasteredList = sitProg.phrasesMastered;
        if (mastered && !hasMastered) {
          updatedMasteredList = [...sitProg.phrasesMastered, phraseId];
        } else if (!mastered && hasMastered) {
          updatedMasteredList = sitProg.phrasesMastered.filter((id) => id !== phraseId);
        }

        if (updatedMasteredList !== sitProg.phrasesMastered) {
          const updatedProg = { ...sitProg, phrasesMastered: updatedMasteredList };
          await saveSituationProgress(updatedProg);
          set((state) => ({
            progress: { ...state.progress, [phrase.situationId]: updatedProg },
          }));
        }
      }
    }

    const updatedStreak = await recordTodayActivity();

    set((state) => ({
      cards: { ...state.cards, [phraseId]: updatedCard },
      streak: updatedStreak,
    }));
  },

  completeRoleplay: async (roleplayId: string, situationId: SituationId) => {
    const { progress } = get();
    const currentProg = progress[situationId] || {
      situationId,
      phrasesLearned: [],
      phrasesMastered: [],
      roleplaysCompleted: [],
    };

    if (!currentProg.roleplaysCompleted.includes(roleplayId)) {
      const updatedProg = {
        ...currentProg,
        roleplaysCompleted: [...currentProg.roleplaysCompleted, roleplayId],
      };
      await saveSituationProgress(updatedProg);
      const updatedStreak = await recordTodayActivity();

      set((state) => ({
        progress: { ...state.progress, [situationId]: updatedProg },
        streak: updatedStreak,
      }));
    }
  },

  updateSettings: async (newSettings: Partial<UserSettings>) => {
    const current = get().settings;
    const merged = { ...current, ...newSettings };
    await saveStoredSettings(merged);

    if (newSettings.theme && typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newSettings.theme);
    }

    set({ settings: merged });
  },

  toggleTheme: async () => {
    const current = get().settings.theme;
    const next = current === 'light' ? 'dark' : 'light';
    await get().updateSettings({ theme: next });
  },

  resetProgress: async () => {
    await resetUserData();
    await get().initializeStore();
  },

  exportData: async () => {
    return exportUserData();
  },

  importData: async (data: any) => {
    await importUserData(data);
    await get().initializeStore();
  },

  getDueReviewPhrases: () => {
    const { cards, phrases } = get();
    const today = new Date().toISOString().split('T')[0];

    return phrases.filter((p) => {
      const card = cards[p.id];
      if (!card) return false;
      return card.dueDate <= today;
    });
  },

  getPhrasesBySituation: (situationId: SituationId) => {
    return get().phrases.filter((p) => p.situationId === situationId);
  },

  getRoleplaysBySituation: (situationId: SituationId) => {
    return get().roleplays.filter((r) => r.situationId === situationId);
  },
}));
