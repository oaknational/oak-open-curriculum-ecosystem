/**
 * Ingestion Validation Smoke Tests
 *
 * Verifies data quality of ingested documents:
 * - Unit lesson_count matches actual lesson documents in ES
 * - Unit thread_slugs is populated for units with threads
 * - Rollup lesson_count matches unit lesson_count
 *
 * **Classification**: SMOKE TEST
 * - Queries Elasticsearch directly (network IO)
 * - Per testing-strategy.md: "Smoke tests CAN trigger all IO types"
 * - Requires ES_NODE env var pointing to Elasticsearch instance
 * - Requires data to be ingested (run `pnpm es:ingest` or `pnpm es:ingest -- --api --subject maths --key-stage ks4`)
 *
 * **Acceptance Criteria**:
 * - All units have correct lesson_count
 * - Units with threads have thread_slugs populated
 * - Rollup lesson_count matches unit lesson_count for all units
 *
 * @see `.agent/evaluations/baselines/curriculum-fetching-discrepancy-log.md`
 */

import { describe, it, expect } from 'vitest';
import { Client } from '@elastic/elasticsearch';
import { loadRuntimeConfig } from '../src/runtime-config.js';

const configResult = loadRuntimeConfig({
  processEnv: process.env,
  startDir: import.meta.dirname,
});
if (!configResult.ok) {
  throw new Error(`Environment validation failed: ${configResult.error.message}`);
}
const config = configResult.value.env;

// Initialize ES client
const client = new Client({
  node: config.ELASTICSEARCH_URL,
  auth: { apiKey: config.ELASTICSEARCH_API_KEY },
});

interface UnitDoc {
  unit_id: string;
  unit_title: string;
  lesson_count: number;
  lesson_ids: string[];
  thread_slugs?: string[];
  thread_titles?: string[];
  thread_orders?: number[];
}

interface RollupDoc {
  unit_id: string;
  lesson_count: number;
  lesson_ids: string[];
}

interface LessonDoc {
  lesson_id: string;
  unit_ids: string[];
}

function hasItems<T>(values: readonly T[] | undefined): boolean {
  return (values?.length ?? 0) > 0;
}

function hasThreadMetadata(unit: UnitDoc): boolean {
  return hasItems(unit.thread_titles) || hasItems(unit.thread_orders);
}

function isMissingThreadSlugs(unit: UnitDoc): boolean {
  return hasThreadMetadata(unit) && !hasItems(unit.thread_slugs);
}

/**
 * Fetch all units for maths KS4 from ES.
 */
async function fetchAllUnits(): Promise<UnitDoc[]> {
  const response = await client.search<UnitDoc>({
    index: 'oak_units',
    query: {
      bool: {
        must: [{ term: { subject_slug: 'maths' } }, { term: { key_stage: 'ks4' } }],
      },
    },
    size: 100,
    _source: [
      'unit_id',
      'unit_title',
      'lesson_count',
      'lesson_ids',
      'thread_slugs',
      'thread_titles',
      'thread_orders',
    ],
  });

  return response.hits.hits.flatMap((hit) => {
    const source: UnitDoc | undefined = hit._source;
    return source ? [source] : [];
  });
}

/**
 * Fetch all rollups for maths KS4 from ES.
 */
async function fetchAllRollups(): Promise<RollupDoc[]> {
  const response = await client.search<RollupDoc>({
    index: 'oak_unit_rollup',
    query: {
      bool: {
        must: [{ term: { subject_slug: 'maths' } }, { term: { key_stage: 'ks4' } }],
      },
    },
    size: 100,
    _source: ['unit_id', 'lesson_count', 'lesson_ids'],
  });

  return response.hits.hits.flatMap((hit) => {
    const source: RollupDoc | undefined = hit._source;
    return source ? [source] : [];
  });
}

/**
 * Fetch all lessons for maths KS4 from ES.
 */
