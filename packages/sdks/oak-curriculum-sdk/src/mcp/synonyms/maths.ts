/**
 * Mathematics concept synonyms.
 *
 * Maps canonical maths concepts to alternative terms.
 */

export const mathsSynonyms = {
  addition: ['add', 'plus', 'sum'],
  subtraction: ['subtract', 'minus', 'take away'],
  multiplication: ['multiply', 'times', 'product'],
  division: ['divide', 'quotient'],
  fractions: ['fraction', 'rational number', 'rational numbers'],
  algebra: ['equation', 'equations', 'expression', 'expressions', 'variable', 'variables'],
  geometry: ['geometric', 'angle', 'angles', 'polygon', 'polygons'],
  statistics: ['data handling', 'data analysis'],
} as const;

export type MathsSynonyms = typeof mathsSynonyms;
