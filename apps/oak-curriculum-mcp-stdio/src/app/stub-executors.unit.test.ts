import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { resolveToolExecutors } from './stub-executors.js';

/**
 * Unit tests for resolveToolExecutors() wrapper function.
 *
 * This test ONLY validates the stdio app's own wrapper logic:
 * - Environment variable checking
 * - Conditional executor creation
 * - Return value structure
 *
 * The underlying SDK stub executor functionality is tested in the SDK's own unit tests
 * at packages/sdks/oak-curriculum-sdk/src/mcp/stub-tool-executor.unit.test.ts
 */
describe('resolveToolExecutors', () => {
  beforeEach(() => {
    delete process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS;
  });

  afterEach(() => {
    delete process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS;
  });

  it('returns empty executors object when stub tools are not enabled', () => {
    // Arrange
    process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'false';

    // Act
    const executors = resolveToolExecutors();

    // Assert
    expect(executors).toEqual({});
    expect(executors.executeMcpTool).toBeUndefined();
  });

  it('returns empty executors object when environment variable is not set', () => {
    // Arrange - env var already deleted in beforeEach

    // Act
    const executors = resolveToolExecutors();

    // Assert
    expect(executors).toEqual({});
    expect(executors.executeMcpTool).toBeUndefined();
  });

  it('returns executors with executeMcpTool when stub tools are enabled', () => {
    // Arrange
    process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'true';

    // Act
    const executors = resolveToolExecutors();

    // Assert
    expect(executors.executeMcpTool).toBeDefined();
  });

  it('executeMcpTool wrapper passes through to SDK stub executor', async () => {
    // Arrange
    process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'true';
    const executors = resolveToolExecutors();

    // Act - Call with a simple tool to verify wrapper works
    // We're just testing the wrapper passes through correctly, not the SDK functionality
    const result = await executors.executeMcpTool?.('get-key-stages', {});

    // Assert - Verify wrapper returns a result object structure
    // The SDK's own tests verify the actual stub data correctness
    expect(result).toBeDefined();
    // Should have either success fields (status, data) or error field
    if (result) {
      expect('status' in result || 'error' in result).toBe(true);
    }
  });
});
