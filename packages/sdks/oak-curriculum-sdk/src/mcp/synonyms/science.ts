/**
 * Science concept synonyms.
 *
 * Maps canonical science concepts to alternative terms.
 *
 * @module synonyms/science
 */

export const scienceSynonyms = {
  photosynthesis: ['chlorophyll', 'chloroplast'],
  respiration: ['aerobic respiration', 'anaerobic respiration'],
  'states-of-matter': ['solid', 'liquid', 'gas'],
  forces: ['force', 'newton', 'newtons', 'gravity', 'gravitational'],
  energy: ['kinetic energy', 'potential energy', 'conservation of energy'],
  cells: ['cell', 'cell theory', 'cell biology'],
  evolution: ['natural selection', 'adaptation'],
  'rock-cycle': ['igneous', 'sedimentary', 'metamorphic'],
} as const;

export type ScienceSynonyms = typeof scienceSynonyms;
