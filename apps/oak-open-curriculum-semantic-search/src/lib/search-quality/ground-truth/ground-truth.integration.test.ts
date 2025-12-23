/**
 * Ground Truth Validation Tests
 *
 * These tests ensure that all lesson and unit slugs in the ground truth data
 * actually exist in the Oak Curriculum API.
 *
 * Purpose: Prevent invalid ground truth from being introduced,
 * which would cause false negatives in search quality metrics.
 *
 * @see `.agent/evaluations/EXPERIMENT-LOG.md` for context on why this test exists
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { GROUND_TRUTH_QUERIES, HARD_GROUND_TRUTH_QUERIES, DIAGNOSTIC_QUERIES } from './index';
import { UNIT_GROUND_TRUTH_QUERIES, UNIT_HARD_GROUND_TRUTH_QUERIES } from './units/index';
import {
  SEQUENCE_GROUND_TRUTH_QUERIES,
  SEQUENCE_HARD_GROUND_TRUTH_QUERIES,
} from './sequences/index';
import type { GroundTruthQuery } from './types';
import type { UnitGroundTruthQuery } from './units/types';
import type { SequenceGroundTruthQuery } from './sequences/types';

/* eslint-disable no-restricted-properties -- test file uses Object methods directly */

// Collect all unique slugs from lesson ground truth sources
function collectAllLessonSlugs(queries: readonly GroundTruthQuery[]): Map<string, string[]> {
  const slugToQueries = new Map<string, string[]>();

  for (const query of queries) {
    const slugs = Object.keys(query.expectedRelevance);
    for (const slug of slugs) {
      const existing = slugToQueries.get(slug) ?? [];
      existing.push(query.query);
      slugToQueries.set(slug, existing);
    }
  }

  return slugToQueries;
}

// Collect all unique slugs from unit ground truth sources
function collectAllUnitSlugs(queries: readonly UnitGroundTruthQuery[]): Map<string, string[]> {
  const slugToQueries = new Map<string, string[]>();

  for (const query of queries) {
    const slugs = Object.keys(query.expectedRelevance);
    for (const slug of slugs) {
      const existing = slugToQueries.get(slug) ?? [];
      existing.push(query.query);
      slugToQueries.set(slug, existing);
    }
  }

  return slugToQueries;
}

// Collect all unique slugs from sequence ground truth sources
function collectAllSequenceSlugs(
  queries: readonly SequenceGroundTruthQuery[],
): Map<string, string[]> {
  const slugToQueries = new Map<string, string[]>();

  for (const query of queries) {
    const slugs = Object.keys(query.expectedRelevance);
    for (const slug of slugs) {
      const existing = slugToQueries.get(slug) ?? [];
      existing.push(query.query);
      slugToQueries.set(slug, existing);
    }
  }

  return slugToQueries;
}

// Cache for API responses to avoid redundant calls
const lessonSlugExistsCache = new Map<string, boolean>();
const unitSlugExistsCache = new Map<string, boolean>();

// Lazily loaded available unit slugs from API
let availableUnitSlugs: Set<string> | null = null;

