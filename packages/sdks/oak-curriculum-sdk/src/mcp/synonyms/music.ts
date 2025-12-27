/**
 * Music concept synonyms.
 *
 * Maps canonical music concepts to alternative terms.
 *
 * @remarks
 * All entries were extracted from curriculum definitions by an LLM-powered agent
 * on 2025-12-26. Regex-based mining was insufficient — language understanding
 * was required to distinguish true synonyms from examples and translations.
 *
 * Many music terms have UK/US variants (e.g., semibreve/whole note) that are
 * genuinely useful for international search contexts.
 */

export const musicSynonyms = {
  // [MINED-2025-12-26] Extracted by LLM agent from bulk curriculum definitions

  /** Note duration - UK vs US terminology */
  semibreve: ['whole note'],
  minim: ['half note'],
  crotchet: ['quarter note'],
  quaver: ['eighth note'],
  semiquaver: ['sixteenth note'],

  /** Musical concepts */
  upbeat: ['anacrusis', 'pickup note', 'pick-up'],
  lied: ['lieder', 'german art song'],

  /** Performance techniques */
  'walking-bass': ['walking bass line'],
} as const;

export type MusicSynonyms = typeof musicSynonyms;
