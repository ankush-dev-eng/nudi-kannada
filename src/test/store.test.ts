import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { useAppStore } from '@/store/useAppStore';
import { resetUserData } from '@/lib/storage';

describe('Zustand Global App Store', () => {
  beforeEach(async () => {
    await resetUserData();
    await useAppStore.getState().initializeStore();
  });

  it('initializes store with phrases and situations from dataset', () => {
    const state = useAppStore.getState();
    expect(state.phrases.length).toBeGreaterThanOrEqual(60);
    expect(state.situations.length).toBe(6);
    expect(state.roleplays.length).toBeGreaterThanOrEqual(12);
  });

  it('marks phrase as learned and creates SM2 card', async () => {
    const store = useAppStore.getState();
    await store.markPhraseLearned('travel-01', 'travel');

    const updated = useAppStore.getState();
    expect(updated.progress.travel.phrasesLearned).toContain('travel-01');
    expect(updated.cards['travel-01']).toBeDefined();
    expect(updated.cards['travel-01'].phraseId).toBe('travel-01');
  });

  it('submits review and updates SM2 card intervals', async () => {
    const store = useAppStore.getState();
    await store.markPhraseLearned('travel-01', 'travel');
    await store.submitReview('travel-01', 'good');

    const updated = useAppStore.getState();
    expect(updated.cards['travel-01'].interval).toBe(1);
    expect(updated.cards['travel-01'].repetition).toBe(1);
  });

  it('toggles theme between light and dark', async () => {
    const store = useAppStore.getState();
    expect(store.settings.theme).toBe('light');

    await store.toggleTheme();
    expect(useAppStore.getState().settings.theme).toBe('dark');

    await store.toggleTheme();
    expect(useAppStore.getState().settings.theme).toBe('light');
  });

  it('filters phrases and roleplays by situation', () => {
    const store = useAppStore.getState();
    const travelPhrases = store.getPhrasesBySituation('travel');
    expect(travelPhrases.length).toBeGreaterThanOrEqual(10);
    expect(travelPhrases.every((p) => p.situationId === 'travel')).toBe(true);

    const travelRoleplays = store.getRoleplaysBySituation('travel');
    expect(travelRoleplays.length).toBeGreaterThanOrEqual(2);
  });
});
