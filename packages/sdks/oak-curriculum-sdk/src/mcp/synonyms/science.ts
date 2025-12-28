/**
 * Science concept synonyms.
 *
 * Maps canonical science concepts to alternative terms.
 *
 * @remarks
 * Entries marked [MINED-2025-12-26] were extracted from curriculum definitions
 * by an LLM-powered agent. Regex-based mining was insufficient — language
 * understanding was required to distinguish true synonyms from examples,
 * translations, and pedagogical explanations.
 */

export const scienceSynonyms = {
  photosynthesis: ['chlorophyll', 'chloroplast'],
  respiration: ['aerobic respiration', 'anaerobic respiration'],
  'states-of-matter': ['solid', 'liquid', 'gas'],
  /**
   * Forces and related terms.
   *
   * @remarks
   * "gravity" and "gravitational" were removed during audit (2025-12-27) —
   * category error: gravity IS a force (a specific type), not a synonym.
   * Someone searching "gravity" wants gravity lessons, not generic forces.
   */
  forces: ['force', 'newton', 'newtons'],
  energy: ['kinetic energy', 'potential energy', 'conservation of energy'],
  cells: ['cell', 'cell theory', 'cell biology'],
  evolution: ['natural selection', 'adaptation'],
  'rock-cycle': ['igneous', 'sedimentary', 'metamorphic'],

  // [MINED-2025-12-26] Extracted by LLM agent from bulk curriculum definitions
  'artificial-selection': ['selective breeding'],
  pascal: ['newton per square metre', 'pa', 'n/m²'],
  biosphere: ['living world', 'zone of life'],
} as const;

export type ScienceSynonyms = typeof scienceSynonyms;
