/**
 * KS4 History ground truth queries for historic environments.
 *
 * Covers Year 10-11 GCSE History depth studies and historic environments.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../../types';

/**
 * KS4 History historic environment queries.
 */
export const HISTORY_KS4_HISTORIC_ENV_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Elizabethan England theatre Globe',
    expectedRelevance: {},
    category: 'naturalistic',
    description: 'Elizabethan England depth study',
    keyStage: 'ks4',
  },
  {
    query: 'Weimar Germany hyperinflation',
    expectedRelevance: {},
    category: 'naturalistic',
    description: 'Germany 1919-1939 depth study',
    keyStage: 'ks4',
  },
  {
    query: 'Cold War Berlin Wall',
    expectedRelevance: {},
    category: 'naturalistic',
    description: 'Cold War superpower relations',
    keyStage: 'ks4',
  },
  {
    query: 'Norman England Domesday Book',
    expectedRelevance: {},
    category: 'naturalistic',
    description: 'Norman England depth study',
    keyStage: 'ks4',
  },
  {
    query: 'WWI trenches Western Front',
    expectedRelevance: {},
    category: 'naturalistic',
    description: 'Conflict and tension WW1',
    keyStage: 'ks4',
  },
] as const;
