/**
 * KS4 English ground truth queries for set texts.
 *
 * Covers Year 10-11 GCSE English Literature set texts.
 *
 * **Methodology (2026-01-06)**:
 * Tests specific set text queries for GCSE English Literature.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../../types';

/**
 * KS4 English set text queries.
 *
 * Tests: Macbeth, Inspector Calls, Christmas Carol, Romeo and Juliet.
 */
export const ENGLISH_KS4_SET_TEXT_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Macbeth guilt ambition GCSE',
    expectedRelevance: { 'ambition-in-macbeth': 3, 'guilt-in-macbeth': 3 },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'An Inspector Calls social responsibility',
    expectedRelevance: { 'an-inspector-calls-social-responsibility': 3 },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'A Christmas Carol Scrooge redemption',
    expectedRelevance: { 'scrooges-redemption-in-a-christmas-carol': 3 },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'Romeo and Juliet love death',
    expectedRelevance: { 'love-in-romeo-and-juliet': 3, 'death-in-romeo-and-juliet': 3 },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
  {
    query: 'Dr Jekyll and Mr Hyde duality',
    expectedRelevance: { 'duality-in-dr-jekyll-and-mr-hyde': 3 },
    category: 'naturalistic',
    keyStage: 'ks4',
  },
] as const;
