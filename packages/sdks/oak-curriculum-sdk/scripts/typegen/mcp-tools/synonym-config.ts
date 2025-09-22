export const SUBJECT_SYNONYM_CONFIG: Record<string, readonly string[]> = {
  art: ['arts', 'fine art', 'visual arts'],
  citizenship: ['civics', 'citizenship education'],
  computing: ['computer science', 'cs', 'ict'],
  'cooking-nutrition': ['cooking', 'food and nutrition', 'food technology', 'food tech'],
  'design-technology': ['design and technology', 'design technology', 'dt', 'd&t'],
  english: ['english language', 'english literature'],
  french: ['french language'],
  geography: ['geo'],
  german: ['german language'],
  history: ['historical studies'],
  maths: ['math', 'mathematics', 'math.'],
  music: ['music education'],
  'physical-education': ['physical education', 'pe', 'p.e.'],
  'religious-education': ['religious studies', 'religion', 're', 'r.e.'],
  'rshe-pshe': [
    'rshe',
    'pshe',
    'rshe education',
    'pshe education',
    'relationships and sex education',
    'personal social health and economic education',
  ],
  science: ['sci', 'general science'],
  spanish: ['spanish language'],
};

export const KEY_STAGE_SYNONYM_CONFIG: Record<string, readonly string[]> = {
  ks1: ['key stage 1', 'key-stage-1', 'primary', 'ks 1', 'key stage one'],
  ks2: ['key stage 2', 'key-stage-2', 'ks 2', 'key stage two', 'ks-2'],
  ks3: ['key stage 3', 'key-stage-3', 'secondary', 'ks 3', 'key stage three'],
  ks4: ['key stage 4', 'key-stage-4', 'gcse', 'ks 4', 'key stage four'],
};
