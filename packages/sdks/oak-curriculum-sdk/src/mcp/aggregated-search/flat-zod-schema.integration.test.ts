/**
 * Integration tests for the search tool's flat Zod schema.
 *
 * Phase 2 of the off-the-shelf MCP SDK adoption plan: aggregated tools
 * need `inputSchema` with `.describe()` and `.meta({ examples })` so
 * the MCP SDK's native `z.toJSONSchema()` conversion produces correct
 * JSON Schema with examples — no shim needed.
 *
 * These tests exercise the full Zod 4 globalRegistry path:
 * `.meta()` → `z.toJSONSchema()` → `examples` in JSON Schema output.
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { SEARCH_INPUT_SCHEMA } from './flat-zod-schema.js';

describe('search inputSchema round-trip', () => {
  it('exports a defined inputSchema', () => {
    expect(SEARCH_INPUT_SCHEMA).toBeDefined();
  });

  it('z.toJSONSchema() produces examples on fields with examples', () => {
    const jsonSchema = z.toJSONSchema(z.object(SEARCH_INPUT_SCHEMA));

    expect(jsonSchema).toHaveProperty('properties.query.examples', [
      'photosynthesis',
      'adding fractions',
      'the Romans',
      'electricity and circuits',
    ]);
    expect(jsonSchema).toHaveProperty('properties.scope.examples', ['lessons', 'units', 'threads']);
    expect(jsonSchema).toHaveProperty('properties.subject.examples', [
      'maths',
      'science',
      'english',
    ]);
    expect(jsonSchema).toHaveProperty('properties.keyStage.examples', ['ks2', 'ks3']);
    expect(jsonSchema).toHaveProperty('properties.unitSlug.examples', ['fractions', 'the-romans']);
    expect(jsonSchema).toHaveProperty('properties.tier.examples', ['foundation', 'higher']);
    expect(jsonSchema).toHaveProperty('properties.examBoard.examples', ['aqa', 'edexcel', 'ocr']);
  });

  it('z.toJSONSchema() produces descriptions on all 16 fields', () => {
    const jsonSchema = z.toJSONSchema(z.object(SEARCH_INPUT_SCHEMA));

    expect(jsonSchema).toHaveProperty('properties.query.description');
    expect(jsonSchema).toHaveProperty('properties.scope.description');
    expect(jsonSchema).toHaveProperty('properties.subject.description');
    expect(jsonSchema).toHaveProperty('properties.keyStage.description');
    expect(jsonSchema).toHaveProperty('properties.size.description');
    expect(jsonSchema).toHaveProperty('properties.from.description');
    expect(jsonSchema).toHaveProperty('properties.unitSlug.description');
    expect(jsonSchema).toHaveProperty('properties.tier.description');
    expect(jsonSchema).toHaveProperty('properties.examBoard.description');
    expect(jsonSchema).toHaveProperty('properties.year.description');
    expect(jsonSchema).toHaveProperty('properties.threadSlug.description');
    expect(jsonSchema).toHaveProperty('properties.highlight.description');
    expect(jsonSchema).toHaveProperty('properties.minLessons.description');
    expect(jsonSchema).toHaveProperty('properties.phaseSlug.description');
    expect(jsonSchema).toHaveProperty('properties.category.description');
    expect(jsonSchema).toHaveProperty('properties.limit.description');
  });

  it('fields without examples do not have examples property', () => {
    const jsonSchema = z.toJSONSchema(z.object(SEARCH_INPUT_SCHEMA));

    expect(jsonSchema).not.toHaveProperty('properties.size.examples');
    expect(jsonSchema).not.toHaveProperty('properties.from.examples');
    expect(jsonSchema).not.toHaveProperty('properties.threadSlug.examples');
    expect(jsonSchema).not.toHaveProperty('properties.highlight.examples');
    expect(jsonSchema).not.toHaveProperty('properties.minLessons.examples');
    expect(jsonSchema).not.toHaveProperty('properties.limit.examples');
  });

  it('year field has examples despite union structure', () => {
    const jsonSchema = z.toJSONSchema(z.object(SEARCH_INPUT_SCHEMA));

    expect(jsonSchema).toHaveProperty('properties.year.examples', ['3', '7', 10]);
  });

  it('phaseSlug and category fields have correct example status', () => {
    const jsonSchema = z.toJSONSchema(z.object(SEARCH_INPUT_SCHEMA));

    expect(jsonSchema).toHaveProperty('properties.phaseSlug.examples', ['primary', 'secondary']);
    expect(jsonSchema).not.toHaveProperty('properties.category.examples');
  });
});
