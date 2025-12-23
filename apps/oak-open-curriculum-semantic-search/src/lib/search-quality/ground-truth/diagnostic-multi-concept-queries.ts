/**
 * Multi-concept diagnostic queries for understanding topic intersection handling.
 *
 * These queries test:
 * - Whether both concepts are matched (AND semantics)
 * - Concept + Method combinations
 * - Concept density scoring
 *
 * @see `.agent/plans/semantic-search/part-1-search-excellence.md`
 */

import type { GroundTruthQuery } from './types';

/**
 * Multi-concept diagnostic queries - testing topic intersection handling.
 *
 * Multi-concept queries are scoring poorly (MRR 0.083). These diagnostics will help us understand:
 * - Are both concepts being matched?
 * - Is BM25 scoring favoring single-concept matches?
 * - Does min_should_match help or hurt?
 * - Do we need concept-aware scoring?
 */
export const MULTI_CONCEPT_DIAGNOSTIC_QUERIES: readonly GroundTruthQuery[] = [
  // Simple 2-concept AND queries (baseline)
  {
    query: 'algebra and graphs',
    category: 'multi-concept',
    priority: 'high',
    description: 'Explicit AND: "algebra and graphs". Tests if both concepts must match.',
    expectedRelevance: {
      'solving-simultaneous-linear-equations-graphically': 3,
      'solving-a-quadratic-and-linear-pair-of-simultaneous-equations-graphically': 3,
      'problem-solving-with-linear-and-quadratic-simultaneous-equations': 2,
    },
  },
  {
    query: 'quadratics with graphs',
    category: 'multi-concept',
    priority: 'high',
    description: 'Implicit intersection: "quadratics with graphs". Tests natural language AND.',
    expectedRelevance: {
      'solving-a-quadratic-and-linear-pair-of-simultaneous-equations-graphically': 3,
      'key-features-of-a-quadratic-graph': 3,
      'solving-quadratic-equations-by-factorising': 2,
    },
  },

  // Concept + Method combinations
  {
    query: 'equations using substitution',
    category: 'multi-concept',
    priority: 'high',
    description: 'Concept + Method: "equations" + "substitution". Tests method recognition.',
    expectedRelevance: {
      'solving-simultaneous-linear-equations-by-substitution': 3,
      'solving-a-quadratic-and-linear-pair-of-simultaneous-equations-using-substitution': 3,
      'solving-algebraic-simultaneous-equations-by-elimination': 2,
    },
  },
  {
    query: 'quadratics by completing square',
    category: 'multi-concept',
    priority: 'high',
    description:
      'Concept + Method: "quadratics" + "completing square". Tests method-specific matching.',
    expectedRelevance: {
      'solving-quadratic-equations-by-completing-the-square': 3,
      'solving-complex-quadratic-equations-by-completing-the-square': 3,
      'factorising-using-the-difference-of-two-squares': 2,
    },
  },

  // Three-concept queries (hardest case)
  {
    query: 'probability and fractions with diagrams',
    category: 'multi-concept',
    priority: 'high',
    description:
      'Three concepts: "probability" + "fractions" + "diagrams". Tests concept density scoring.',
    expectedRelevance: {
      'conditional-probability-in-a-tree-diagram': 3,
      'checking-and-securing-calculating-probabilities-from-diagrams': 3,
      'problem-solving-with-conditional-probability': 2,
    },
  },
  {
    query: 'angles triangles and pythagoras',
    category: 'multi-concept',
    priority: 'high',
    description:
      'Three geometry concepts: "angles" + "triangles" + "pythagoras". Tests geometric intersection.',
    expectedRelevance: {
      'applying-pythagoras-theorem-in-3d': 3,
      'checking-and-further-securing-understanding-of-pythagoras-theorem': 3,
      'using-pythagoras-theorem-to-justify-a-right-angled-triangle': 2,
    },
  },

  // Concept density variation
  {
    query: 'graphs',
    category: 'multi-concept',
    priority: 'high',
    description:
      'Single concept baseline for comparison. Should rank differently than multi-concept.',
    expectedRelevance: {
      'checking-and-securing-understanding-of-drawing-linear-graphs': 3,
      'key-features-of-a-quadratic-graph': 2,
      'key-features-of-a-cubic-graph': 2,
    },
  },
  {
    query: 'linear graphs algebra substitution',
    category: 'multi-concept',
    priority: 'high',
    description:
      'Four concepts: "linear" + "graphs" + "algebra" + "substitution". Extreme density test.',
    expectedRelevance: {
      'solving-simultaneous-linear-equations-by-substitution': 3,
      'solving-simultaneous-linear-equations-graphically': 3,
      'checking-and-securing-understanding-of-drawing-linear-graphs': 2,
    },
  },

  // Topic intersection with semantic gap
  {
    query: 'geometry and algebra together',
    category: 'multi-concept',
    priority: 'medium',
    description:
      'Abstract intersection: "geometry and algebra together". Tests semantic bridging for topic overlap.',
    expectedRelevance: {
      'solving-simultaneous-linear-equations-graphically': 3,
      'geometric-proofs-with-vectors': 2,
      'transforming-graphs-y-equals-f-x-plus-a': 2,
    },
  },
] as const;
