/**
 * Subject name synonyms.
 *
 * Maps canonical subject slugs to alternative terms users might use.
 *
 * @module synonyms/subjects
 */

export const subjectSynonyms = {
  art: ['arts', 'fine art', 'visual art', 'visual arts'],
  biology: ['life science', 'life sciences'],
  chemistry: ['chemical science', 'chemical sciences'],
  citizenship: ['civics', 'citizenship education'],
  computing: ['computer science', 'cs', 'ict', 'information technology'],
  'cooking-nutrition': ['cooking', 'food and nutrition', 'food technology', 'food tech'],
  'design-technology': ['design and technology', 'design technology', 'dt', 'd&t'],
  english: ['ela', 'english language', 'english literature', 'language arts', 'literacy'],
  french: ['french language'],
  geography: ['geo'],
  german: ['german language'],
  history: ['historical studies'],
  maths: ['math', 'mathematics', 'math.'],
  music: ['music education'],
  physics: ['physical science', 'physical sciences'],
  'physical-education': ['physical education', 'pe', 'p.e.', 'sport', 'sports'],
  'religious-education': ['religious studies', 'religion', 're', 'r.e.'],
  'rshe-pshe': [
    'rshe',
    'pshe',
    'rshe education',
    'pshe education',
    'relationships and sex education',
    'personal social health and economic education',
  ],
  science: ['sci', 'general science', 'sciences'],
  spanish: ['spanish language'],
} as const;

export type SubjectSynonyms = typeof subjectSynonyms;
