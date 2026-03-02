/**
 * Unit tests for prerequisite graph MCP resource definition.
 *
 * Verifies the resource constant and getter function follow the
 * context-providing tool/resource pair pattern established by
 * curriculum-model-resource.ts.
 */

import { describe, it, expect } from 'vitest';
import { prerequisiteGraph } from '@oaknational/sdk-codegen/vocab-data';
import {
  PREREQUISITE_GRAPH_RESOURCE,
  getPrerequisiteGraphJson,
} from './prerequisite-graph-resource.js';

describe('PREREQUISITE_GRAPH_RESOURCE', () => {
  it('has curriculum://prerequisite-graph URI', () => {
    expect(PREREQUISITE_GRAPH_RESOURCE.uri).toBe('curriculum://prerequisite-graph');
  });

  it('has application/json MIME type', () => {
    expect(PREREQUISITE_GRAPH_RESOURCE.mimeType).toBe('application/json');
  });

  it('has priority 0.5 (supplementary, not essential)', () => {
    expect(PREREQUISITE_GRAPH_RESOURCE.annotations.priority).toBe(0.5);
  });

  it('has audience ["assistant"]', () => {
    expect(PREREQUISITE_GRAPH_RESOURCE.annotations.audience).toContain('assistant');
  });

  it('has a descriptive title', () => {
    expect(PREREQUISITE_GRAPH_RESOURCE.title).toBeDefined();
    expect(PREREQUISITE_GRAPH_RESOURCE.title.length).toBeGreaterThan(5);
  });

  it('has a non-empty description', () => {
    expect(PREREQUISITE_GRAPH_RESOURCE.description).toBeDefined();
    expect(PREREQUISITE_GRAPH_RESOURCE.description.length).toBeGreaterThan(20);
  });
});

describe('getPrerequisiteGraphJson', () => {
  it('correctly serializes the prerequisite graph source data', () => {
    expect(getPrerequisiteGraphJson()).toBe(JSON.stringify(prerequisiteGraph, null, 2));
  });
});
