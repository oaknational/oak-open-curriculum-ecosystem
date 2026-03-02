/**
 * ES Hybrid Search Experiment for MCP Comparison.
 *
 * This experiment runs ES hybrid search queries that can be compared
 * against MCP tool results (run separately via MCP tool access).
 *
 * ES Search:
 * - Lesson hybrid search: BM25 (multi_match) + ELSER (semantic on full transcript)
 * - Unit hybrid search: BM25 + ELSER (semantic on rollup text)
 *
 */

import { config as dotenvConfig } from 'dotenv';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Load app-specific env vars for ES connection
const appDir = dirname(fileURLToPath(import.meta.url));
dotenvConfig({ path: join(appDir, '..', '.env.local') });

import { describe, it, expect } from 'vitest';
import { esSearch } from '../../../src/lib/elastic-http.js';
import {
  buildLessonRrfRequest,
  buildUnitRrfRequest,
} from '../../../src/lib/hybrid-search/rrf-query-builders.js';
import type { SearchLessonsIndexDoc, SearchUnitRollupDoc } from '../../../src/types/oak.js';

/** Test queries for comparison. */
const COMPARISON_QUERIES = [
  'quadratic equations',
  'solving equations',
  'fractions',
  'angles in triangles',
  'ratio problems',
  'Pythagoras theorem',
  'simultaneous equations',
  'expanding brackets',
  'factorising',
  'probability',
] as const;

// ============================================================================
// Types
// ============================================================================

interface LessonResult {
  slug: string;
  title: string;
  rank: number;
}

interface UnitResult {
  slug: string;
  title: string;
  lessonCount: number;
  rank: number;
}

// ============================================================================
// ES Search Functions
// ============================================================================

async function searchLessonsHybrid(query: string): Promise<LessonResult[]> {
  const request = buildLessonRrfRequest({
    text: query,
    size: 10,
    subject: 'maths',
    keyStage: 'ks4',
  });

  const response = await esSearch<SearchLessonsIndexDoc>(request);
  return response.hits.hits.map((hit, idx) => ({
    slug: hit._source.lesson_slug,
    title: hit._source.lesson_title,
    rank: idx + 1,
  }));
}

async function searchUnitsHybrid(query: string): Promise<UnitResult[]> {
  const request = buildUnitRrfRequest({
    text: query,
    size: 10,
    subject: 'maths',
    keyStage: 'ks4',
  });

  const response = await esSearch<SearchUnitRollupDoc>(request);
  return response.hits.hits.map((hit, idx) => ({
    slug: hit._source.unit_slug,
    title: hit._source.unit_title,
    lessonCount: hit._source.lesson_count,
    rank: idx + 1,
  }));
}

// ============================================================================
// Main Experiment
// ============================================================================

describe('ES Hybrid Search Results (for MCP comparison)', () => {
  it('runs lesson search queries', async () => {
    console.log('\n' + '='.repeat(80));
    console.log('ES HYBRID SEARCH RESULTS (BM25 + ELSER)');
    console.log('='.repeat(80));
    console.log('\nFiltered to: subject=maths, keyStage=ks4');
    console.log(`Running ${COMPARISON_QUERIES.length} queries...\n`);

    for (const query of COMPARISON_QUERIES) {
      console.log(`\n${'─'.repeat(60)}`);
      console.log(`Query: "${query}"`);
      console.log(`${'─'.repeat(60)}`);

      const lessons = await searchLessonsHybrid(query);
      console.log('\n📊 ES HYBRID LESSONS (BM25 + ELSER on transcript):');
      lessons.slice(0, 5).forEach((r, i) => {
        console.log(`  ${i + 1}. ${r.title}`);
        console.log(`     slug: ${r.slug}`);
      });

      expect(lessons.length).toBeGreaterThan(0);
    }

    console.log('\n' + '='.repeat(80));
    console.log('Lesson search complete');
    console.log('='.repeat(80) + '\n');
  }, 120000);

  it('runs unit search queries', async () => {
    console.log('\n' + '='.repeat(80));
    console.log('ES HYBRID UNIT SEARCH (BM25 + ELSER)');
    console.log('='.repeat(80));
    console.log(
      '\nNote: MCP has no query-based unit search (get-key-stages-subject-units is browse only)',
    );
    console.log('Filtered to: subject=maths, keyStage=ks4\n');

    for (const query of COMPARISON_QUERIES.slice(0, 5)) {
      console.log(`Query: "${query}"`);
      const units = await searchUnitsHybrid(query);
      units.slice(0, 3).forEach((u, i) => {
        console.log(`  ${i + 1}. ${u.title} (${u.lessonCount} lessons)`);
      });
      console.log();
      expect(units.length).toBeGreaterThan(0);
    }

    console.log('Unit search complete\n');
  }, 60000);
});
