/**
 * Integration tests for the fetch tool's flat Zod schema.
 *
 * Mirrors the sibling test for `aggregated-search/flat-zod-schema.integration.test.ts`,
 * proving that `.meta({ examples })` round-trips through Zod 4's
 * `z.toJSONSchema()` for the aggregated `fetch` tool's single `id` parameter.
 *
 * This integration-level proof replaces the equivalent assertion previously
 * made at the E2E layer in the now-deleted
 * `tool-examples-metadata.e2e.test.ts` (under
 * `apps/oak-curriculum-mcp-streamable-http/e2e-tests/`), per the testing
 * strategy: keep E2E assertions on system/transport invariants and prove
 * schema-shape semantics in SDK integration tests.
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { FETCH_INPUT_SCHEMA } from './flat-zod-schema.js';

describe('fetch inputSchema round-trip', () => {
  it('exports a defined inputSchema', () => {
    expect(FETCH_INPUT_SCHEMA).toBeDefined();
  });

  it('z.toJSONSchema() produces examples on the id field', () => {
    const jsonSchema = z.toJSONSchema(z.object(FETCH_INPUT_SCHEMA));

    expect(jsonSchema).toHaveProperty('properties.id.examples', [
      'lesson:adding-fractions-with-the-same-denominator',
      'unit:comparing-fractions',
      'subject:maths',
      'sequence:maths-primary',
      'thread:number-multiplication-and-division',
    ]);
  });

  it('z.toJSONSchema() produces a description on the id field', () => {
    const jsonSchema = z.toJSONSchema(z.object(FETCH_INPUT_SCHEMA));

    expect(jsonSchema).toHaveProperty('properties.id.description');
  });
});
