/**
 * KS3 English ground truth queries for Shakespeare.
 *
 * Covers Year 7-9 Shakespeare: The Tempest, A Midsummer Night's Dream, Othello.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Shakespeare ground truth queries for KS3 English.
 */
export const SHAKESPEARE_KS3_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'The Tempest Prospero power',
    expectedRelevance: {
      'prosperos-power-over-caliban': 3,
      'prosperos-power-over-miranda': 3,
      'exploring-the-relationship-between-prospero-and-ariel': 2,
    },
  },
  {
    query: 'The Tempest Caliban character',
    expectedRelevance: {
      'caliban-as-an-outsider': 3,
      'the-treatment-of-caliban': 3,
      'prospero-and-calibans-relationship-in-act-1-scene-2': 3,
      'exploring-perceptions-of-caliban': 2,
    },
  },
  {
    query: 'Shakespeare monologue writing',
    expectedRelevance: {
      'crafting-a-monologue': 3,
      'creating-a-clear-character-voice-in-a-monologue': 3,
      'the-overarching-structure-of-a-monologue': 2,
    },
  },
  {
    query: 'The Tempest essay writing',
    expectedRelevance: {
      'analysing-an-essay-about-the-tempest': 3,
      'planning-an-essay-on-prosperos-power-over-caliban': 3,
      'improving-an-essay-about-the-tempest': 2,
    },
  },
] as const;
