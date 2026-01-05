/**
 * Secondary English ground truth queries for Shakespeare.
 *
 * Covers KS3-4 Shakespeare: The Tempest (SECONDARY), Macbeth, Romeo and Juliet (KS4).
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Shakespeare ground truth queries for Secondary English (KS3-4).
 *
 * Merged from SECONDARY (The Tempest) and KS4 (Macbeth, Romeo and Juliet).
 */
export const SHAKESPEARE_SECONDARY_QUERIES: readonly GroundTruthQuery[] = [
  // SECONDARY Shakespeare (The Tempest)
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
  // KS4 Shakespeare (Macbeth)
  {
    query: 'Macbeth Lady Macbeth character analysis',
    expectedRelevance: {
      'a-critical-analysis-of-lady-macbeth': 3,
      'assessing-an-argument-about-lady-macbeth': 3,
      'an-exploration-of-act-1-scenes-5-to-7': 2,
      'an-exploration-of-act-5-scenes-1-to-5': 2,
    },
  },
  {
    query: 'Macbeth Act 1 Scene 5',
    expectedRelevance: {
      'an-exploration-of-act-1-scenes-5-to-7': 3,
      'a-critical-analysis-of-lady-macbeth': 2,
    },
  },
  {
    query: 'Macbeth guilt and conscience',
    expectedRelevance: {
      'an-exploration-of-act-2-scenes-1-and-2': 3,
      'an-exploration-of-act-5-scenes-1-to-5': 3,
      'a-critical-analysis-of-lady-macbeth': 2,
    },
  },
  {
    query: 'Macbeth tragic hero',
    expectedRelevance: {
      'an-exploration-of-act-5-scenes-6-to-9': 3,
      'an-exploration-of-act-3-scenes-1-to-3': 2,
      'a-critical-analysis-of-lady-macbeth': 2,
    },
  },
  {
    query: 'Macbeth witches supernatural',
    expectedRelevance: {
      'an-exploration-of-act-1-scenes-1-4': 3,
      'an-exploration-of-act-4-scenes-1-to-3': 3,
      'an-exploration-of-act-3-scenes-4-to-6': 2,
    },
  },
] as const;
