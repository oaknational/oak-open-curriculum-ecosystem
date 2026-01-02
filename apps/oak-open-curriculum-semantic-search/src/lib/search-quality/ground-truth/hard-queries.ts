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
 * @see `.agent/research/elasticsearch/methods/evaluation-quality-gates.md`
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
      'checking-and-securing-understanding-of-solving-and-interpreting-linear-equations': 3,
      'solving-simple-linear-inequalities': 3,
      'checking-and-securing-understanding-of-forming-linear-equations': 2,
    },
  },
  {
    query: 'lesson on working out missing angles in shapes',
    category: 'naturalistic',
    priority: 'high',
    description:
      'Descriptive "working out" + "missing angles" → geometry. Tests structure field semantic capture.',
    expectedRelevance: {
      'checking-and-securing-understanding-of-interior-angles': 3,
      'checking-and-securing-understanding-of-exterior-angles': 3,
      'forming-equations-with-angles': 2,
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
      'the-tangent-at-any-point-on-a-circle-is-perpendicular-to-the-radius-at-that-point': 3,
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
      'checking-and-securing-understanding-of-writing-large-numbers-in-standard-form': 2,
    },
  },

  // SYNONYM: Alternative terminology and conceptual equivalence
  {
    query: 'finding the gradient of a straight line',
    category: 'synonym',
    priority: 'high',
    description: '"straight line" = "linear" synonym. Good baseline for synonym handling.',
    expectedRelevance: {
      'estimating-the-gradient-of-a-curve': 3,
      'checking-and-securing-understanding-of-finding-the-equation-of-the-line-from-the-graph': 3,
      'parallel-linear-graphs': 2,
    },
  },
  {
    query: 'rules for powers and indices',
    category: 'synonym',
    priority: 'high',
    description: '"rules" = "laws", "powers/indices" = exponents. Tests synonym filter + ELSER.',
    expectedRelevance: {
      'the-laws-of-indices-multiplication': 3,
      'the-laws-of-indices-division': 3,
      'problem-solving-with-the-laws-of-indices': 2,
    },
  },
  {
    query: 'how to rearrange formulas',
    category: 'synonym',
    priority: 'high',
    description:
      '"rearrange formulas" = "changing the subject". No lexical overlap - pure ELSER test.',
    expectedRelevance: {
      'changing-the-subject-where-the-variable-appears-in-multiple-terms': 3,
      'changing-the-subject-with-multiple-algebraic-fractions': 3,
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
      'solving-simultaneous-linear-equations-graphically': 3,
      'solving-a-quadratic-and-linear-pair-of-simultaneous-equations-graphically': 3,
      'problem-solving-with-linear-and-quadratic-simultaneous-equations': 2,
    },
  },
  {
    query: 'probability with tree diagrams and fractions',
    category: 'multi-concept',
    priority: 'medium',
    description: 'Three concepts must all match. Tests min_should_match precision.',
    expectedRelevance: {
      'conditional-probability-in-a-tree-diagram': 3,
      'algebra-in-tree-and-venn-diagrams': 3,
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
      'checking-and-securing-understanding-of-tangent-ratio-problems': 2,
    },
  },
  {
    query: 'the bit where you complete the square',
    category: 'colloquial',
    priority: 'medium',
    description: '"the bit where" noise + actual term. Tests min_should_match noise filtering.',
    expectedRelevance: {
      'solving-quadratic-equations-by-completing-the-square': 3,
      'solving-complex-quadratic-equations-by-completing-the-square': 3,
      'factorising-using-the-difference-of-two-squares': 2,
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
      'column-vectors': 3,
      'algebraic-vector-notation': 3,
      'addition-with-vectors': 2,
    },
  },
] as const;
