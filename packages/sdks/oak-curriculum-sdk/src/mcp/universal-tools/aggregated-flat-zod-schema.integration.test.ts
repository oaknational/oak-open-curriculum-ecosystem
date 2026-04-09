/**
 * Integration tests for aggregated tool inputSchema propagation.
 *
 * Proves all aggregated tools have `inputSchema` propagated through
 * `listUniversalTools()`, and the MCP SDK's Zod → JSON Schema conversion
 * produces correct output with parameter descriptions and examples.
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { listUniversalTools } from './list-tools.js';
import { generatedToolRegistry } from './index.js';
import { AGGREGATED_TOOL_DEFS } from './definitions.js';
import { typeSafeKeys } from '../../types/helpers/type-helpers.js';

const aggregatedNames = new Set<string>(typeSafeKeys(AGGREGATED_TOOL_DEFS));

describe('aggregated tools inputSchema propagation', () => {
  it('all aggregated tools with parameters have inputSchema defined', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const aggregatedTools = tools.filter((t) => aggregatedNames.has(t.name));

    expect(aggregatedTools).toHaveLength(typeSafeKeys(AGGREGATED_TOOL_DEFS).length);

    const toolsWithParams = aggregatedTools.filter(
      (t) =>
        t.name !== 'get-curriculum-model' &&
        t.name !== 'get-thread-progressions' &&
        t.name !== 'get-prerequisite-graph',
    );

    for (const tool of toolsWithParams) {
      expect(tool.inputSchema, `${tool.name} should have inputSchema`).toBeDefined();
    }
  });

  it('search inputSchema is wired from AGGREGATED_TOOL_DEFS through listUniversalTools', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const search = tools.find((t) => t.name === 'search');

    expect(search?.inputSchema).toBe(AGGREGATED_TOOL_DEFS.search.inputSchema);
  });

  it('fetch inputSchema produces JSON Schema with examples', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const fetchTool = tools.find((t) => t.name === 'fetch');

    expect(fetchTool?.inputSchema).toBeDefined();
    if (!fetchTool?.inputSchema) {
      throw new Error('fetch inputSchema not found');
    }

    const jsonSchema = z.toJSONSchema(z.object(fetchTool.inputSchema));
    expect(jsonSchema).toHaveProperty('properties.id.examples');
  });

  it('browse-curriculum inputSchema produces JSON Schema with examples', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const browse = tools.find((t) => t.name === 'browse-curriculum');

    expect(browse?.inputSchema).toBeDefined();
    if (!browse?.inputSchema) {
      throw new Error('browse-curriculum inputSchema not found');
    }

    const jsonSchema = z.toJSONSchema(z.object(browse.inputSchema));
    expect(jsonSchema).toHaveProperty('properties.subject.examples');
    expect(jsonSchema).toHaveProperty('properties.keyStage.examples');
  });

  it('explore-topic inputSchema produces JSON Schema with examples', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const explore = tools.find((t) => t.name === 'explore-topic');

    expect(explore?.inputSchema).toBeDefined();
    if (!explore?.inputSchema) {
      throw new Error('explore-topic inputSchema not found');
    }

    const jsonSchema = z.toJSONSchema(z.object(explore.inputSchema));
    expect(jsonSchema).toHaveProperty('properties.query.examples');
  });

  it('download-asset inputSchema produces JSON Schema with examples', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const download = tools.find((t) => t.name === 'download-asset');

    expect(download?.inputSchema).toBeDefined();
    if (!download?.inputSchema) {
      throw new Error('download-asset inputSchema not found');
    }

    const jsonSchema = z.toJSONSchema(z.object(download.inputSchema));
    expect(jsonSchema).toHaveProperty('properties.type.examples');
  });

  it('user-search inputSchema produces JSON Schema with examples', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const userSearch = tools.find((t) => t.name === 'user-search');

    expect(userSearch?.inputSchema).toBeDefined();
    if (!userSearch?.inputSchema) {
      throw new Error('user-search inputSchema not found');
    }

    const jsonSchema = z.toJSONSchema(z.object(userSearch.inputSchema));
    expect(jsonSchema).toHaveProperty('properties.query.examples');
    expect(jsonSchema).toHaveProperty('properties.scope.examples');
  });

  it('user-search-query inputSchema produces JSON Schema with examples', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const userSearchQuery = tools.find((t) => t.name === 'user-search-query');

    expect(userSearchQuery?.inputSchema).toBeDefined();
    if (!userSearchQuery?.inputSchema) {
      throw new Error('user-search-query inputSchema not found');
    }

    const jsonSchema = z.toJSONSchema(z.object(userSearchQuery.inputSchema));
    expect(jsonSchema).toHaveProperty('properties.query.examples');
  });

  it('generated tools still have inputSchema after aggregated tool changes', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const generatedTools = tools.filter((t) => !aggregatedNames.has(t.name));

    expect(generatedTools.length).toBeGreaterThan(0);

    for (const tool of generatedTools) {
      expect(tool.inputSchema, `generated tool ${tool.name} should keep inputSchema`).toBeDefined();
    }
  });
});

describe('no-input tools have empty inputSchema (MCP spec: strict empty object)', () => {
  it('get-curriculum-model inputSchema is an empty shape', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const model = tools.find((t) => t.name === 'get-curriculum-model');

    expect(model).toBeDefined();
    expect(model?.inputSchema).toEqual({});
  });

  it('get-thread-progressions inputSchema is an empty shape', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const threadProgressions = tools.find((t) => t.name === 'get-thread-progressions');

    expect(threadProgressions).toBeDefined();
    expect(threadProgressions?.inputSchema).toEqual({});
  });

  it('get-prerequisite-graph inputSchema is an empty shape', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const prereqGraph = tools.find((t) => t.name === 'get-prerequisite-graph');

    expect(prereqGraph).toBeDefined();
    expect(prereqGraph?.inputSchema).toEqual({});
  });
});
