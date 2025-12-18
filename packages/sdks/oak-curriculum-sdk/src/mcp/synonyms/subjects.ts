/**
 * Subject name synonyms.
 *
 * Maps canonical subject slugs to alternative terms users might use.
 *
 * Sources:
 * - OWA: reference/Oak-Web-Application/src/context/Search/suggestions/oakCurriculumData.ts
 * - OALA: reference/oak-ai-lesson-assistant/packages/core/src/utils/subjects/index.ts
 */

export const subjectSynonyms = {
  // Art & Design
  art: ['arts', 'fine art', 'visual art', 'visual arts', 'art and design', 'art & design'],

  // Sciences - with common abbreviations from OWA
  biology: ['bio', 'life science', 'life sciences', 'biology science'],
  chemistry: ['chem', 'chemical science', 'chemical sciences', 'chemistry science'],
  physics: ['phys', 'physical science', 'physical sciences', 'physics science'],
  science: ['sci', 'general science', 'sciences', 'stem'],
  'combined-science': [
    'combined sciences',
    'double award science',
    'trilogy science',
    'double science',
  ],

  // Citizenship
  citizenship: ['civics', 'citizenship education'],

  // Computing - with OWA aliases
  computing: ['computer science', 'cs', 'ict', 'information technology', 'computers'],

  // Cooking & Nutrition - with OWA aliases
  'cooking-nutrition': [
    'cooking',
    'food and nutrition',
    'food technology',
    'food tech',
    'food & nutrition',
  ],

  // Design & Technology
  'design-technology': [
    'design and technology',
    'design technology',
    'dt',
    'd&t',
    'design & technology',
  ],

  // English - with OWA aliases for reading/writing
  english: [
    'ela',
    'english language',
    'english literature',
    'language arts',
    'literacy',
    'english language arts',
    'reading',
    'writing',
  ],

  // Financial Education (NEW from OWA)
  'financial-education': [
    'financial literacy',
    'money management',
    'finance education',
    'personal finance',
    'money',
  ],

  // Languages
  french: ['french language', 'mfl french', 'modern foreign languages french'],
  german: ['german language', 'mfl german', 'modern foreign languages german'],
  spanish: ['spanish language', 'mfl spanish', 'modern foreign languages spanish'],

  // Geography - with common abbreviation
  geography: ['geo', 'geog'],

  // History - with common abbreviation
  history: ['hist', 'historical studies'],

  // Maths
  maths: ['math', 'mathematics', 'math.', 'numeracy'],

  // Music
  music: ['music education'],

  // Physical Education - with OWA aliases
  'physical-education': [
    'physical education',
    'pe',
    'p.e.',
    'sport',
    'sports',
    'phys ed',
    'physical wellbeing',
  ],

  // Religious Education - with OWA aliases
  'religious-education': ['religious studies', 'religion', 're', 'r.e.', 'rs'],

  // RSHE/PSHE - with OWA aliases
  'rshe-pshe': [
    'rshe',
    'pshe',
    'rshe education',
    'pshe education',
    'relationships and sex education',
    'personal social health and economic education',
    'personal development',
    'sex education',
    'relationships sex health education',
    'personal social health education',
  ],
} as const;

export type SubjectSynonyms = typeof subjectSynonyms;
