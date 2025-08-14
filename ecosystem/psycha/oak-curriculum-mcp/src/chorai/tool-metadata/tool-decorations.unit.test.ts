import { describe, it, expect } from 'vitest';
import { TOOL_DECORATIONS, assertNoPathKeys } from './tool-decorations';
import { toolGeneration } from '@oaknational/oak-curriculum-sdk';

/**
 * ADR Compliance Tests for temporary decorations registry (Option B)
 * - No path-like keys (must be operationId)
 * - All keys exist in SDK OPERATIONS_BY_ID
 */

describe('TOOL_DECORATIONS (temporary compliant registry)', () => {
  it('has no path-like keys (must be operationId)', () => {
    expect(() => {
      assertNoPathKeys(TOOL_DECORATIONS);
    }).not.toThrow();
    for (const key of Object.keys(TOOL_DECORATIONS)) {
      expect(key.startsWith('/')).toBe(false);
    }
  });

  it('only references operationIds present in the SDK', () => {
    const ids = new Set(Object.keys(toolGeneration.OPERATIONS_BY_ID));
    const unknown: string[] = [];
    for (const key of Object.keys(TOOL_DECORATIONS)) {
      if (!ids.has(key)) unknown.push(key);
    }
    expect(unknown).toEqual([]);
  });
});
