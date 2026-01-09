/**
 * KS4 History ground truth queries for historic environments.
 *
 * Covers Year 10-11 GCSE History depth studies and historic environments.
 *
 * **Methodology (2026-01-08)**:
 * All slugs verified against bulk-downloads/history-secondary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../../types';

/**
 * KS4 History historic environment queries.
 */
export const HISTORY_KS4_HISTORIC_ENV_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Elizabethan England society population poverty poor law',
    expectedRelevance: {
      'growing-population-in-elizabethan-england': 3,
      'the-impact-of-the-elizabethan-poor-law': 3,
      'was-there-a-golden-age-for-the-poor-in-elizabethan-england': 2,
    },
    category: 'precise-topic',
    description: 'Elizabethan England depth study',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'Cold War Berlin Wall construction crisis tensions',
    expectedRelevance: {
      'berlin-1961-63-the-berlin-wall': 3,
      'construction-of-the-berlin-wall': 3,
      'the-fall-of-the-berlin-wall': 2,
    },
    category: 'precise-topic',
    description: 'Cold War superpower relations',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'Norman England Domesday Book feudal system significance',
    expectedRelevance: {
      'domesday-book': 3,
      'the-significance-of-domesday-book': 3,
      'the-feudal-system-in-norman-england': 2,
    },
    category: 'precise-topic',
    description: 'Norman England depth study',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'Western Front trenches medical treatment conditions WW1',
    expectedRelevance: {
      'the-western-front': 3,
      'conditions-requiring-medical-treatment-on-the-western-front': 3,
      'the-british-sector-of-the-western-front': 2,
    },
    category: 'precise-topic',
    description: 'Conflict and tension WW1',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'Cold War origins tensions superpowers 1941 onwards',
    expectedRelevance: {
      'the-origins-of-the-cold-war-1941-58': 3,
      'cold-war-crises-1958-70': 3,
      'the-end-of-the-cold-war-1970-91': 2,
    },
    category: 'precise-topic',
    description: 'Cold War overview',
    keyStage: 'ks4',
    priority: 'medium',
  },
] as const;
