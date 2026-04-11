/**
 * Unit tests for misconception graph MCP resource definition.
 *
 * Verifies the resource constant and getter function follow the
 * graph resource factory pattern.
 */

import { describe, it, expect } from 'vitest';
import { misconceptionGraph } from '@oaknational/sdk-codegen/vocab-data';
import {
  MISCONCEPTION_GRAPH_RESOURCE,
  getMisconceptionGraphJson,
} from './misconception-graph-resource.js';

describe('MISCONCEPTION_GRAPH_RESOURCE', () => {
  it('has curriculum://misconception-graph URI', () => {
    expect(MISCONCEPTION_GRAPH_RESOURCE.uri).toBe('curriculum://misconception-graph');
  });

  it('has application/json MIME type', () => {
    expect(MISCONCEPTION_GRAPH_RESOURCE.mimeType).toBe('application/json');
  });

  it('has priority 0.5 (supplementary, not essential)', () => {
    expect(MISCONCEPTION_GRAPH_RESOURCE.annotations.priority).toBe(0.5);
  });

  it('has audience ["assistant"]', () => {
    expect(MISCONCEPTION_GRAPH_RESOURCE.annotations.audience).toContain('assistant');
  });

  it('has a title identifying the misconception graph', () => {
    expect(MISCONCEPTION_GRAPH_RESOURCE.title).toContain('Misconception');
  });

  it('has a description mentioning misconceptions', () => {
    expect(MISCONCEPTION_GRAPH_RESOURCE.description).toContain('misconceptions');
  });
});

describe('getMisconceptionGraphJson', () => {
  it('correctly serialises the misconception graph source data', () => {
    expect(getMisconceptionGraphJson()).toBe(JSON.stringify(misconceptionGraph, null, 2));
  });
});
