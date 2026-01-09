/**
 * KS4 Biology ground truth queries for search quality evaluation.
 *
 * Covers Year 10-11 GCSE Biology: cells, genetics, photosynthesis, respiration.
 *
 * **Methodology (2026-01-08)**:
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
    query: 'GCSE eukaryotic prokaryotic cells differences structures',
    expectedRelevance: {
      'eukaryotic-and-prokaryotic-organisms': 3,
      'common-structures-of-prokaryotic-cells': 3,
      'plant-cells-common-structures-and-specialised-cells': 2,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of GCSE cell types content using curriculum terminology',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'DNA genome inheritance genotype phenotype GCSE',
    expectedRelevance: {
      'explaining-inheritance-mendel-and-beyond': 3,
      'dna-chromosomes-genes-and-the-genome': 2,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of GCSE genetics content using curriculum terminology',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'cellular respiration aerobic anaerobic energy release',
    expectedRelevance: {
      'aerobic-cellular-respiration-in-humans-and-other-organisms': 3,
      'anaerobic-cellular-respiration-in-humans-and-other-organisms': 3,
      'aerobic-cellular-respiration-in-humans-and-other-organisms-including-atp': 2,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of GCSE respiration content using curriculum terminology',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'mitosis meiosis cell division cycle stages',
    expectedRelevance: {
      'the-cell-cycle-and-cell-division-mitosis': 3,
      'making-gametes-meiosis': 3,
      'observing-mitosis-in-plant-cells-using-a-light-microscope': 2,
    },
    category: 'precise-topic',
    description: 'Cell division comparing mitosis and meiosis',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'photosynthesis rate factors limiting light intensity',
    expectedRelevance: {
      'factors-affecting-the-rate-of-photosynthesis': 3,
      'photosynthesis-and-limiting-factors': 3,
      'the-effect-of-light-intensity-on-rate-of-photosynthesis-in-pondweed-practical': 2,
    },
    category: 'precise-topic',
    description: 'Photosynthesis factors affecting rate',
    keyStage: 'ks4',
    priority: 'high',
  },
] as const;
