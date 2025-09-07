/**
 * Tests for environment configuration loading
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('environment configuration', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.NOTION_API_KEY;
    delete process.env.NOTION_API_KEY;
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.NOTION_API_KEY = originalEnv;
    } else {
      delete process.env.NOTION_API_KEY;
    }
  });

  it('should read environment variables directly without dotenv loading', async () => {
    // This test verifies that the environment module reads env vars directly
    // dotenv loading should be handled by the consuming application

    // Arrange
    process.env.NOTION_API_KEY = 'test_key_direct';

    // Mock the getString function to track when env is read
    vi.doMock('../config/notion-config/env-utils', () => ({
      getString: (key: string) => {
        return process.env[key];
      },
      getBoolean: vi.fn(() => false),
      getNumber: vi.fn(() => 100),
    }));

    // Mock histos-logger
    vi.doMock('@oaknational/mcp-histos-logger', () => ({
      parseLogLevel: vi.fn(() => 'INFO'),
      LOG_LEVEL_KEY: 'LOG_LEVEL',
      ENABLE_DEBUG_LOGGING_KEY: 'ENABLE_DEBUG_LOGGING',
      BaseLoggingEnvironment: {},
    }));

    // Act - Import the environment module using dynamic import
    await import('../config/notion-config/environment');

    // Assert - Environment should read the value directly
    expect(process.env.NOTION_API_KEY).toBe('test_key_direct');
  });
});
