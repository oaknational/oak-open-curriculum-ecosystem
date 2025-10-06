export const structuredSearchFixture = {
  scope: 'lessons',
  results: [
    {
      id: 'lesson-1',
      rankScore: 1,
      lesson: {
        lesson_title: 'Decimals introduction',
        subject_slug: 'maths',
        key_stage: 'ks2',
      },
      highlights: ['Develop an understanding of decimal place value.'],
    },
    {
      id: 'lesson-2',
      rankScore: 2,
      lesson: {
        lesson_title: 'Fractions recap',
        subject_slug: 'maths',
        key_stage: 'ks2',
      },
      highlights: ['Revisit fraction equivalence with visual models.'],
    },
    {
      id: 'lesson-3',
      rankScore: 3,
      lesson: {
        lesson_title: 'Percentages and decimals',
        subject_slug: 'maths',
        key_stage: 'ks3',
      },
      highlights: ['Connect percentage calculations to decimal notation.'],
    },
  ],
  total: 3,
  took: 12,
  timedOut: false,
  aggregations: {},
  facets: null,
  suggestions: [],
} as const;

export const suggestionFixture = {
  suggestions: [],
  cache: { version: 'test', ttlSeconds: 60 },
} as const;

export const emptySearchFixture = {
  scope: 'lessons',
  results: [],
  total: 0,
  took: 3,
  timedOut: false,
  aggregations: {},
  facets: null,
  suggestions: [],
} as const;
