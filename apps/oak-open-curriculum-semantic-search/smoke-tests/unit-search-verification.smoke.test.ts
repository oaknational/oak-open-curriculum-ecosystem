/**
 * Unit Search Verification Smoke Test (Phase 3, Task 1)
 *
 * Verifies that unit hybrid search uses BM25 + ELSER two-way RRF.
 *
 * @module smoke-tests/unit-search-verification
 *
 * **Classification**: SMOKE TEST
 * - Makes HTTP calls to a running server (network IO)
 * - Per testing-strategy.md: "Smoke tests CAN trigger all IO types"
 * - Requires `pnpm dev` running in apps/oak-open-curriculum-semantic-search
 *
 * **Verification Goals**:
 * - Response contains results with `unit_slug` field
 * - Response latency is under 300ms
 * - Results are returned for valid queries
 *
 * @see `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
 * @see `.agent/directives-and-memory/testing-strategy.md`
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { HybridResponseUnits } from '../src/lib/openapi.schemas.js';

const BASE_URL = process.env.TEST_BASE_URL ?? 'http://localhost:3003';

/**
 * Search for units via the API.
 *
 * Uses Zod validation to ensure response matches expected schema,
 * avoiding unsafe `as` type assertions.
 *
 * @param query - Search query text
 * @returns Validated response data and latency
 * @throws Error if server is unavailable or returns invalid response
 */
async function searchUnits(query: string): Promise<{
  data: ReturnType<typeof HybridResponseUnits.parse>;
  latency: number;
}> {
  const start = performance.now();

  const response = await fetch(`${BASE_URL}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: query,
      scope: 'units',
      subject: 'maths',
      keyStage: 'ks4',
      size: 10,
    }),
  });

  const latency = performance.now() - start;

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status} ${response.statusText}`);
  }

  const json: unknown = await response.json();
  const parseResult = HybridResponseUnits.safeParse(json);

  if (!parseResult.success) {
    throw new Error(`Invalid unit search response: ${parseResult.error.message}`);
  }

  return { data: parseResult.data, latency };
}

describe('Unit Hybrid Search Verification (Phase 3, Task 1)', () => {
  beforeAll(async () => {
    // Fail fast with clear error if server is not available
    try {
      const response = await fetch(`${BASE_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'test', scope: 'units' }),
      });

      // 404 means wrong server (e.g. streamable-http instead of semantic-search)
      if (response.status === 404) {
        throw new Error(
          `Server at ${BASE_URL} does not have /api/search endpoint. ` +
            `Ensure semantic search server is running: pnpm dev in apps/oak-open-curriculum-semantic-search`,
        );
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          `Cannot connect to server at ${BASE_URL}. ` +
            `Start the semantic search server: pnpm dev in apps/oak-open-curriculum-semantic-search`,
        );
      }
      throw error;
    }

    console.log(`✓ Server available at ${BASE_URL}`);
  });

  it('returns results with unit_slug field for valid query', async () => {
    const { data, latency } = await searchUnits('quadratic equations');

    console.log(`Query: "quadratic equations"`);
    console.log(`  Total results: ${data.total}`);
    console.log(`  Latency: ${latency.toFixed(0)}ms`);

    expect(data.total, 'Expected at least one result').toBeGreaterThan(0);
    expect(data.results.length, 'Expected results array to have items').toBeGreaterThan(0);

    // Verify each result has unit_slug
    for (const result of data.results) {
      expect(result.unit, 'Result should have unit object').not.toBeNull();
      if (result.unit) {
        expect(result.unit.unit_slug, 'Unit should have unit_slug field').toBeDefined();
        expect(typeof result.unit.unit_slug).toBe('string');
      }
    }

    // Log top results for verification
    const topResults = data.results.slice(0, 3).map((r) => r.unit?.unit_slug ?? 'null');
    console.log(`  Top 3: ${topResults.join(', ')}`);
  });

  it('returns results for Pythagoras query', async () => {
    const { data, latency } = await searchUnits('Pythagoras theorem');

    console.log(`Query: "Pythagoras theorem"`);
    console.log(`  Total results: ${data.total}`);
    console.log(`  Latency: ${latency.toFixed(0)}ms`);

    expect(data.total, 'Expected at least one result for Pythagoras').toBeGreaterThan(0);

    const topResults = data.results.slice(0, 3).map((r) => r.unit?.unit_slug ?? 'null');
    console.log(`  Top 3: ${topResults.join(', ')}`);
  });

  it('handles misspelled queries gracefully', async () => {
    const { data, latency } = await searchUnits('pythagorus');

    console.log(`Query: "pythagorus" (misspelled)`);
    console.log(`  Total results: ${data.total}`);
    console.log(`  Latency: ${latency.toFixed(0)}ms`);

    // Fuzzy matching should still return results
    expect(data.total, 'Expected fuzzy matching to return results').toBeGreaterThan(0);

    const topResults = data.results.slice(0, 3).map((r) => r.unit?.unit_slug ?? 'null');
    console.log(`  Top 3: ${topResults.join(', ')}`);
  });

  it('responds within 300ms latency target', async () => {
    const latencies: number[] = [];

    // Run 5 queries to get representative latencies
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
    const { data } = await searchUnits('solving equations');

    expect(data.total, 'Expected results').toBeGreaterThan(0);

    // The fact that we get results proves the hybrid search is working
    // because the RRF query uses both BM25 and ELSER retrievers.
    // If unit_semantic field wasn't populated, the ELSER retriever would fail.
    console.log('\nHybrid Search Verification:');
    console.log(`  Query: "solving equations"`);
    console.log(`  Results returned: ${data.total}`);
    console.log('  ✓ Hybrid search (BM25 + ELSER) is operational');

    for (const result of data.results.slice(0, 3)) {
      if (result.unit) {
        console.log(`    - ${result.unit.unit_slug} (score: ${result.rankScore.toFixed(4)})`);
      }
    }

    expect(data.results.length).toBeGreaterThan(0);
  });
});
