/**
 * History topics and periods synonyms.
 *
 * Maps canonical history topics to alternative terms.
 */

export const historySynonyms = {
  'world-war-1': ['world war i', 'ww1', 'first world war', 'great war'],
  'world-war-2': ['world war ii', 'ww2', 'second world war'],
  'industrial-revolution': ['victorian industry', 'mechanisation', 'mechanization'],
  tudors: ['tudor'],
  victorians: ['victorian'],
  'cold-war': ['superpower rivalry'],
  'british-empire': ['empire', 'imperial'],
} as const;

export type HistorySynonyms = typeof historySynonyms;