async function fetchAllLessons(): Promise<LessonDoc[]> {
  const response = await client.search<LessonDoc>({
    index: 'oak_lessons',
    query: {
      bool: {
        must: [{ term: { subject_slug: 'maths' } }, { term: { key_stage: 'ks4' } }],
      },
    },
    size: 500,
    _source: ['lesson_id', 'unit_ids'],
  });

  return response.hits.hits.flatMap((hit) => {
    const source: LessonDoc | undefined = hit._source;
    return source ? [source] : [];
  });
}

describe('Ingestion Data Quality', () => {
  it('all units have correct lesson_count matching actual lessons in index', async () => {
    const units = await fetchAllUnits();
    const lessons = await fetchAllLessons();

    // Build actual lesson counts per unit
    const actualLessonCounts = new Map<string, number>();
    for (const lesson of lessons) {
      for (const unitId of lesson.unit_ids) {
        actualLessonCounts.set(unitId, (actualLessonCounts.get(unitId) ?? 0) + 1);
      }
    }

    const discrepancies: { unitId: string; claimed: number; actual: number }[] = [];

    for (const unit of units) {
      const actual = actualLessonCounts.get(unit.unit_id) ?? 0;
      if (unit.lesson_count !== actual) {
        discrepancies.push({
          unitId: unit.unit_id,
          claimed: unit.lesson_count,
          actual,
        });
      }
    }

    if (discrepancies.length > 0) {
      console.error('Lesson count discrepancies found:', discrepancies);
    }

    expect(discrepancies).toHaveLength(0);
  });

  it('units with threads have thread_slugs populated', async () => {
    const units = await fetchAllUnits();
    const missingThreadSlugs = units.filter(isMissingThreadSlugs).map((unit) => unit.unit_id);

    if (missingThreadSlugs.length > 0) {
      console.error('Units missing thread_slugs:', missingThreadSlugs);
    }

    expect(missingThreadSlugs).toHaveLength(0);
  });

  it('rollup lesson_count matches unit lesson_count for all units', async () => {
    const units = await fetchAllUnits();
    const rollups = await fetchAllRollups();

    const unitCountsBySlug = new Map(units.map((u) => [u.unit_id, u.lesson_count]));
    const mismatches: { unitId: string; unitCount: number; rollupCount: number }[] = [];

    for (const rollup of rollups) {
      const unitCount = unitCountsBySlug.get(rollup.unit_id);
      if (unitCount === undefined) {
        console.warn(`Rollup exists for unit ${rollup.unit_id} but unit not found`);
        continue;
      }

      if (rollup.lesson_count !== unitCount) {
        mismatches.push({
          unitId: rollup.unit_id,
          unitCount,
          rollupCount: rollup.lesson_count,
        });
      }
    }

    if (mismatches.length > 0) {
      console.error('Rollup/unit lesson_count mismatches:', mismatches);
    }

    expect(mismatches).toHaveLength(0);
  });

  it('lesson_ids array length matches lesson_count for units', async () => {
    const units = await fetchAllUnits();

    const mismatches: { unitId: string; count: number; idsLength: number }[] = [];

    for (const unit of units) {
      if (unit.lesson_count !== unit.lesson_ids.length) {
        mismatches.push({
          unitId: unit.unit_id,
          count: unit.lesson_count,
          idsLength: unit.lesson_ids.length,
        });
      }
    }

    if (mismatches.length > 0) {
      console.error('Unit lesson_count/lesson_ids.length mismatches:', mismatches);
    }

    expect(mismatches).toHaveLength(0);
  });

  it('lesson_ids array length matches lesson_count for rollups', async () => {
    const rollups = await fetchAllRollups();

    const mismatches: { unitId: string; count: number; idsLength: number }[] = [];

    for (const rollup of rollups) {
      if (rollup.lesson_count !== rollup.lesson_ids.length) {
        mismatches.push({
          unitId: rollup.unit_id,
          count: rollup.lesson_count,
          idsLength: rollup.lesson_ids.length,
        });
      }
    }

    if (mismatches.length > 0) {
      console.error('Rollup lesson_count/lesson_ids.length mismatches:', mismatches);
    }

    expect(mismatches).toHaveLength(0);
  });
});
