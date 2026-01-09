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
      'prosperos-power-over-miranda': 2,
      'exploring-the-relationship-between-prospero-and-ariel': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of The Tempest power themes content using curriculum terminology',
  },
  {
    query: 'The Tempest Caliban character',
    expectedRelevance: {
      'caliban-as-an-outsider': 3,
      'the-treatment-of-caliban': 2,
      'prospero-and-calibans-relationship-in-act-1-scene-2': 2,
      'exploring-perceptions-of-caliban': 1,
    },
    category: 'precise-topic',
    priority: 'high',
    description:
      'Tests retrieval of Caliban character analysis content using curriculum terminology',
  },
  {
    query: 'Shakespeare monologue writing',
    expectedRelevance: {
      'crafting-a-monologue': 3,
      'creating-a-clear-character-voice-in-a-monologue': 2,
      'the-overarching-structure-of-a-monologue': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of monologue writing content using curriculum terminology',
  },
  {
    query: 'The Tempest essay writing',
    expectedRelevance: {
      'analysing-an-essay-about-the-tempest': 3,
      'planning-an-essay-on-prosperos-power-over-caliban': 2,
      'improving-an-essay-about-the-tempest': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of Tempest essay writing content using curriculum terminology',
  },
  // KS4 Shakespeare (Macbeth)
  {
    query: 'Macbeth Lady Macbeth character analysis',
    expectedRelevance: {
      'a-critical-analysis-of-lady-macbeth': 3,
      'assessing-an-argument-about-lady-macbeth': 2,
      'an-exploration-of-act-1-scenes-5-to-7': 2,
      'an-exploration-of-act-5-scenes-1-to-5': 1,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Lady Macbeth analysis content using curriculum terminology',
  },
  {
    query: 'Macbeth Act 1 Scene 5',
    expectedRelevance: {
      'an-exploration-of-act-1-scenes-5-to-7': 3,
      'a-critical-analysis-of-lady-macbeth': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of Macbeth Act 1 content using curriculum terminology',
  },
  {
    query: 'Macbeth guilt and conscience',
    expectedRelevance: {
      'an-exploration-of-act-2-scenes-1-and-2': 3,
      'an-exploration-of-act-5-scenes-1-to-5': 2,
      'a-critical-analysis-of-lady-macbeth': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Macbeth guilt themes content using curriculum terminology',
  },
  {
    query: 'Macbeth tragic hero',
    expectedRelevance: {
      'an-exploration-of-act-5-scenes-6-to-9': 3,
      'an-exploration-of-act-3-scenes-1-to-3': 2,
      'a-critical-analysis-of-lady-macbeth': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Macbeth tragic hero content using curriculum terminology',
  },
  {
    query: 'Macbeth witches supernatural',
    expectedRelevance: {
      'an-exploration-of-act-1-scenes-1-4': 3,
      'an-exploration-of-act-4-scenes-1-to-3': 2,
      'an-exploration-of-act-3-scenes-4-to-6': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Macbeth supernatural content using curriculum terminology',
  },
] as const;
