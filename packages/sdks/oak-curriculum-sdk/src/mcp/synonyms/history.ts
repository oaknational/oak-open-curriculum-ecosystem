/**
 * History topics and periods synonyms.
 *
 * Maps canonical history topics to alternative terms.
 *
 * @remarks
 * Entries marked [MINED-2025-12-26] were extracted from curriculum definitions
 * by an LLM-powered agent. Regex-based mining was insufficient — language
 * understanding was required to distinguish true synonyms from examples.
 */

export const historySynonyms = {
  'world-war-1': ['world war i', 'ww1', 'first world war', 'great war'],
  'world-war-2': ['world war ii', 'ww2', 'second world war'],
  'industrial-revolution': ['victorian industry', 'mechanisation', 'mechanization'],
  tudors: ['tudor'],
  victorians: ['victorian'],
  'cold-war': ['superpower rivalry'],
  'british-empire': ['empire', 'imperial'],

  // [MINED-2025-12-26] Extracted by LLM agent from bulk curriculum definitions
  royalist: ['cavaliers', 'cavalier'],
  parliamentarian: ['roundheads', 'roundhead'],
  'neolithic-era': ['new stone age', 'neolithic period'],
  'paleolithic-era': ['early stone age', 'old stone age', 'paleolithic period'],
  persia: ['persian empire', 'achaemenid empire'],
  hmos: ['houses of multiple occupation'],
} as const;

export type HistorySynonyms = typeof historySynonyms;
