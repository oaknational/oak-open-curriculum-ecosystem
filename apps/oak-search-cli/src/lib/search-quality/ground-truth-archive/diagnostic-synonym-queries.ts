/**
 * Synonym diagnostic queries for understanding synonym expansion patterns.
 *
 * These queries test:
 * - Single-word vs phrase synonym expansion
 * - Synonym position sensitivity (start/middle/end)
 * - Multi-word curriculum term matching
 *
 * @see `.agent/plans/semantic-search/part-1-search-excellence.md`
 */

import type { GroundTruthQuery } from './types';

/**
 * Synonym diagnostic queries - testing synonym expansion patterns.
 *
 * We know synonyms ARE deployed and working (verified via analyzer test).
 * But 2 of 3 synonym queries fail. These diagnostics will help us understand:
 * - Are single-word synonyms working better than phrases?
 * - Does synonym position matter (start/middle/end)?
 * - Do multi-word curriculum terms need phrase matching boost?
 */
export const SYNONYM_DIAGNOSTIC_QUERIES: readonly GroundTruthQuery[] = [
  // Single-word synonyms (baseline)
  {
    query: 'trig ratios',
    category: 'natural-expression',
    description: 'Single-word synonym: "trig" → "trigonometry". Baseline for synonym expansion.',
    expectedRelevance: {
      'applying-trigonometric-ratios-in-context': 3,
      'problem-solving-with-right-angled-trigonometry': 3,
      'checking-and-securing-understanding-of-tangent-ratio-problems': 2,
    },
  },
  {
    query: 'factorise quadratics',
    category: 'natural-expression',
    description:
      'Single-word synonym: "factorise" → "factorising"/"factoring". Tests UK/US spelling.',
    expectedRelevance: {
      'factorising-a-quadratic-expression': 3,
      'solving-quadratic-equations-by-factorising': 3,
      'factorising-quadratics-of-the-form-ax-2-plus-bx-plus-c': 2,
    },
  },

  // Phrase synonyms at different positions
  {
    query: 'straight line equations',
    category: 'natural-expression',
    description:
      'Phrase synonym at START: "straight line" → "linear". Tests phrase position sensitivity.',
    expectedRelevance: {
      'checking-and-securing-understanding-of-finding-the-equation-of-the-line-from-the-graph': 3,
      'checking-and-securing-understanding-of-finding-the-equation-of-the-line-from-coordinates': 3,
      'parallel-linear-graphs': 2,
    },
  },
  {
    query: 'equations for straight lines',
    category: 'natural-expression',
    description: 'Phrase synonym at END: "straight lines" → "linear". Compare with START position.',
    expectedRelevance: {
      'checking-and-securing-understanding-of-finding-the-equation-of-the-line-from-the-graph': 3,
      'checking-and-securing-understanding-of-finding-the-equation-of-the-line-from-coordinates': 3,
      'parallel-linear-graphs': 2,
    },
  },
  {
    query: 'finding straight line slope',
    category: 'natural-expression',
    description:
      'Phrase synonym in MIDDLE: "straight line" → "linear". Tests multi-word phrase matching.',
    expectedRelevance: {
      'estimating-the-gradient-of-a-curve': 3,
      'checking-and-securing-understanding-of-drawing-linear-graphs': 2,
      'parallel-linear-graphs': 2,
    },
  },

  // Multiple synonyms in one query
  {
    query: 'rules for index laws',
    category: 'natural-expression',
    description: 'Multiple synonyms: "rules"→"laws" AND "index"→"indices". Tests synonym density.',
    expectedRelevance: {
      'the-laws-of-indices-multiplication': 3,
      'the-laws-of-indices-division': 3,
      'problem-solving-with-the-laws-of-indices': 2,
    },
  },
  {
    query: 'transposition of formulas',
    category: 'natural-expression',
    description:
      'Formal synonym: "transposition" → "changing the subject"/"rearrange". Tests technical vocabulary.',
    expectedRelevance: {
      'changing-the-subject-where-the-variable-appears-in-multiple-terms': 3,
      'changing-the-subject-with-multiple-algebraic-fractions': 3,
      'checking-and-securing-understanding-of-changing-the-subject-with-simple-algebraic-fractions': 2,
    },
  },

  // Curriculum-specific multi-word terms (likely need phrase boost)
  {
    query: 'circle rules tangent',
    category: 'natural-expression',
    description:
      'Multi-word curriculum term: "circle rules" → "circle theorems". Tests compound term matching.',
    expectedRelevance: {
      'the-tangent-at-any-point-on-a-circle-is-perpendicular-to-the-radius-at-that-point': 3,
      'the-perpendicular-from-the-centre-of-a-circle-to-a-chord-bisects-the-chord': 3,
      'the-opposite-angles-of-a-cyclic-quadrilateral-sum-to-180': 2,
    },
  },
  {
    query: 'y equals mx plus c',
    category: 'natural-expression',
    description:
      'Spoken formula: "y equals mx plus c" → "gradient intercept"/"linear graphs". Tests formula recognition.',
    expectedRelevance: {
      'checking-and-securing-understanding-of-finding-the-equation-of-the-line-from-the-graph': 3,
      'estimating-the-gradient-of-a-curve': 3,
      'checking-and-securing-understanding-of-drawing-linear-graphs': 2,
    },
  },
] as const;
