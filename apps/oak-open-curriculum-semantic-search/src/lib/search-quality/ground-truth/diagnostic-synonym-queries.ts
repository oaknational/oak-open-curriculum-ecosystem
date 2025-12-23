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
    category: 'synonym',
    priority: 'high',
    description: 'Single-word synonym: "trig" → "trigonometry". Baseline for synonym expansion.',
    expectedRelevance: {
      'applying-trigonometric-ratios-in-context': 3,
      'problem-solving-with-right-angled-trigonometry': 3,
      'introducing-tangent-of-an-angle': 2,
    },
  },
  {
    query: 'factorise quadratics',
    category: 'synonym',
    priority: 'high',
    description:
      'Single-word synonym: "factorise" → "factorising"/"factoring". Tests UK/US spelling.',
    expectedRelevance: {
      'factorising-quadratic-expressions': 3,
      'solving-quadratic-equations-by-factorising': 3,
      'factorising-quadratic-expressions-in-the-form-ax-squared-plus-bx-plus-c': 2,
    },
  },

  // Phrase synonyms at different positions
  {
    query: 'straight line equations',
    category: 'synonym',
    priority: 'high',
    description:
      'Phrase synonym at START: "straight line" → "linear". Tests phrase position sensitivity.',
    expectedRelevance: {
      'finding-the-gradient-of-a-line': 3,
      'equation-of-a-line-given-a-point-and-the-gradient': 3,
      'equation-of-a-line-given-two-points': 2,
    },
  },
  {
    query: 'equations for straight lines',
    category: 'synonym',
    priority: 'high',
    description: 'Phrase synonym at END: "straight lines" → "linear". Compare with START position.',
    expectedRelevance: {
      'finding-the-gradient-of-a-line': 3,
      'equation-of-a-line-given-a-point-and-the-gradient': 3,
      'equation-of-a-line-given-two-points': 2,
    },
  },
  {
    query: 'finding straight line slope',
    category: 'synonym',
    priority: 'high',
    description:
      'Phrase synonym in MIDDLE: "straight line" → "linear". Tests multi-word phrase matching.',
    expectedRelevance: {
      'finding-the-gradient-of-a-line': 3,
      'checking-and-securing-understanding-of-graphs': 2,
      'equation-of-a-line-given-a-point-and-the-gradient': 2,
    },
  },

  // Multiple synonyms in one query
  {
    query: 'rules for index laws',
    category: 'synonym',
    priority: 'high',
    description: 'Multiple synonyms: "rules"→"laws" AND "index"→"indices". Tests synonym density.',
    expectedRelevance: {
      'checking-and-securing-understanding-of-index-laws-with-numerical-bases': 3,
      'checking-and-securing-understanding-of-index-laws-with-algebraic-bases': 3,
      'combining-index-laws': 2,
    },
  },
  {
    query: 'transposition of formulas',
    category: 'synonym',
    priority: 'high',
    description:
      'Formal synonym: "transposition" → "changing the subject"/"rearrange". Tests technical vocabulary.',
    expectedRelevance: {
      'changing-the-subject-of-a-formula-to-an-embedded-subject': 3,
      'changing-the-subject-of-a-formula-to-a-subject-that-appears-twice': 3,
      'checking-and-securing-understanding-of-changing-the-subject-with-simple-algebraic-fractions': 2,
    },
  },

  // Curriculum-specific multi-word terms (likely need phrase boost)
  {
    query: 'circle rules tangent',
    category: 'synonym',
    priority: 'high',
    description:
      'Multi-word curriculum term: "circle rules" → "circle theorems". Tests compound term matching.',
    expectedRelevance: {
      'the-angle-between-a-tangent-and-a-radius-is-90-degrees': 3,
      'the-perpendicular-from-the-centre-of-a-circle-to-a-chord-bisects-the-chord': 3,
      'opposite-angles-in-a-cyclic-quadrilateral-add-to-180-degrees': 2,
    },
  },
  {
    query: 'y equals mx plus c',
    category: 'synonym',
    priority: 'high',
    description:
      'Spoken formula: "y equals mx plus c" → "gradient intercept"/"linear graphs". Tests formula recognition.',
    expectedRelevance: {
      'equation-of-a-line-given-a-point-and-the-gradient': 3,
      'finding-the-gradient-of-a-line': 3,
      'checking-and-securing-understanding-of-drawing-linear-graphs': 2,
    },
  },
] as const;
