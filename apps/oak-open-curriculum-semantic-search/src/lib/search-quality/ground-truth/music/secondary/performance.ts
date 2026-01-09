/**
 * SECONDARY Music performance ground truth queries.
 *
 * Covers drumming, keyboard skills, and ensemble playing.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified against Oak API via MCP tools:
 * - `get-key-stages-subject-lessons` for lesson slugs
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * SECONDARY Music performance standard queries.
 */
export const MUSIC_SECONDARY_PERFORMANCE_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'drum grooves rhythm',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for drum grooves units.',
    expectedRelevance: {
      'the-role-of-the-kick-and-snare-in-drum-grooves': 3,
      'creating-variation-to-a-fundamental-drum-groove': 3,
      'the-role-of-the-hi-hat-in-a-drum-groove': 2,
    },
  },
  {
    query: 'keyboard skills music',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for keyboard unit.',
    expectedRelevance: {
      'playing-expressively-ode-to-joy': 3,
      'adding-an-accompaniment-to-a-melody': 2,
    },
  },
  {
    query: 'djembe West African drumming',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Direct curriculum term match for West African music.',
    expectedRelevance: {
      'context-and-technique-in-west-african-drumming': 3,
      'kuku-djembe-and-dundun-parts': 3,
      'composing-in-a-kuku-or-warabadon-style': 2,
    },
  },
] as const;
