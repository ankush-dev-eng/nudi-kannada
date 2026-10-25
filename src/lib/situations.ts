import { SituationId, SituationMeta } from '@/types/phrase';
import phrasesData from '@/data/phrases.json';

export const VALID_SITUATION_IDS: SituationId[] = [
  'travel',
  'shopping',
  'healthcare',
  'transport',
  'education',
  'workplace',
];

/**
 * Slug alias map allowing canonical IDs, short URLs, and colloquial aliases
 * to resolve to valid SituationIds.
 */
export const SITUATION_SLUG_MAP: Record<string, SituationId> = {
  // Canonical IDs
  travel: 'travel',
  shopping: 'shopping',
  healthcare: 'healthcare',
  transport: 'transport',
  education: 'education',
  workplace: 'workplace',

  // Common aliases, synonyms and short slugs
  commute: 'travel',
  exploration: 'travel',
  market: 'shopping',
  markets: 'shopping',
  bazaar: 'shopping',
  store: 'shopping',
  health: 'healthcare',
  clinic: 'healthcare',
  medical: 'healthcare',
  hospital: 'healthcare',
  transit: 'transport',
  auto: 'transport',
  bus: 'transport',
  bmtc: 'transport',
  metro: 'transport',
  college: 'education',
  school: 'education',
  campus: 'education',
  office: 'workplace',
  work: 'workplace',
  job: 'workplace',
};

/**
 * Resolves a given string slug or ID to a canonical SituationId.
 * Returns null if the slug is not recognized.
 */
export function resolveSituationId(slug: string | null | undefined): SituationId | null {
  if (!slug) return null;
  const clean = slug.toLowerCase().trim();
  return SITUATION_SLUG_MAP[clean] || null;
}

/**
 * Checks whether a given string is a valid canonical situation ID.
 */
export function isValidSituationId(id: string | null | undefined): id is SituationId {
  if (!id) return false;
  return VALID_SITUATION_IDS.includes(id as SituationId);
}

/**
 * Retrieves metadata for a specific situation by canonical ID or alias slug.
 */
export function getSituationBySlug(slug: string | null | undefined): SituationMeta | undefined {
  const resolved = resolveSituationId(slug);
  if (!resolved) return undefined;
  return (phrasesData.situations as SituationMeta[]).find((s) => s.id === resolved);
}

/**
 * Retrieves all 6 situation metadata objects.
 */
export function getAllSituations(): SituationMeta[] {
  return phrasesData.situations as SituationMeta[];
}