async function checkLessonSlugExists(slug: string): Promise<boolean> {
  const cached = lessonSlugExistsCache.get(slug);
  if (cached !== undefined) {
    return cached;
  }

  const apiKey = process.env['OAK_API_KEY'];
  if (!apiKey) {
    throw new Error('OAK_API_KEY environment variable is required for ground truth validation');
  }

  try {
    const response = await fetch(
      `https://open-api.thenational.academy/api/v0/lessons/${slug}/summary`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    const exists = response.status === 200;
    lessonSlugExistsCache.set(slug, exists);
    return exists;
  } catch {
    lessonSlugExistsCache.set(slug, false);
    return false;
  }
}

interface UnitData {
  unitSlug: string;
}

interface YearEntry {
  year: number;
  units?: UnitData[];
  tiers?: { units: UnitData[] }[];
}

/** Extracts unit slugs from a year entry (handles both direct units and tiered units). */
function extractSlugsFromYearEntry(entry: YearEntry): string[] {
  const slugs: string[] = [];

  if (entry.units) {
    slugs.push(...entry.units.map((u) => u.unitSlug));
  }

  if (entry.tiers) {
    for (const tier of entry.tiers) {
      slugs.push(...tier.units.map((u) => u.unitSlug));
    }
  }

  return slugs;
}

/** Fetch all available unit slugs from the maths-secondary sequence. */
async function loadAvailableUnitSlugs(): Promise<Set<string>> {
  if (availableUnitSlugs) {
    return availableUnitSlugs;
  }

  const apiKey = process.env['OAK_API_KEY'];
  if (!apiKey) {
    throw new Error('OAK_API_KEY environment variable is required for ground truth validation');
  }

  const response = await fetch(
    'https://open-api.thenational.academy/api/v0/sequences/maths-secondary/units',
    { headers: { Authorization: `Bearer ${apiKey}` } },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch units: ${response.status}`);
  }

  const data = (await response.json()) as YearEntry[];
  const slugs = new Set(data.flatMap(extractSlugsFromYearEntry));

  availableUnitSlugs = slugs;
  return slugs;
}

async function checkUnitSlugExists(slug: string): Promise<boolean> {
  const cached = unitSlugExistsCache.get(slug);
  if (cached !== undefined) {
    return cached;
  }

  const available = await loadAvailableUnitSlugs();
  const exists = available.has(slug);
  unitSlugExistsCache.set(slug, exists);
  return exists;
}

// ============ SEQUENCE VALIDATION ============

interface SequenceEntry {
  sequenceSlug: string;
}

const sequenceSlugExistsCache = new Map<string, boolean>();
let availableSequenceSlugs: Set<string> | null = null;

/** Fetch all available sequence slugs from all subjects. */
async function loadAvailableSequenceSlugs(): Promise<Set<string>> {
  if (availableSequenceSlugs) {
    return availableSequenceSlugs;
  }

  const apiKey = process.env['OAK_API_KEY'];
  if (!apiKey) {
    throw new Error('OAK_API_KEY environment variable is required for ground truth validation');
  }

  // First get all subjects
  const subjectsRes = await fetch('https://open-api.thenational.academy/api/v0/subjects', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!subjectsRes.ok) {
    throw new Error(`Failed to fetch subjects: ${subjectsRes.status}`);
  }

  interface SubjectEntry {
    subjectSlug: string;
  }
  const subjects = (await subjectsRes.json()) as SubjectEntry[];

  // Then get sequences for each subject
  const slugs = new Set<string>();

  for (const subject of subjects) {
    const seqRes = await fetch(
      `https://open-api.thenational.academy/api/v0/subjects/${subject.subjectSlug}/sequences`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );

    if (seqRes.ok) {
      const sequences = (await seqRes.json()) as SequenceEntry[];
      for (const seq of sequences) {
        slugs.add(seq.sequenceSlug);
      }
    }
  }

  availableSequenceSlugs = slugs;
  return slugs;
}

async function checkSequenceSlugExists(slug: string): Promise<boolean> {
  const cached = sequenceSlugExistsCache.get(slug);
  if (cached !== undefined) {
    return cached;
  }

  const available = await loadAvailableSequenceSlugs();
  const exists = available.has(slug);
  sequenceSlugExistsCache.set(slug, exists);
  return exists;
}

describe('Ground Truth Data Validation', () => {
  // Skip in CI without API key - this is an integration test
  const hasApiKey = Boolean(process.env['OAK_API_KEY']);

  beforeAll(() => {
    if (!hasApiKey) {
      console.warn(
        'Skipping ground truth validation - OAK_API_KEY not set. ' +
          'Run with OAK_API_KEY=... to validate against live API.',
      );
    }
  });

  describe('Standard Ground Truth Queries (Lessons)', () => {
    const slugs = collectAllLessonSlugs(GROUND_TRUTH_QUERIES);

    it.skipIf(!hasApiKey).for([...slugs.entries()])(
      'lesson slug "%s" exists in curriculum (used by: %s)',
      { timeout: 10000 },
      async ([slug]) => {
        const exists = await checkLessonSlugExists(slug);
        expect(exists, `Lesson slug "${slug}" does not exist in the Oak Curriculum API`).toBe(true);
      },
    );
  });

  describe('Hard Ground Truth Queries (Lessons)', () => {
    const slugs = collectAllLessonSlugs(HARD_GROUND_TRUTH_QUERIES);

    it.skipIf(!hasApiKey).for([...slugs.entries()])(
      'lesson slug "%s" exists in curriculum (used by: %s)',
      { timeout: 10000 },
      async ([slug]) => {
        const exists = await checkLessonSlugExists(slug);
        expect(exists, `Lesson slug "${slug}" does not exist in the Oak Curriculum API`).toBe(true);
      },
    );
  });

  describe('Diagnostic Queries (Lessons)', () => {
    const slugs = collectAllLessonSlugs(DIAGNOSTIC_QUERIES);

    it.skipIf(!hasApiKey).for([...slugs.entries()])(
      'lesson slug "%s" exists in curriculum (used by: %s)',
      { timeout: 10000 },
      async ([slug]) => {
        const exists = await checkLessonSlugExists(slug);
        expect(exists, `Lesson slug "${slug}" does not exist in the Oak Curriculum API`).toBe(true);
      },
    );
  });

  describe('Standard Ground Truth Queries (Units)', () => {
    const slugs = collectAllUnitSlugs(UNIT_GROUND_TRUTH_QUERIES);

    it.skipIf(!hasApiKey).for([...slugs.entries()])(
      'unit slug "%s" exists in curriculum (used by: %s)',
      { timeout: 10000 },
      async ([slug]) => {
        const exists = await checkUnitSlugExists(slug);
        expect(exists, `Unit slug "${slug}" does not exist in the Oak Curriculum API`).toBe(true);
      },
    );
  });

  describe('Hard Ground Truth Queries (Units)', () => {
    const slugs = collectAllUnitSlugs(UNIT_HARD_GROUND_TRUTH_QUERIES);

    it.skipIf(!hasApiKey).for([...slugs.entries()])(
      'unit slug "%s" exists in curriculum (used by: %s)',
      { timeout: 10000 },
      async ([slug]) => {
        const exists = await checkUnitSlugExists(slug);
        expect(exists, `Unit slug "${slug}" does not exist in the Oak Curriculum API`).toBe(true);
      },
    );
  });

  describe('Standard Ground Truth Queries (Sequences)', () => {
    const slugs = collectAllSequenceSlugs(SEQUENCE_GROUND_TRUTH_QUERIES);

    it.skipIf(!hasApiKey).for([...slugs.entries()])(
      'sequence slug "%s" exists in curriculum (used by: %s)',
      { timeout: 30000 },
      async ([slug]) => {
        const exists = await checkSequenceSlugExists(slug);
        expect(exists, `Sequence slug "${slug}" does not exist in the Oak Curriculum API`).toBe(
          true,
        );
      },
    );
  });

  describe('Hard Ground Truth Queries (Sequences)', () => {
    const slugs = collectAllSequenceSlugs(SEQUENCE_HARD_GROUND_TRUTH_QUERIES);

    it.skipIf(!hasApiKey).for([...slugs.entries()])(
      'sequence slug "%s" exists in curriculum (used by: %s)',
      { timeout: 30000 },
      async ([slug]) => {
        const exists = await checkSequenceSlugExists(slug);
        expect(exists, `Sequence slug "${slug}" does not exist in the Oak Curriculum API`).toBe(
          true,
        );
      },
    );
  });

  describe('Ground Truth Structure (Lessons)', () => {
    const allLessonQueries = [
      ...GROUND_TRUTH_QUERIES,
      ...HARD_GROUND_TRUTH_QUERIES,
      ...DIAGNOSTIC_QUERIES,
    ];

    it('all lesson queries have at least one expected relevant lesson', () => {
      for (const query of allLessonQueries) {
        const slugCount = Object.keys(query.expectedRelevance).length;
        expect(
          slugCount,
          `Query "${query.query}" has no expected relevant lessons`,
        ).toBeGreaterThan(0);
      }
    });

    it('all lesson relevance scores are valid (1, 2, or 3)', () => {
      for (const query of allLessonQueries) {
        const entries = Object.entries(query.expectedRelevance);
        for (const [slug, relevance] of entries) {
          expect(
            [1, 2, 3].includes(relevance),
            `Query "${query.query}" has invalid relevance ${String(relevance)} for slug "${slug}"`,
          ).toBe(true);
        }
      }
    });

    it('no duplicate slugs within a single lesson query', () => {
      for (const query of allLessonQueries) {
        const slugsList = Object.keys(query.expectedRelevance);
        const uniqueSlugs = new Set(slugsList);
        expect(slugsList.length, `Query "${query.query}" has duplicate slugs`).toBe(
          uniqueSlugs.size,
        );
      }
    });

    it('all lesson slugs follow expected format (lowercase, hyphenated)', () => {
      for (const query of allLessonQueries) {
        const slugsList = Object.keys(query.expectedRelevance);
        for (const slug of slugsList) {
          expect(
            /^[a-z0-9-]+$/.test(slug),
            `Query "${query.query}" has invalid slug format: "${slug}"`,
          ).toBe(true);
        }
      }
    });
  });

  describe('Ground Truth Structure (Units)', () => {
    const allUnitQueries = [...UNIT_GROUND_TRUTH_QUERIES, ...UNIT_HARD_GROUND_TRUTH_QUERIES];

    it('all unit queries have at least one expected relevant unit', () => {
      for (const query of allUnitQueries) {
        const slugCount = Object.keys(query.expectedRelevance).length;
        expect(slugCount, `Query "${query.query}" has no expected relevant units`).toBeGreaterThan(
          0,
        );
      }
    });

    it('all unit relevance scores are valid (1, 2, or 3)', () => {
      for (const query of allUnitQueries) {
        const entries = Object.entries(query.expectedRelevance);
        for (const [slug, relevance] of entries) {
          expect(
            [1, 2, 3].includes(relevance),
            `Query "${query.query}" has invalid relevance ${String(relevance)} for slug "${slug}"`,
          ).toBe(true);
        }
      }
    });

    it('no duplicate slugs within a single unit query', () => {
      for (const query of allUnitQueries) {
        const slugsList = Object.keys(query.expectedRelevance);
        const uniqueSlugs = new Set(slugsList);
        expect(slugsList.length, `Query "${query.query}" has duplicate slugs`).toBe(
          uniqueSlugs.size,
        );
      }
    });

    it('all unit slugs follow expected format (lowercase, hyphenated)', () => {
      for (const query of allUnitQueries) {
        const slugsList = Object.keys(query.expectedRelevance);
        for (const slug of slugsList) {
          expect(
            /^[a-z0-9-]+$/.test(slug),
            `Query "${query.query}" has invalid slug format: "${slug}"`,
          ).toBe(true);
        }
      }
    });
  });

  describe('Ground Truth Structure (Sequences)', () => {
    const allSequenceQueries = [
      ...SEQUENCE_GROUND_TRUTH_QUERIES,
      ...SEQUENCE_HARD_GROUND_TRUTH_QUERIES,
    ];

    it('all sequence queries have at least one expected relevant sequence', () => {
      for (const query of allSequenceQueries) {
        const slugCount = Object.keys(query.expectedRelevance).length;
        expect(
          slugCount,
          `Query "${query.query}" has no expected relevant sequences`,
        ).toBeGreaterThan(0);
      }
    });

    it('all sequence relevance scores are valid (1, 2, or 3)', () => {
      for (const query of allSequenceQueries) {
        const entries = Object.entries(query.expectedRelevance);
        for (const [slug, relevance] of entries) {
          expect(
            [1, 2, 3].includes(relevance),
            `Query "${query.query}" has invalid relevance ${String(relevance)} for slug "${slug}"`,
          ).toBe(true);
        }
      }
    });

    it('no duplicate slugs within a single sequence query', () => {
      for (const query of allSequenceQueries) {
        const slugsList = Object.keys(query.expectedRelevance);
        const uniqueSlugs = new Set(slugsList);
        expect(slugsList.length, `Query "${query.query}" has duplicate slugs`).toBe(
          uniqueSlugs.size,
        );
      }
    });

    it('all sequence slugs follow expected format (lowercase, hyphenated)', () => {
      for (const query of allSequenceQueries) {
        const slugsList = Object.keys(query.expectedRelevance);
        for (const slug of slugsList) {
          expect(
            /^[a-z0-9-]+$/.test(slug),
            `Query "${query.query}" has invalid slug format: "${slug}"`,
          ).toBe(true);
        }
      }
    });
  });
});
