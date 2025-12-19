/**
 * Hard ground truth queries for lesson search.
 *
 * Tests the search system with challenging scenarios: naturalistic phrasing,
 * misspellings, synonyms, multi-concept queries, colloquial language, and
 * intent-based queries.
 *
 * ## Priority Weighting
 * - **critical**: Misspellings - core UX, mobile users make typos
 * - **high**: Naturalistic/synonyms - common teacher search patterns
 * - **medium**: Multi-concept/colloquial - ELSER strengths
 * - **exploratory**: Intent-based - may need NL→DSL pipeline
 *
 * @see `.agent/research/search-query-optimization-research.md` Appendix H
 */

import type { GroundTruthQuery } from './types';

export const HARD_QUERIES: readonly GroundTruthQuery[] = [
  // NATURALISTIC: Teacher/student language vs formal curriculum terminology
  {
    query: 'teach my students about solving for x',
    category: 'naturalistic',
    priority: 'high',
    description:
      'Pedagogical intent + informal "solving for x" → linear equations. Tests ELSER vocabulary bridging.',
    expectedRelevance: {
      'solving-simple-linear-equations': 3,
      'checking-and-securing-understanding-of-solving-and-interpreting-linear-equations': 3,
      'solving-equations-involving-functions': 2,
    },
  },
  {
    query: 'lesson on working out missing angles in shapes',
    category: 'naturalistic',
    priority: 'high',
    description:
      'Descriptive "working out" + "missing angles" → geometry. Tests structure field semantic capture.',
    expectedRelevance: {
      'angles-in-polygons-investigating-exterior-angles': 3,
      'angles-in-polygons-investigating-interior-angles': 3,
      'problem-solving-with-angles': 2,
    },
  },
  {
    query: 'what to teach before quadratic formula',
    category: 'naturalistic',
    priority: 'high',
    description: 'Curriculum sequencing intent. Tests semantic understanding of prerequisites.',
    expectedRelevance: {
      'solving-quadratic-equations-by-factorising': 3,
      'factorising-a-quadratic-expression': 3,
      'checking-and-securing-understanding-of-drawing-quadratic-graphs': 2,
    },
  },

  // MISSPELLING: Tolerance for spelling errors (critical for mobile UX)
  {
    query: 'simulatneous equasions substitution method',
    category: 'misspelling',
    priority: 'critical',
    description:
      'Two misspellings in 4 words - common mobile typing. Tests fuzzy + ELSER recovery.',
    expectedRelevance: {
      'solving-simultaneous-linear-equations-by-substitution': 3,
      'forming-simultaneous-equations': 2,
    },
  },
  {
    query: 'circel theorms tangent',
    category: 'misspelling',
    priority: 'critical',
    description:
      'Severe misspellings (edit distance >2). Tests limits of fuzzy; phonetic would catch.',
    expectedRelevance: {
      'the-angle-between-a-tangent-and-a-radius-is-90-degrees': 3,
      'the-tangents-from-an-external-point-are-equal-in-length': 3,
      'problem-solving-with-circle-theorems': 2,
    },
  },
  {
    query: 'standerd form multiplying dividing',
    category: 'misspelling',
    priority: 'critical',
    description:
      'Single char typo (edit distance 1). Baseline fuzzy test - failure = fundamental issue.',
    expectedRelevance: {
      'multiplying-numbers-in-standard-form': 3,
      'dividing-numbers-in-standard-form': 3,
      'checking-and-securing-understanding-of-standard-form': 2,
    },
  },

  // SYNONYM: Alternative terminology and conceptual equivalence
  {
    query: 'finding the gradient of a straight line',
    category: 'synonym',
    priority: 'high',
    description: '"straight line" = "linear" synonym. Good baseline for synonym handling.',
    expectedRelevance: {
      'finding-the-gradient-of-a-line': 3,
      'equation-of-a-line-given-a-point-and-the-gradient': 3,
      'checking-and-securing-understanding-of-graphs': 2,
    },
  },
  {
    query: 'rules for powers and indices',
    category: 'synonym',
    priority: 'high',
    description: '"rules" = "laws", "powers/indices" = exponents. Tests synonym filter + ELSER.',
    expectedRelevance: {
      'checking-and-securing-understanding-of-index-laws-with-numerical-bases': 3,
      'checking-and-securing-understanding-of-index-laws-with-algebraic-bases': 3,
      'combining-index-laws': 2,
    },
  },
  {
    query: 'how to rearrange formulas',
    category: 'synonym',
    priority: 'high',
    description:
      '"rearrange formulas" = "changing the subject". No lexical overlap - pure ELSER test.',
    expectedRelevance: {
      'changing-the-subject-of-a-formula-to-an-embedded-subject': 3,
      'changing-the-subject-of-a-formula-to-a-subject-that-appears-twice': 3,
      'checking-and-securing-understanding-of-changing-the-subject-with-simple-algebraic-fractions': 2,
    },
  },

  // MULTI-CONCEPT: Topic intersections and combinations
  {
    query: 'combining algebra with graphs',
    category: 'multi-concept',
    priority: 'medium',
    description: 'Cross-topic intersection query. Tests if hybrid finds algebra+graphing overlap.',
    expectedRelevance: {
      'solving-simultaneous-equations-graphically': 3,
      'checking-and-securing-understanding-of-solving-linear-equations-graphically': 3,
      'finding-solutions-to-quadratic-equations-graphically': 2,
    },
  },
  {
    query: 'probability with tree diagrams and fractions',
    category: 'multi-concept',
    priority: 'medium',
    description: 'Three concepts must all match. Tests min_should_match precision.',
    expectedRelevance: {
      'constructing-tree-diagrams-for-combined-probabilities': 3,
      'using-probability-trees-to-calculate-probability': 3,
      'problem-solving-with-conditional-probability': 2,
    },
  },

  // COLLOQUIAL: Informal language to formal curriculum mapping
  {
    query: 'that sohcahtoa stuff for triangles',
    category: 'colloquial',
    priority: 'medium',
    description: 'Very informal "that...stuff" + SOHCAHTOA acronym. LLM expansion would help.',
    expectedRelevance: {
      'applying-trigonometric-ratios-in-context': 3,
      'problem-solving-with-right-angled-trigonometry': 3,
      'introducing-tangent-of-an-angle': 2,
    },
  },
  {
    query: 'the bit where you complete the square',
    category: 'colloquial',
    priority: 'medium',
    description: '"the bit where" noise + actual term. Tests min_should_match noise filtering.',
    expectedRelevance: {
      'completing-the-square': 3,
      'solving-quadratic-equations-by-completing-the-square': 3,
      'solving-complex-quadratic-equations-by-completing-the-square': 2,
    },
  },

  // INTENT-BASED: Pedagogical purpose without topic names
  {
    query: 'challenging extension work for able mathematicians',
    category: 'intent-based',
    priority: 'exploratory',
    description: 'Pure intent, NO topic. May need NL→DSL to extract difficulty filter.',
    expectedRelevance: {
      'problem-solving-with-functions-and-proof': 3,
      'problem-solving-with-iteration': 3,
      'problem-solving-with-circle-theorems': 2,
    },
  },
  {
    query: 'visual introduction to vectors for beginners',
    category: 'intent-based',
    priority: 'exploratory',
    description:
      'Topic present but qualifiers ("visual", "beginners") are semantic. Tests structure field.',
    expectedRelevance: {
      'introduction-to-vectors': 3,
      'checking-and-securing-understanding-of-vectors': 3,
      'adding-and-subtracting-vectors': 2,
    },
  },
] as const;
