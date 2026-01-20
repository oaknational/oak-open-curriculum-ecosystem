/* eslint-disable max-lines -- static maths synonym data file, structure requires length */
/**
 * Mathematics concept synonyms.
 *
 * Maps canonical maths concepts to alternative terms used by teachers and students.
 *
 * **Vocabulary Sources**:
 * - B-001 baseline failure analysis (vocabulary gaps)
 * - Oak curriculum bulk download (unit/lesson titles)
 * - OWA oakCurriculumData.ts (existing aliases)
 * - Teacher/student colloquial language patterns
 *
 * **F-001 Experiment**: Comprehensive synonym coverage to address hard query failures.
 *
 * @remarks
 * Entries marked [MINED-2025-12-26] were extracted from curriculum definitions
 * by an LLM-powered agent. Regex-based mining was insufficient — language
 * understanding was required to distinguish true synonyms from examples.
 *
 * @see `.agent/evaluations/experiments/B-001-hard-query-baseline.experiment.md`
 * @see `.agent/evaluations/experiments/EXPERIMENT-PRIORITIES.md`
 */

export const mathsSynonyms = {
  // ============================================================================
  // BASIC OPERATIONS
  // ============================================================================

  /**
   * Addition and related terms.
   *
   * @remarks
   * "total" was removed during audit (2025-12-27) — too broad,
   * appears in many contexts (total marks, total cost) and could
   * cause precision issues via ES expansion.
   */
  addition: ['add', 'plus', 'sum', 'adding'],

  /** Subtraction and related terms */
  subtraction: ['subtract', 'minus', 'take away', 'difference', 'subtracting'],

  /** Multiplication and related terms */
  multiplication: ['multiply', 'times', 'product', 'multiplying'],

  /**
   * Times tables — multiplication facts.
   * Common misspellings/compounds: "timetables", "timestables", "time tables".
   * Curriculum consistently uses "times table" (two words).
   *
   * Added 2026-01-20 after Phase 1C revealed tokenization mismatch:
   * "timetables" (one word) vs "times table" (two words) caused zero results.
   */
  'times-table': [
    'times tables',
    'timetable',
    'timetables',
    'timestables',
    'timestable',
    'time tables',
    'time table',
  ],

  /** Division and related terms */
  division: ['divide', 'quotient', 'dividing', 'shared equally'],

  // ============================================================================
  // ALGEBRA - LINEAR EQUATIONS
  // B-001 failure: "solving for x" not finding linear equations
  // ============================================================================

  /** Linear equations - includes colloquial "solving for x" */
  'linear-equations': [
    'solving for x',
    'solve for x',
    'find x',
    'find the unknown',
    'finding the unknown',
    'solving linear equations',
    'linear equation',
  ],

  /** Solving equations vocabulary */
  'solving-equations': [
    'solve equations',
    'solving equations',
    'work out the value',
    'calculate the unknown',
  ],

  // ============================================================================
  // ALGEBRA - CHANGING THE SUBJECT
  // B-001 failure: "rearrange formulas" not finding changing the subject
  // ============================================================================

  /** Changing the subject of a formula */
  'changing-the-subject': [
    'rearrange',
    'rearranging',
    'rearrange formulas',
    'rearranging formulas',
    'rearrange formula',
    'rearranging equations',
    'make x the subject',
    'making x the subject',
    'transposition',
    'transpose',
    'isolate the variable',
  ],

  // ============================================================================
  // ALGEBRA - QUADRATICS
  // B-001 failure: "completing the square" not finding correct lessons
  // ============================================================================

  /** Completing the square */
  'completing-the-square': [
    'complete the square',
    'completing the square',
    'completing square',
    'quadratic completion',
  ],

  /** Factorising (US: factoring) */
  factorising: ['factoring', 'factorise', 'factorize', 'factor', 'factorisation', 'factorization'],

  /** Quadratic equations and graphs */
  'quadratic-equations': ['quadratics', 'quadratic', 'quadratic formula', 'solving quadratics'],

  /** Simultaneous equations */
  'simultaneous-equations': [
    'simultaneous',
    'solving two equations',
    'systems of equations',
    'system of equations',
    'two unknowns',
  ],

  // ============================================================================
  // GRAPHS - LINEAR
  // B-001 failure: "straight line graphs" not finding linear graph lessons
  // ============================================================================

  /** Linear graphs - includes "straight line" colloquialism */
  'linear-graphs': [
    'straight line',
    'straight line graph',
    'straight line graphs',
    'straight lines',
    'y equals mx plus c',
    'y = mx + c',
    'y=mx+c',
    'gradient intercept',
  ],

  /** Gradient of a line */
  gradient: ['slope', 'steepness', 'gradient of a line', 'rate of change'],

  // ============================================================================
  // TRIGONOMETRY
  // B-001 failure: "sohcahtoa" returning histograms instead of trig
  // ============================================================================

  /** Trigonometry and trigonometric ratios */
  trigonometry: [
    'trig',
    'trigonometric',
    'trigonometric ratios',
    'sohcahtoa',
    'soh cah toa',
    'sin cos tan',
    'sine cosine tangent',
    'opposite adjacent hypotenuse',
    'right angled trigonometry',
    'right-angled trigonometry',
    'acute angle',
    'obtuse angle',
    'right angle',
  ],

  /** Sine function */
  sine: ['sin', 'opposite over hypotenuse'],

  /** Cosine function */
  cosine: ['cos', 'adjacent over hypotenuse'],

  /** Tangent function */
  tangent: ['tan', 'opposite over adjacent'],

  /** Pythagoras theorem */
  pythagoras: [
    'pythagorean',
    'pythagorean theorem',
    "pythagoras' theorem",
    'pythagoras theorem',
    'pythagorean triple',
    'right angled triangle',
    'opposite side',
    'adjacent side',
    'hypotenuse',
    'a squared plus b squared',
  ],

  // ============================================================================
  // NUMBER - INDEX LAWS
  // B-001 partial success: "rules for powers" working but could be improved
  // ============================================================================

  /** Index laws (laws of indices) */
  'index-laws': [
    'laws of indices',
    'rules for powers',
    'power rules',
    'exponent rules',
    'laws of exponents',
    'index rules',
    'indices',
  ],

  /** Standard form / scientific notation */
  'standard-form': ['scientific notation', 'powers of ten', 'powers of 10'],

  /** Surds */
  surds: ['irrational numbers', 'square roots', 'radical', 'radicals'],

  // ============================================================================
  // GEOMETRY - CIRCLE THEOREMS
  // B-001 partial success: "circle rules" finding some results
  // ============================================================================

  /** Circle theorems */
  'circle-theorems': [
    'circle rules',
    'circle theorem',
    'cyclic quadrilateral',
    'tangent to circle',
    'chord',
    'arc',
    'sector',
    'segment',
  ],

  /** Angles in geometry */
  angles: [
    'angle',
    'degrees',
    'missing angles',
    'unknown angles',
    'interior angles',
    'exterior angles',
  ],

  /** Polygons */
  polygons: ['polygon', 'shapes', 'regular shapes', 'irregular shapes'],

  // ============================================================================
  // GEOMETRY - TRANSFORMATIONS
  // ============================================================================

  /** Transformations */
  transformations: [
    'transformation',
    'reflect',
    'reflection',
    'rotate',
    'rotation',
    'translate',
    'translation',
    'enlarge',
    'enlargement',
  ],

  /** Vectors */
  vectors: ['vector', 'magnitude', 'direction', 'displacement'],

  // ============================================================================
  // STATISTICS AND PROBABILITY
  // ============================================================================

  /** Statistics and data handling */
  statistics: ['data handling', 'data analysis', 'averages', 'mean median mode', 'range'],

  /** Probability */
  probability: ['chance', 'likelihood', 'probability trees', 'tree diagrams', 'expected outcomes'],

  // ============================================================================
  // FRACTIONS, DECIMALS, PERCENTAGES
  // ============================================================================

  /** Fractions */
  fractions: ['fraction', 'rational number', 'rational numbers', 'numerator', 'denominator'],

  /** Percentages */
  percentages: ['percentage', 'percent', '%', 'per cent'],

  /** Ratio and proportion */
  ratio: ['ratios', 'proportion', 'proportional', 'direct proportion', 'inverse proportion'],

  // ============================================================================
  // SEQUENCES
  // ============================================================================

  /** Sequences */
  sequences: [
    'sequence',
    'nth term',
    'term to term',
    'arithmetic sequence',
    'geometric sequence',
    'pattern',
    'patterns',
  ],

  // ============================================================================
  // GENERAL ALGEBRA
  // ============================================================================

  /** General algebra terms */
  algebra: [
    'algebraic',
    'equation',
    'equations',
    'expression',
    'expressions',
    'variable',
    'variables',
    'unknown',
    'unknowns',
  ],

  /** Inequalities */
  inequalities: ['inequality', 'greater than', 'less than', 'at least', 'at most'],

  /** Functions */
  functions: ['function', 'input output', 'mapping', 'composite function', 'inverse function'],

  // ============================================================================
  // GENERAL GEOMETRY
  // ============================================================================

  /** General geometry terms */
  geometry: ['geometric', 'shape', 'shapes', 'area', 'perimeter', 'volume', 'surface area'],

  /** Congruence and similarity */
  congruence: ['congruent', 'similar', 'similarity', 'same shape', 'same size'],

  // [MINED-2025-12-26] Extracted by LLM agent from bulk curriculum definitions
  /** Quartiles - statistical measures */
  'lower-quartile': ['first quartile', 'q1', '25th percentile'],
  'upper-quartile': ['third quartile', 'q3', '75th percentile'],

  // ============================================================================
  // FOUNDATIONAL KS1/KS2 TERMS (Added 2025-12-27)
  // Value-scored from vocabulary analysis; validated against definitions
  // ============================================================================

  /**
   * Partition — "to divide into parts".
   * Value score: 207
   */
  partition: ['break apart', 'split up'],

  /**
   * Multiple — "the result of multiplying a number by another whole number".
   * Value score: 154
   */
  multiple: ['times table number'],

  /**
   * Equation — "shows that one number or calculation is equal to another".
   * Value score: 118. KS1/KS2 teachers use "number sentence".
   */
  equation: ['number sentence'],

  /**
   * Denominator — "the bottom number in a fraction".
   * Value score: 55
   */
  denominator: ['bottom number'],

  /**
   * Numerator — "the top number in a fraction".
   * Value score: 44
   */
  numerator: ['top number'],

  /**
   * Estimate — "find a value that is close enough".
   * Value score: 109. "guess" is ES-expanded (single word), "rough answer" is phrase-boosted.
   */
  estimate: ['guess', 'rough answer'],
} as const;

export type MathsSynonyms = typeof mathsSynonyms;
