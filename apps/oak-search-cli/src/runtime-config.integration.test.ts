/**
 * Integration tests for Search CLI loadRuntimeConfig.
 *
 * Tests the integration of resolveEnv with SearchCliEnvSchema and the
 * post-processing logic that derives SearchCliRuntimeConfig from validated env.
 *
 * These tests provide a controlled processEnv (highest precedence in
 * resolveEnv) so .env file contents do not affect assertions.
 */

import { describe, it, expect } from 'vitest';
import { loadRuntimeConfig } from './runtime-config.js';

const VALID_ENV = {
  ELASTICSEARCH_URL: 'http://localhost:9200',
  ELASTICSEARCH_API_KEY: 'test-api-key-123',
  OAK_API_KEY: 'test-oak-key',
  SEARCH_API_KEY: 'test-search-key-123',
} as const satisfies Record<string, string>;

describe('loadRuntimeConfig', () => {
  /**
   * Use a startDir that won't find a repo root. This prevents .env files
   * from satisfying schema requirements, giving the tests full control over
   * which env vars are present.
   */
  const isolatedStartDir = '/tmp';

  describe('success path', () => {
    it('returns Ok with typed config on valid minimal env', () => {
      const result = loadRuntimeConfig({
        processEnv: { ...VALID_ENV },
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }

      expect(result.value.env.ELASTICSEARCH_URL).toBe('http://localhost:9200');
      expect(result.value.env.ELASTICSEARCH_API_KEY).toBe('test-api-key-123');
      expect(result.value.env.OAK_API_KEY).toBe('test-oak-key');
      expect(result.value.env.SEARCH_API_KEY).toBe('test-search-key-123');
      expect(result.value.logLevel).toBe('info');
    });

    it('applies LOG_LEVEL from env', () => {
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

    it('applies defaults for optional fields', () => {
      const result = loadRuntimeConfig({
        processEnv: { ...VALID_ENV },
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }

      expect(result.value.env.SEARCH_INDEX_VERSION).toBe('v0-unversioned');
      expect(result.value.env.ZERO_HIT_WEBHOOK_URL).toBe('none');
      expect(result.value.env.LOG_LEVEL).toBe('info');
      expect(result.value.env.SEARCH_INDEX_TARGET).toBe('primary');
      expect(result.value.env.ZERO_HIT_PERSISTENCE_ENABLED).toBe(false);
    });

    it('uses APP_VERSION_OVERRIDE when present', () => {
      const result = loadRuntimeConfig({
        processEnv: { ...VALID_ENV, APP_VERSION_OVERRIDE: '1.2.3' },
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }

      expect(result.value.version).toBe('1.2.3');
      expect(result.value.versionSource).toBe('APP_VERSION_OVERRIDE');
    });

    it('uses the root package.json version when no override is present', () => {
      const result = loadRuntimeConfig({
        processEnv: { ...VALID_ENV },
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }

      expect(result.value.version).toBe('1.5.0');
      expect(result.value.versionSource).toBe('root_package_json');
    });

    it('captures git SHA metadata from Vercel when present', () => {
      const result = loadRuntimeConfig({
        processEnv: {
          ...VALID_ENV,
          VERCEL_GIT_COMMIT_SHA: '3ad6f452abc123def4567890abc123def4567890',
        },
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }

      expect(result.value.gitSha).toBe('3ad6f452abc123def4567890abc123def4567890');
      expect(result.value.gitShaSource).toBe('VERCEL_GIT_COMMIT_SHA');
    });
  });

  describe('error path', () => {
    it('returns Err with diagnostics when required keys are missing', () => {
      const result = loadRuntimeConfig({
        processEnv: {},
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(false);
      if (result.ok) {
        return;
      }

      expect(result.error.message).toBeTruthy();
      expect(result.error.diagnostics.length).toBeGreaterThan(0);

      const esUrlDiag = result.error.diagnostics.find((d) => d.key === 'ELASTICSEARCH_URL');
      expect(esUrlDiag?.present).toBe(false);
    });

    it('returns Err when OAK_API_KEY is missing (superRefine enforcement)', () => {
      const result = loadRuntimeConfig({
        processEnv: {
          ELASTICSEARCH_URL: 'http://localhost:9200',
          ELASTICSEARCH_API_KEY: 'test-api-key-123',
          SEARCH_API_KEY: 'test-search-key-123',
        },
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(false);
    });

    it('returns Err when APP_VERSION_OVERRIDE is invalid', () => {
      const result = loadRuntimeConfig({
        processEnv: { ...VALID_ENV, APP_VERSION_OVERRIDE: 'not-a-version' },
        startDir: isolatedStartDir,
      });

      expect(result.ok).toBe(false);
      if (result.ok) {
        return;
      }

      expect(result.error.message).toContain('Invalid APP_VERSION_OVERRIDE value');
    });
  });
});
