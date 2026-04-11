/**
 * Unit tests for prior knowledge graph MCP resource definition.
 *
 * Verifies the resource constant and getter function follow the
 * context-providing tool/resource pair pattern established by
 * curriculum-model-resource.ts.
 */

import { describe, it, expect } from 'vitest';
import { priorKnowledgeGraph } from '@oaknational/sdk-codegen/vocab-data';
import {
  PRIOR_KNOWLEDGE_GRAPH_RESOURCE,
  getPriorKnowledgeGraphJson,
} from './prior-knowledge-graph-resource.js';

describe('PRIOR_KNOWLEDGE_GRAPH_RESOURCE', () => {
  it('has curriculum://prior-knowledge-graph URI', () => {
    expect(PRIOR_KNOWLEDGE_GRAPH_RESOURCE.uri).toBe('curriculum://prior-knowledge-graph');
  });

  it('has application/json MIME type', () => {
    expect(PRIOR_KNOWLEDGE_GRAPH_RESOURCE.mimeType).toBe('application/json');
  });

  it('has priority 0.5 (supplementary, not essential)', () => {
    expect(PRIOR_KNOWLEDGE_GRAPH_RESOURCE.annotations.priority).toBe(0.5);
  });

  it('has audience ["assistant"]', () => {
    expect(PRIOR_KNOWLEDGE_GRAPH_RESOURCE.annotations.audience).toContain('assistant');
  });
});

describe('getPriorKnowledgeGraphJson', () => {
  it('correctly serialises the prior knowledge graph source data', () => {
    expect(getPriorKnowledgeGraphJson()).toBe(JSON.stringify(priorKnowledgeGraph, null, 2));
  });
});
