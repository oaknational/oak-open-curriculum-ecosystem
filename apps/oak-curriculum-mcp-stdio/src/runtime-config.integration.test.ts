import { describe, it, expect } from 'vitest';
import { loadRuntimeConfig } from './runtime-config.js';

/**
 * Integration tests for loadRuntimeConfig.
 *
 * Tests the integration of resolveEnv with StdioEnvSchema and the
 * post-processing logic that derives RuntimeConfig from validated env.
 *
 * These tests provide a controlled processEnv (highest precedence in
 * resolveEnv) so .env file contents do not affect assertions.
 */

const VALID_ENV = {
  OAK_API_KEY: 'test-api-key',
  ELASTICSEARCH_URL: 'http://localhost:9200',
  ELASTICSEARCH_API_KEY: 'test-es-key',
} as const satisfies Record<string, string>;

describe('loadRuntimeConfig', () => {
  /**
   * Use a startDir that won't find a repo root. This prevents .env files
   * from satisfying schema requirements, giving the tests full control over
   * which env vars are present.
   */
  const isolatedStartDir = '/tmp';

  describe('success path', () => {
    it('returns Ok with default log level and stub tools disabled', () => {
      const result = loadRuntimeConfig({
        processEnv: { ...VALID_ENV },
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }

      expect(result.value.logLevel).toBe('info');
      expect(result.value.useStubTools).toBe(false);
      expect(result.value.env.OAK_API_KEY).toBe('test-api-key');
      expect(result.value.env.ELASTICSEARCH_URL).toBe('http://localhost:9200');
      expect(result.value.env.ELASTICSEARCH_API_KEY).toBe('test-es-key');
    });

    it('uses the validated LOG_LEVEL when provided', () => {
      const result = loadRuntimeConfig({
        processEnv: { ...VALID_ENV, LOG_LEVEL: 'debug' },
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }

      expect(result.value.logLevel).toBe('debug');
    });

    it('derives useStubTools from OAK_CURRICULUM_MCP_USE_STUB_TOOLS', () => {
      const result = loadRuntimeConfig({
        processEnv: { ...VALID_ENV, OAK_CURRICULUM_MCP_USE_STUB_TOOLS: 'true' },
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }

      expect(result.value.useStubTools).toBe(true);
    });

    it('includes version from processEnv.npm_package_version', () => {
      const result = loadRuntimeConfig({
        processEnv: { ...VALID_ENV, npm_package_version: '1.2.3' },
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }

      expect(result.value.version).toBe('1.2.3');
    });

    it('defaults version to 0.0.0 when npm_package_version is absent', () => {
      const result = loadRuntimeConfig({
        processEnv: { ...VALID_ENV },
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }

      expect(result.value.version).toBe('0.0.0');
    });

    it('passes through logger sink config vars', () => {
      const result = loadRuntimeConfig({
        processEnv: {
          ...VALID_ENV,
          MCP_LOGGER_STDOUT: 'false',
          MCP_LOGGER_FILE_PATH: '/tmp/test.log',
          MCP_LOGGER_FILE_APPEND: 'true',
        },
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }

      expect(result.value.env.MCP_LOGGER_STDOUT).toBe('false');
      expect(result.value.env.MCP_LOGGER_FILE_PATH).toBe('/tmp/test.log');
      expect(result.value.env.MCP_LOGGER_FILE_APPEND).toBe('true');
    });
  });

  describe('validation failure', () => {
    it('returns Err when ELASTICSEARCH_URL is missing', () => {
      const result = loadRuntimeConfig({
        processEnv: {
          OAK_API_KEY: 'test-key',
          ELASTICSEARCH_API_KEY: 'test-es-key',
        },
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(false);
      if (result.ok) {
        return;
      }

      expect(result.error.message).toContain('ELASTICSEARCH_URL');
    });

    it('returns Err when ELASTICSEARCH_API_KEY is missing', () => {
      const result = loadRuntimeConfig({
        processEnv: {
          OAK_API_KEY: 'test-key',
          ELASTICSEARCH_URL: 'http://localhost:9200',
        },
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(false);
      if (result.ok) {
        return;
      }

      expect(result.error.message).toContain('ELASTICSEARCH_API_KEY');
    });

    it('returns Err when OAK_API_KEY is missing', () => {
      const result = loadRuntimeConfig({
        processEnv: {
          ELASTICSEARCH_URL: 'http://localhost:9200',
          ELASTICSEARCH_API_KEY: 'test-es-key',
        },
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(false);
      if (result.ok) {
        return;
      }

      expect(result.error.message).toContain('OAK_API_KEY');
    });

    it('returns Err with diagnostics on validation failure', () => {
      const result = loadRuntimeConfig({
        processEnv: {},
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(false);
      if (result.ok) {
        return;
      }

      expect(result.error.diagnostics.length).toBeGreaterThan(0);
    });
  });
});
