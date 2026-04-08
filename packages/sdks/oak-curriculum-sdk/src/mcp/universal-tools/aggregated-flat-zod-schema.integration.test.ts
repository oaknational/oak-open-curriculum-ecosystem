/**
 * Integration tests for aggregated tool flatZodSchema propagation.
 *
 * Phase 2 acceptance: all aggregated tools must have `flatZodSchema`
 * defined in their `listUniversalTools()` entries, and the MCP SDK's
 * Zod → JSON Schema conversion must produce correct output.
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { listUniversalTools } from './list-tools.js';
import { generatedToolRegistry } from './index.js';
import { AGGREGATED_TOOL_DEFS } from './definitions.js';
import { typeSafeKeys } from '../../types/helpers/type-helpers.js';

const aggregatedNames = new Set<string>(typeSafeKeys(AGGREGATED_TOOL_DEFS));

describe('aggregated tools flatZodSchema propagation', () => {
  it('all aggregated tools have flatZodSchema defined', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const aggregatedTools = tools.filter((t) => aggregatedNames.has(t.name));

    expect(aggregatedTools).toHaveLength(typeSafeKeys(AGGREGATED_TOOL_DEFS).length);

    for (const tool of aggregatedTools) {
      expect(tool.flatZodSchema, `${tool.name} should have flatZodSchema`).toBeDefined();
    }
  });

  it('search flatZodSchema is wired from AGGREGATED_TOOL_DEFS through listUniversalTools', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const search = tools.find((t) => t.name === 'search');

    expect(search?.flatZodSchema).toBe(AGGREGATED_TOOL_DEFS.search.flatZodSchema);
  });

  it('fetch flatZodSchema produces JSON Schema with examples', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const fetchTool = tools.find((t) => t.name === 'fetch');

    expect(fetchTool?.flatZodSchema).toBeDefined();
    if (!fetchTool?.flatZodSchema) {
      throw new Error('fetch flatZodSchema not found');
    }

    const jsonSchema = z.toJSONSchema(z.object(fetchTool.flatZodSchema));
    expect(jsonSchema).toHaveProperty('properties.id.examples');
  });

  it('browse-curriculum flatZodSchema produces JSON Schema with examples', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const browse = tools.find((t) => t.name === 'browse-curriculum');

    expect(browse?.flatZodSchema).toBeDefined();
    if (!browse?.flatZodSchema) {
      throw new Error('browse-curriculum flatZodSchema not found');
    }

    const jsonSchema = z.toJSONSchema(z.object(browse.flatZodSchema));
    expect(jsonSchema).toHaveProperty('properties.subject.examples');
    expect(jsonSchema).toHaveProperty('properties.keyStage.examples');
  });

  it('explore-topic flatZodSchema produces JSON Schema with examples', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const explore = tools.find((t) => t.name === 'explore-topic');

    expect(explore?.flatZodSchema).toBeDefined();
    if (!explore?.flatZodSchema) {
      throw new Error('explore-topic flatZodSchema not found');
    }

    const jsonSchema = z.toJSONSchema(z.object(explore.flatZodSchema));
    expect(jsonSchema).toHaveProperty('properties.query.examples');
  });

  it('download-asset flatZodSchema produces JSON Schema with examples', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const download = tools.find((t) => t.name === 'download-asset');

    expect(download?.flatZodSchema).toBeDefined();
    if (!download?.flatZodSchema) {
      throw new Error('download-asset flatZodSchema not found');
    }

    const jsonSchema = z.toJSONSchema(z.object(download.flatZodSchema));
    expect(jsonSchema).toHaveProperty('properties.type.examples');
  });

  it('user-search flatZodSchema produces JSON Schema with examples', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const userSearch = tools.find((t) => t.name === 'user-search');

    expect(userSearch?.flatZodSchema).toBeDefined();
    if (!userSearch?.flatZodSchema) {
      throw new Error('user-search flatZodSchema not found');
    }

    const jsonSchema = z.toJSONSchema(z.object(userSearch.flatZodSchema));
    expect(jsonSchema).toHaveProperty('properties.query.examples');
    expect(jsonSchema).toHaveProperty('properties.scope.examples');
  });

  it('user-search-query flatZodSchema produces JSON Schema with examples', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const userSearchQuery = tools.find((t) => t.name === 'user-search-query');

    expect(userSearchQuery?.flatZodSchema).toBeDefined();
    if (!userSearchQuery?.flatZodSchema) {
      throw new Error('user-search-query flatZodSchema not found');
    }

    const jsonSchema = z.toJSONSchema(z.object(userSearchQuery.flatZodSchema));
    expect(jsonSchema).toHaveProperty('properties.query.examples');
  });

  it('get-curriculum-model flatZodSchema is empty (no parameters)', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const model = tools.find((t) => t.name === 'get-curriculum-model');

    expect(model?.flatZodSchema).toBeDefined();
    if (!model?.flatZodSchema) {
      throw new Error('get-curriculum-model flatZodSchema not found');
    }

    expect(typeSafeKeys(model.flatZodSchema)).toHaveLength(0);
  });

  it('empty-param tools have empty flatZodSchema', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const threadProgressions = tools.find((t) => t.name === 'get-thread-progressions');
    const prereqGraph = tools.find((t) => t.name === 'get-prerequisite-graph');

    expect(threadProgressions?.flatZodSchema).toBeDefined();
    expect(prereqGraph?.flatZodSchema).toBeDefined();

    if (!threadProgressions?.flatZodSchema || !prereqGraph?.flatZodSchema) {
      throw new Error('empty-param tools missing flatZodSchema');
    }

    expect(typeSafeKeys(threadProgressions.flatZodSchema)).toHaveLength(0);
    expect(typeSafeKeys(prereqGraph.flatZodSchema)).toHaveLength(0);
  });

  it('generated tools still have flatZodSchema after aggregated tool changes', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const generatedTools = tools.filter((t) => !aggregatedNames.has(t.name));

    expect(generatedTools.length).toBeGreaterThan(0);

    for (const tool of generatedTools) {
      expect(
        tool.flatZodSchema,
        `generated tool ${tool.name} should keep flatZodSchema`,
      ).toBeDefined();
    }
  });
});
