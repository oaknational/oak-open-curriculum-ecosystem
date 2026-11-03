/**
 * Round-trip integration test: generated Zod schema to z.toJSONSchema() to JSON
 * Schema with examples, verified against the schema cache the generator's
 * pipeline derives from.
 *
 * This catches string-template bugs in codegen (e.g. `.meta(\{ example: [...] \})`
 * instead of `.meta(\{ examples: [...] \})`) that unit string-matching tests cannot
 * detect. It exercises the full Zod 4 globalRegistry path: .meta() to
 * toJSONSchema() to examples in output.
 *
 * Expected values are DERIVED from the schema cache — never pinned: only path
 * and query parameters enter the flat schema (the generator's routing
 * contract), parameter-level `example` wins over schema-level (the documented
 * extraction contract of `extractParamMetadata` in mcp-tool-generator.ts,
 * primitives only), and codegen wraps each value in a single-element
 * `examples` array. The comparison is two-way: every source-declared example
 * arrives, and no field carries examples the source does not declare. Deriving
 * from the source keeps this test red exactly when the generator's
 * example-carrying mechanism breaks — dropped, mangled, fabricated, or
 * cross-wired examples — and green across upstream content edits. Blocking for
 * Phase 1 completion per reviewer finding B7.
 */
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

import { toolMcpFlatInputSchema } from '../../../src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-lessons.js';

import { loadSchemaCachePaths, type SchemaCacheParam } from './test-helpers/schema-cache-reader.js';

const LESSONS_PATH = '/key-stages/{keyStage}/subject/{subject}/lessons';

/** The generator routes only path and query parameters into the flat schema. */
const FLAT_SCHEMA_PARAM_LOCATIONS: ReadonlySet<string> = new Set(['path', 'query']);

function isPrimitive(value: unknown): value is string | number | boolean {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

/**
 * Derive the expected per-field `examples` arrays from the generation source:
 * path/query parameters only, parameter-level `example` over schema-level,
 * primitives only, each wrapped in a single-element array.
 */
function expectedExamples(
  parameters: readonly SchemaCacheParam[],
): Record<string, readonly [string | number | boolean]> {
  const expected: Record<string, readonly [string | number | boolean]> = {};
  for (const param of parameters) {
    if (!FLAT_SCHEMA_PARAM_LOCATIONS.has(param.in ?? '')) {
      continue;
    }
    const paramExample = isPrimitive(param.example) ? param.example : undefined;
    const schemaExample = isPrimitive(param.schema?.example) ? param.schema.example : undefined;
    const example = paramExample ?? schemaExample;
    if (example !== undefined) {
      expected[param.name] = [example];
    }
  }
  return expected;
}

/** Project the fields carrying `examples` out of a z.toJSONSchema() result. */
function examplesByField(jsonSchema: unknown): Record<string, unknown> {
  const parsed = z
    .object({ properties: z.record(z.string(), z.object({ examples: z.unknown().optional() })) })
    .parse(jsonSchema);
  const actual: Record<string, unknown> = {};
  for (const [name, property] of Object.entries(parsed.properties)) {
    if (property.examples !== undefined) {
      actual[name] = property.examples;
    }
  }
  return actual;
}

describe('generated toolMcpFlatInputSchema .meta() round-trip', () => {
  it('carries exactly the source-declared path/query parameter examples through z.toJSONSchema()', () => {
    const operation = loadSchemaCachePaths()[LESSONS_PATH]?.get;
    expect(
      operation?.parameters,
      `schema cache carries no parameters for GET ${LESSONS_PATH}`,
    ).toBeDefined();

    const expected = expectedExamples(operation?.parameters ?? []);
    // Vacuous-green guard: the lessons endpoint declares examples on its
    // path/query parameters, so an empty derivation is a broken read, never
    // a passing state.
    expect(Object.keys(expected).length).toBeGreaterThan(0);

    const actual = examplesByField(z.toJSONSchema(toolMcpFlatInputSchema, { io: 'input' }));
    expect(actual).toEqual(expected);
  });
});
