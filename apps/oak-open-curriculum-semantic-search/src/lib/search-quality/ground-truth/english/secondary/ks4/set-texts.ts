/**
 * KS4 English ground truth queries for set texts.
 *
 * Covers Year 10-11 GCSE English Literature set texts.
 *
 * **Methodology (2026-01-08)**:
 * All slugs verified against bulk-downloads/english-secondary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../../types';

/**
 * KS4 English set text queries.
 *
 * Tests: Macbeth, Inspector Calls, Christmas Carol, Romeo and Juliet, Jekyll and Hyde.
 */
export const ENGLISH_KS4_SET_TEXT_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Macbeth guilt ambition Lady Macbeth themes GCSE',
    expectedRelevance: {
      'conceptualising-guilt-in-macbeth': 3,
      'lady-macbeths-ambition': 3,
      'writing-a-response-about-guilt-in-macbeth': 2,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of GCSE Macbeth themes content using curriculum terminology',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'An Inspector Calls social responsibility class power',
    expectedRelevance: {
      'an-inspector-calls-writing-an-essay-on-punishment-justice-and-the-inspector': 3,
      'exploring-how-priestley-portrays-punishment-and-justice-in-an-inspector-calls': 3,
      'developing-nuanced-analysis-of-an-inspector-calls': 2,
    },
    category: 'precise-topic',
    description:
      'Tests retrieval of GCSE An Inspector Calls themes content using curriculum terminology',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'A Christmas Carol Scrooge redemption transformation Victorian',
    expectedRelevance: {
      'a-christmas-carol-a-hopeful-tale': 3,
      'writing-an-extended-response-on-a-christmas-carol': 3,
      'a-christmas-carol-dickens-critique-of-victorian-institutions': 2,
    },
    category: 'precise-topic',
    description:
      'Tests retrieval of GCSE A Christmas Carol themes content using curriculum terminology',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'Romeo and Juliet love fate tragedy themes GCSE',
    expectedRelevance: {
      'exploring-how-the-prologue-sets-up-the-theme-of-fate-in-romeo-and-juliet': 3,
      'writing-an-essay-on-the-role-of-fate-in-shakespeares-romeo-and-juliet': 3,
      'exploring-love-and-foreshadowing-in-act-1-scene-5-of-romeo-and-juliet': 2,
    },
    category: 'precise-topic',
    description:
      'Tests retrieval of GCSE Romeo and Juliet themes content using curriculum terminology',
    keyStage: 'ks4',
    priority: 'high',
  },
  {
    query: 'Dr Jekyll and Mr Hyde duality Victorian repression',
    expectedRelevance: {
      'duality-in-jekyll-and-hyde-refining-our-response': 3,
      'jekyll-and-hyde-repression-and-fragmented-identities': 3,
      'writing-an-extended-response-about-jekyll-and-hyde': 2,
    },
    category: 'precise-topic',
    description:
      'Tests retrieval of GCSE Jekyll and Hyde themes content using curriculum terminology',
    keyStage: 'ks4',
    priority: 'high',
  },
] as const;
