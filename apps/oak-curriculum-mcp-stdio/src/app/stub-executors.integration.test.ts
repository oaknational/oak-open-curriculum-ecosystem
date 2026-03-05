import { describe, it, expect } from 'vitest';
import { resolveToolExecutors } from './stub-executors.js';

/**
 * Integration tests for the resolveToolExecutors() wrapper function.
 *
 * Validates the stdio app's wrapper logic and its integration with the SDK
 * stub executor:
 * - Conditional executor creation based on useStubTools flag
 * - Return value structure
 * - Stub executor instantiation via the SDK
 */
describe('resolveToolExecutors', () => {
  it('returns empty executors object when useStubTools is false', () => {
    const executors = resolveToolExecutors(false);

    expect(executors).toEqual({});
    expect(executors.executeMcpTool).toBeUndefined();
  });

  it('returns executors with executeMcpTool when useStubTools is true', () => {
    const executors = resolveToolExecutors(true);

    expect(executors.executeMcpTool).toBeDefined();
  });

  it('executeMcpTool wrapper passes through to SDK stub executor', async () => {
    const executors = resolveToolExecutors(true);

    const result = await executors.executeMcpTool?.('get-key-stages', {});

    expect(result).toBeDefined();
    if (result) {
      expect('ok' in result).toBe(true);
    }
  });
});
