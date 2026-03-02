/**
 * Unit tests for the null generated tool registry test helper.
 *
 * Verifies the registry satisfies the GeneratedToolRegistry interface
 * with safe defaults: empty tool list, throwing getter, always-false guard.
 */

import { describe, it, expect } from 'vitest';
import { createNullGeneratedToolRegistry } from './null-generated-tool-registry.js';
import type { ToolName } from '@oaknational/sdk-codegen/mcp-tools';

const anyToolName = 'get-lessons-summary' as const satisfies ToolName;

describe('createNullGeneratedToolRegistry', () => {
  it('returns empty toolNames', () => {
    const registry = createNullGeneratedToolRegistry();
    expect(registry.toolNames).toEqual([]);
  });

  it('throws on getToolFromToolName', () => {
    const registry = createNullGeneratedToolRegistry();
    expect(() => registry.getToolFromToolName(anyToolName)).toThrow(
      'Should not call getToolFromToolName',
    );
  });

  it('returns false for any isToolName check', () => {
    const registry = createNullGeneratedToolRegistry();
    expect(registry.isToolName('anything')).toBe(false);
    expect(registry.isToolName('')).toBe(false);
    expect(registry.isToolName(42)).toBe(false);
  });
});
