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

  it('should load dotenv config before reading environment variables', async () => {
    // This test verifies that the environment module loads dotenv
    // before trying to read NOTION_API_KEY

    // Arrange
    let dotenvCalledBeforeEnvRead = false;
    let envReadAttempted = false;

    // Mock dotenv to set the env var when config is called
    vi.doMock('dotenv', () => ({
      config: () => {
        process.env.NOTION_API_KEY = 'test_key_from_dotenv';
        dotenvCalledBeforeEnvRead = !envReadAttempted;
        return {};
      },
    }));

    // Mock the getString function to track when env is read
    vi.doMock('../chora/phaneron/notion-config/env-utils', () => ({
      getString: (key: string) => {
        if (key === 'NOTION_API_KEY') {
          envReadAttempted = true;
        }
        return process.env[key];
      },
      getBoolean: vi.fn(() => false),
      getNumber: vi.fn(() => 100),
      getLogLevel: vi.fn(() => 'INFO'),
      getEnum: vi.fn(() => 'production'),
      BaseEnvironment: {},
      loadDotenvIfNeeded: vi.fn(async () => {
        // Simulate loading dotenv
        const dotenv = await import('dotenv');
        dotenv.config();
      }),
    }));

    // Act - Import the environment module using dynamic import
    // This should trigger dotenv.config() then read env vars
    await import('../chora/phaneron/notion-config/environment');

    // Assert
    expect(dotenvCalledBeforeEnvRead).toBe(true);
    expect(process.env.NOTION_API_KEY).toBe('test_key_from_dotenv');
  });
});
