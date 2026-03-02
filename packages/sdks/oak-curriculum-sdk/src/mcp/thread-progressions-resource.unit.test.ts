/**
 * Unit tests for thread progressions MCP resource definition.
 *
 * Verifies the resource constant and getter function follow the
 * context-providing tool/resource pair pattern established by
 * curriculum-model-resource.ts.
 */

import { describe, it, expect } from 'vitest';
import { threadProgressionGraph } from '@oaknational/sdk-codegen/vocab-data';
import {
  THREAD_PROGRESSIONS_RESOURCE,
  getThreadProgressionsJson,
} from './thread-progressions-resource.js';

describe('THREAD_PROGRESSIONS_RESOURCE', () => {
  it('has curriculum://thread-progressions URI', () => {
    expect(THREAD_PROGRESSIONS_RESOURCE.uri).toBe('curriculum://thread-progressions');
  });

  it('has application/json MIME type', () => {
    expect(THREAD_PROGRESSIONS_RESOURCE.mimeType).toBe('application/json');
  });

  it('has priority 0.5 (supplementary, not essential)', () => {
    expect(THREAD_PROGRESSIONS_RESOURCE.annotations.priority).toBe(0.5);
  });

  it('has audience ["assistant"]', () => {
    expect(THREAD_PROGRESSIONS_RESOURCE.annotations.audience).toContain('assistant');
  });

  it('has a descriptive title', () => {
    expect(THREAD_PROGRESSIONS_RESOURCE.title).toBeDefined();
    expect(THREAD_PROGRESSIONS_RESOURCE.title.length).toBeGreaterThan(5);
  });

  it('has a non-empty description', () => {
    expect(THREAD_PROGRESSIONS_RESOURCE.description).toBeDefined();
    expect(THREAD_PROGRESSIONS_RESOURCE.description.length).toBeGreaterThan(20);
  });
});

describe('getThreadProgressionsJson', () => {
  it('correctly serializes the thread progressions source data', () => {
    expect(getThreadProgressionsJson()).toBe(JSON.stringify(threadProgressionGraph, null, 2));
  });
});
