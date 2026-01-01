/**
 * Computing concept synonyms.
 *
 * Maps canonical computing concepts to alternative terms.
 *
 * @remarks
 * Entries marked [MINED-2025-12-26] were extracted from curriculum definitions
 * by an LLM-powered agent. Regex-based mining was insufficient — language
 * understanding was required to distinguish true synonyms from examples.
 */

export const computingSynonyms = {
  // [MINED-2025-12-26] Extracted by LLM agent from bulk curriculum definitions

  /** Image representation */
  raster: ['bitmap', 'bitmap image', 'raster graphic'],
  'colour-depth': ['bit depth', 'color depth'],

  /** Software licensing */
  proprietary: ['closed source', 'closed source software'],
  'open-source': ['open source software', 'foss', 'free software'],

  /** General computing */
  algorithm: ['step by step', 'instructions', 'procedure'],
  debugging: ['debug', 'finding errors', 'fixing bugs'],
} as const;

export type ComputingSynonyms = typeof computingSynonyms;

