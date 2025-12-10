/**
 * English language concept synonyms.
 *
 * Maps canonical English concepts to alternative terms.
 *
 * @module synonyms/english
 */

export const englishSynonyms = {
  grammar: ['syntax'],
  punctuation: ['commas', 'apostrophes', 'full stops', 'periods'],
  spelling: ['spellings'],
  poetry: ['poem', 'poems'],
  'figurative-language': ['metaphor', 'simile', 'personification', 'literary devices'],
  shakespeare: ['william shakespeare'],
} as const;

export type EnglishSynonyms = typeof englishSynonyms;
