/**
 * Unit tests for the graph resource factory.
 *
 * @remarks
 * These tests verify the factory produces correct resource constants,
 * tool definitions, JSON getters, and tool executors from configuration.
 * The factory is an internal DRY extraction — it does not change
 * the behaviour of any existing graph surface.
 */

import { describe, it, expect } from 'vitest';
import {
  createGraphResource,
  createGraphJsonGetter,
  createGraphToolDef,
  createGraphToolExecutor,
} from './graph-resource-factory.js';
import { OAK_API_ATTRIBUTION } from './source-attribution.js';

/**
 * Minimal typed test data matching the `{ readonly version: string }`
 * constraint required by the factory generic.
 */
interface TestGraph {
  readonly version: string;
  readonly stats: { readonly nodeCount: number };
  readonly nodes: readonly string[];
}

const TEST_DATA: TestGraph = {
  version: '1.0.0',
  stats: { nodeCount: 3 },
  nodes: ['a', 'b', 'c'],
};

const TEST_CONFIG = {
  name: 'test-graph',
  title: 'Test Graph',
  description: 'A test graph for unit testing.',
  uriSegment: 'test-graph',
  sourceData: TEST_DATA,
  summary: 'Test graph loaded. Contains 3 nodes.',
} as const;

describe('createGraphResource', () => {
  const resource = createGraphResource(TEST_CONFIG);

  it('produces URI with curriculum:// scheme and uriSegment', () => {
    expect(resource.uri).toBe('curriculum://test-graph');
  });

  it('sets mimeType to application/json', () => {
    expect(resource.mimeType).toBe('application/json');
  });

  it('defaults priority to 0.5 (supplementary)', () => {
    expect(resource.annotations.priority).toBe(0.5);
  });

  it('sets audience to assistant', () => {
    expect(resource.annotations.audience).toContain('assistant');
  });

  it('preserves name, title, and description from config', () => {
    expect(resource.name).toBe('test-graph');
    expect(resource.title).toBe('Test Graph');
    expect(resource.description).toBe('A test graph for unit testing.');
  });

  it('respects custom priority', () => {
    const highPriority = createGraphResource({ ...TEST_CONFIG, priority: 1.0 });
    expect(highPriority.annotations.priority).toBe(1.0);
  });

  it('omits _meta when no attribution is provided', () => {
    expect(resource).not.toHaveProperty('_meta');
  });

  it('includes _meta.attribution when attribution is provided', () => {
    const withAttribution = createGraphResource({
      ...TEST_CONFIG,
      attribution: OAK_API_ATTRIBUTION,
    });
    expect(withAttribution._meta).toEqual({ attribution: OAK_API_ATTRIBUTION });
  });
});

describe('createGraphJsonGetter', () => {
  const getJson = createGraphJsonGetter(TEST_CONFIG);

  it('serialises source data as formatted JSON', () => {
    expect(getJson()).toBe(JSON.stringify(TEST_DATA, null, 2));
  });
});

describe('createGraphToolDef', () => {
  const toolDef = createGraphToolDef(TEST_CONFIG);

  it('has the configured title', () => {
    expect(toolDef.title).toBe('Test Graph');
  });

  it('has read-only and idempotent annotations', () => {
    expect(toolDef.annotations).toEqual({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
  });

  it('includes securitySchemes with oauth2 scopes', () => {
    expect(toolDef.securitySchemes).toBeDefined();
    expect(toolDef.securitySchemes.length).toBeGreaterThan(0);
    expect(toolDef.securitySchemes[0]).toHaveProperty('type', 'oauth2');
    expect(toolDef.securitySchemes[0]).toHaveProperty('scopes');
  });

  it('includes the description from config', () => {
    expect(toolDef.description).toContain('A test graph for unit testing.');
  });

  it('returns undefined _meta when no attribution is provided', () => {
    expect(toolDef._meta).toBeUndefined();
  });

  it('returns _meta.attribution when attribution is provided', () => {
    const withAttribution = createGraphToolDef({
      ...TEST_CONFIG,
      attribution: OAK_API_ATTRIBUTION,
    });
    expect(withAttribution._meta).toEqual({ attribution: OAK_API_ATTRIBUTION });
  });
});

describe('createGraphToolExecutor', () => {
  const execute = createGraphToolExecutor(TEST_CONFIG);

  it('returns a valid CallToolResult structure', () => {
    const result = execute();
    expect(result).toHaveProperty('content');
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);
  });

  it('includes structuredContent for model reasoning', () => {
    const result = execute();
    expect(result).toHaveProperty('structuredContent');
    expect(result.structuredContent).toBeDefined();
  });

  it('includes summary text in content', () => {
    const result = execute();
    const textContent = result.content[0];
    expect(textContent).toHaveProperty('type', 'text');
    expect(textContent).toHaveProperty('text');
  });
});
