/**
 * SECONDARY French ground truth queries for grammar topics.
 *
 * Covers tenses, negation, verbs.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Grammar ground truth queries for SECONDARY French.
 */
export const GRAMMAR_SECONDARY_FRENCH: readonly GroundTruthQuery[] = [
  {
    query: 'French negation ne pas',
    expectedRelevance: {
      'what-isnt-happening-ne-pas-negation': 3,
      'what-people-do-and-dont-do-ne-pas-negation': 2,
      'what-isnt-done-negation-before-a-noun-with-avoir-etre-faire': 2,
      'what-isnt-there-negation-before-a-noun-with-il-y-a': 1,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of French negation content using curriculum terminology',
  },
  {
    query: 'French present tense verbs',
    expectedRelevance: {
      'what-people-do-and-dont-do-ne-pas-negation': 3,
      'what-isnt-happening-ne-pas-negation': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of French present tense content using curriculum terminology',
  },
  {
    query: 'French avoir être',
    expectedRelevance: {
      'what-isnt-done-negation-before-a-noun-with-avoir-etre-faire': 3,
      'what-people-do-and-dont-do-ne-pas-negation': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of French auxiliary verbs content using curriculum terminology',
  },
  {
    query: 'French ER verbs and RE verbs',
    expectedRelevance: {
      'qui-fait-quoi-re-verbs-like-prendre-and-entendre': 3,
      'mon-temps-libre-subject-pronouns-er-verbs-and-aimer-plus-infinitive': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests verb conjugation pattern retrieval.',
  },
  {
    query: 'verbs and adjectives in French grammar',
    expectedRelevance: {
      'two-musicians-singular-etre-singular-adjectives': 3,
      'dieppe-festival-plural-er-verbs-est-ce-que-questions': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of verb conjugation with adjective agreement.',
  },
] as const;
