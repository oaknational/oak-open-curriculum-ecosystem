/**
 * Number and mathematical operation synonyms.
 *
 * Maps number words, digits, and mathematical terms to alternatives.
 * Critical for semantic search matching (e.g., "x squared" → "quadratic").
 */

export const numberSynonyms = {
  one: ['1'],
  two: ['2'],
  three: ['3'],
  four: ['4'],
  five: ['5'],
  six: ['6'],
  seven: ['7'],
  eight: ['8'],
  nine: ['9'],
  ten: ['10'],
  eleven: ['11'],
  twelve: ['12'],
  thirteen: ['13'],
  fourteen: ['14'],
  fifteen: ['15'],
  sixteen: ['16'],
  seventeen: ['17'],
  eighteen: ['18'],
  nineteen: ['19'],
  twenty: ['20'],
  twentyOne: ['21'],
  twentyTwo: ['22'],
  twentyThree: ['23'],
  twentyFour: ['24'],
  twentyFive: ['25'],
  thirty: ['30'],
  forty: ['40'],
  fifty: ['50'],
  sixty: ['60'],
  seventy: ['70'],
  eighty: ['80'],
  ninety: ['90'],
  hundred: ['100'],
  thousand: ['1000', '1,000', '1, 000', '1K'],
  million: ['1000000', '1,000,000', '1, 000, 000', '1M'],
  billion: ['1000000000', '1,000,000,000', '1, 000, 000, 000', '1B'],
  minus: ['-'],
  'minus one': ['-1'],
  squared: [
    'square number',
    'square root',
    'quadratic',
    'quadratic equation',
    'quadrature',
    'power of two',
    'raised to the power of two',
    'second power',
  ],
  cubed: [
    'cube number',
    'cube root',
    'cubic',
    'cubic equation',
    'cubed',
    'power of three',
    'raised to the power of three',
    'third power',
  ],
} as const;

export type NumberSynonyms = typeof numberSynonyms;
