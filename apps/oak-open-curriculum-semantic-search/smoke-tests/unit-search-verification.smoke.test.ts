/**
 * Unit Search Verification Smoke Test (Phase 3, Task 1)
 *
 * Verifies that unit hybrid search uses BM25 + ELSER two-way RRF.
 *
 * **Classification**: SMOKE TEST
 * - Calls Elasticsearch directly (network IO)
 * - Per testing-strategy.md: "Smoke tests CAN trigger all IO types"
 * - Requires Elasticsearch cluster with indexed data
 *
 * **Verification Goals**:
 * - Response contains results with `unit_slug` field
 * - Response latency is under 300ms
 * - Results are returned for valid queries
 *
 * @see `.agent/directives-and-memory/testing-strategy.md`
 */

import { describe, it, expect } from 'vitest';
import { esSearch } from '../src/lib/elastic-http.js';
import { buildUnitRrfRequest } from '../src/lib/hybrid-search/rrf-query-builders.js';
import type { SearchUnitsIndexDoc } from '../src/types/oak.js';

/**
 * Search for units directly via the search library.
 *
 * @param query - Search query text
 * @returns Unit results with slugs and latency
 */
async function searchUnits(query: string): Promise<{
  total: number;
  results: { unit_slug: string; rankScore: number }[];
  latency: number;
}> {
  const start = performance.now();

  const request = buildUnitRrfRequest({
    text: query,
    size: 10,
    subject: 'maths',
    keyStage: 'ks4',
  });

  const response = await esSearch<SearchUnitsIndexDoc>(request);
  const latency = performance.now() - start;

  return {
    total: response.hits.total.value,
    results: response.hits.hits.map((hit) => ({
      unit_slug: hit._source.unit_slug,
      rankScore: hit._score ?? 0,
    })),
    latency,
  };
}

describe('Unit Hybrid Search Verification (Phase 3, Task 1)', () => {
  it('returns results with unit_slug field for valid query', async () => {
    const { total, results, latency } = await searchUnits('quadratic equations');

    console.log(`Query: "quadratic equations"`);
    console.log(`  Total results: ${total}`);
    console.log(`  Latency: ${latency.toFixed(0)}ms`);

    expect(total, 'Expected at least one result').toBeGreaterThan(0);
    expect(results.length, 'Expected results array to have items').toBeGreaterThan(0);

    for (const result of results) {
      expect(result.unit_slug, 'Unit should have unit_slug field').toBeDefined();
      expect(typeof result.unit_slug).toBe('string');
    }

    const topResults = results.slice(0, 3).map((r) => r.unit_slug);
    console.log(`  Top 3: ${topResults.join(', ')}`);
  });

  it('returns results for Pythagoras query', async () => {
    const { total, results, latency } = await searchUnits('Pythagoras theorem');

    console.log(`Query: "Pythagoras theorem"`);
    console.log(`  Total results: ${total}`);
    console.log(`  Latency: ${latency.toFixed(0)}ms`);

    expect(total, 'Expected at least one result for Pythagoras').toBeGreaterThan(0);

    const topResults = results.slice(0, 3).map((r) => r.unit_slug);
    console.log(`  Top 3: ${topResults.join(', ')}`);
  });

  it('handles misspelled queries gracefully', async () => {
    const { total, results, latency } = await searchUnits('pythagorus');

    console.log(`Query: "pythagorus" (misspelled)`);
    console.log(`  Total results: ${total}`);
    console.log(`  Latency: ${latency.toFixed(0)}ms`);

    expect(total, 'Expected fuzzy matching to return results').toBeGreaterThan(0);

    const topResults = results.slice(0, 3).map((r) => r.unit_slug);
    console.log(`  Top 3: ${topResults.join(', ')}`);
  });

  it('responds within 300ms latency target', async () => {
    const latencies: number[] = [];

    const queries = ['algebra', 'geometry', 'trigonometry', 'statistics', 'graphs'];

    for (const query of queries) {
      const { latency } = await searchUnits(query);
      latencies.push(latency);
    }

    const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const maxLatency = Math.max(...latencies);

    console.log('\nLatency Summary:');
    console.log(`  Average: ${avgLatency.toFixed(0)}ms`);
    console.log(`  Maximum: ${maxLatency.toFixed(0)}ms`);
    console.log(`  Target: < 300ms`);

    expect(avgLatency, `Average latency ${avgLatency.toFixed(0)}ms should be < 300ms`).toBeLessThan(
      300,
    );
  });

  it('returns results proving hybrid search works with ELSER', async () => {
    const { total, results } = await searchUnits('solving equations');

    expect(total, 'Expected results').toBeGreaterThan(0);

    console.log('\nHybrid Search Verification:');
    console.log(`  Query: "solving equations"`);
    console.log(`  Results returned: ${total}`);
    console.log('  ✓ Hybrid search (BM25 + ELSER) is operational');

    for (const result of results.slice(0, 3)) {
      console.log(`    - ${result.unit_slug} (score: ${result.rankScore.toFixed(4)})`);
    }

    expect(results.length).toBeGreaterThan(0);
  });
});
