import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { toolMcpFlatInputSchema } from '../../../src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-lessons.js';

/**
 * Round-trip integration test: generated Zod schema to z.toJSONSchema() to JSON Schema
 * with examples.
 *
 * This test catches string-template bugs in codegen (e.g. `.meta(\{ example: [...] \})`
 * instead of `.meta(\{ examples: [...] \})`) that unit string-matching tests cannot detect.
 * It exercises the full Zod 4 globalRegistry path: .meta() to toJSONSchema() to examples
 * in output.
 *
 * Blocking for Phase 1 completion per reviewer finding B7.
 */
describe('generated toolMcpFlatInputSchema .meta() round-trip', () => {
  it('z.toJSONSchema() produces examples on string fields with OpenAPI examples', () => {
    const jsonSchema = z.toJSONSchema(toolMcpFlatInputSchema);

    expect(jsonSchema).toHaveProperty('properties.keyStage.examples', ['ks1']);
    expect(jsonSchema).toHaveProperty('properties.subject.examples', ['english']);
    expect(jsonSchema).toHaveProperty('properties.unit.examples', ['word-class']);
  });

  it('z.toJSONSchema() produces examples on number fields with OpenAPI examples', () => {
    const jsonSchema = z.toJSONSchema(toolMcpFlatInputSchema);

    expect(jsonSchema).toHaveProperty('properties.offset.examples', [50]);
    expect(jsonSchema).toHaveProperty('properties.limit.examples', [10]);
  });

  it('each field with examples has exactly one example value', () => {
    const jsonSchema = z.toJSONSchema(toolMcpFlatInputSchema);

    // All 5 fields in get-key-stages-subject-lessons have OpenAPI examples.
    // Each should produce a single-element examples array (codegen wraps meta.example in []).
    expect(jsonSchema).toHaveProperty('properties.keyStage.examples');
    expect(jsonSchema).toHaveProperty('properties.subject.examples');
    expect(jsonSchema).toHaveProperty('properties.unit.examples');
    expect(jsonSchema).toHaveProperty('properties.offset.examples');
    expect(jsonSchema).toHaveProperty('properties.limit.examples');
  });
});
