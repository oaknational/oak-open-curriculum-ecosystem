/**
 * KS4 Biology ground truth queries for search quality evaluation.
 *
 * Covers Year 10-11 GCSE Biology: cells, genetics, photosynthesis, respiration.
 *
 * **Methodology (2026-01-06)**:
 * All lesson slugs verified from bulk-downloads/science-secondary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../../types';

/**
 * KS4 Biology ground truth queries.
 *
 * Topics: cells, DNA, respiration, photosynthesis, inheritance.
 */
export const BIOLOGY_KS4_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'GCSE eukaryotic prokaryotic cells',
    expectedRelevance: {
      'eukaryotic-and-prokaryotic-organisms': 3,
      'common-structures-of-prokaryotic-cells': 3,
      'plant-cells-common-structures-and-specialised-cells': 3,
      cells: 2,
    },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'DNA genome GCSE',
    expectedRelevance: { 'inheritance-genotype-and-phenotype': 2 },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'cellular respiration aerobic anaerobic',
    expectedRelevance: {
      'aerobic-cellular-respiration-in-humans-and-other-organisms': 3,
      'anaerobic-cellular-respiration-in-humans-and-other-organisms': 3,
      'aerobic-cellular-respiration-in-humans-and-other-organisms-including-atp': 2,
    },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'mitosis meiosis cell division',
    expectedRelevance: {},
    category: 'naturalistic',
    description: 'Cell division unit - needs specific lesson slugs',
    keyStage: 'ks4',
  },
  {
    query: 'photosynthesis rate factors',
    expectedRelevance: {},
    category: 'naturalistic',
    description: 'Photosynthesis factors affecting rate',
    keyStage: 'ks4',
  },
] as const;
