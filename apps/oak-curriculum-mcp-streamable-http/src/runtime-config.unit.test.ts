import { describe, it, expect } from 'vitest';
import { loadRuntimeConfig } from './runtime-config.js';

/**
 * Unit tests for runtime configuration loading.
 *
 * Tests prove that Vercel deployment URLs are correctly collected and
 * other configuration fields are properly derived from environment variables.
 */

describe('loadRuntimeConfig', () => {
  const baseEnv = {
    OAK_API_KEY: 'test-key',
    CLERK_PUBLISHABLE_KEY: 'pk_test',
    CLERK_SECRET_KEY: 'sk_test',
    ELASTICSEARCH_URL: 'http://fake-es:9200',
    ELASTICSEARCH_API_KEY: 'fake-api-key',
  };

  describe('vercelHostnames collection', () => {
    it('collects all three Vercel URLs when all are present', () => {
      const env = {
        ...baseEnv,
        VERCEL_URL: 'myapp-abc123.vercel.app',
        VERCEL_BRANCH_URL: 'myapp-git-feat-branch.vercel.app',
        VERCEL_PROJECT_PRODUCTION_URL: 'myapp.vercel.app',
      };

      const config = loadRuntimeConfig(env);

      expect(config.vercelHostnames).toEqual([
        'myapp-abc123.vercel.app',
        'myapp-git-feat-branch.vercel.app',
        'myapp.vercel.app',
      ]);
    });

    it('collects only VERCEL_URL when only it is present', () => {
      const config = loadRuntimeConfig({
        ...baseEnv,
        VERCEL_URL: 'myapp-abc123.vercel.app',
      });

      expect(config.vercelHostnames).toEqual(['myapp-abc123.vercel.app']);
    });

    it('collects only VERCEL_BRANCH_URL when only it is present', () => {
      const config = loadRuntimeConfig({
        ...baseEnv,
        VERCEL_BRANCH_URL: 'myapp-git-feat.vercel.app',
      });

      expect(config.vercelHostnames).toEqual(['myapp-git-feat.vercel.app']);
    });

    it('collects only VERCEL_PROJECT_PRODUCTION_URL when only it is present', () => {
      const config = loadRuntimeConfig({
        ...baseEnv,
        VERCEL_PROJECT_PRODUCTION_URL: 'myapp.vercel.app',
      });

      expect(config.vercelHostnames).toEqual(['myapp.vercel.app']);
    });

    it('filters out undefined URLs', () => {
      const config = loadRuntimeConfig({
        ...baseEnv,
        VERCEL_URL: 'myapp-abc123.vercel.app',
        VERCEL_BRANCH_URL: undefined,
        VERCEL_PROJECT_PRODUCTION_URL: 'myapp.vercel.app',
      });

      expect(config.vercelHostnames).toEqual(['myapp-abc123.vercel.app', 'myapp.vercel.app']);
    });

    it('filters out empty string URLs', () => {
      const config = loadRuntimeConfig({
        ...baseEnv,
        VERCEL_URL: 'myapp-abc123.vercel.app',
        VERCEL_BRANCH_URL: '',
        VERCEL_PROJECT_PRODUCTION_URL: 'myapp.vercel.app',
      });

      expect(config.vercelHostnames).toEqual(['myapp-abc123.vercel.app', 'myapp.vercel.app']);
    });

    it('lowercases all URLs', () => {
      const config = loadRuntimeConfig({
        ...baseEnv,
        VERCEL_URL: 'MyApp-ABC123.VERCEL.APP',
        VERCEL_BRANCH_URL: 'MYAPP-GIT-FEAT.VERCEL.APP',
        VERCEL_PROJECT_PRODUCTION_URL: 'MYAPP.VERCEL.APP',
      });

      expect(config.vercelHostnames).toEqual([
        'myapp-abc123.vercel.app',
        'myapp-git-feat.vercel.app',
        'myapp.vercel.app',
      ]);
    });

    it('returns empty array when no Vercel URLs present', () => {
      const config = loadRuntimeConfig(baseEnv);

      expect(config.vercelHostnames).toEqual([]);
    });
  });

  describe('other configuration fields', () => {
    it('preserves dangerouslyDisableAuth flag when true', () => {
      const config = loadRuntimeConfig({ ...baseEnv, DANGEROUSLY_DISABLE_AUTH: 'true' });

      expect(config.dangerouslyDisableAuth).toBe(true);
    });

    it('preserves dangerouslyDisableAuth flag when false', () => {
      const config = loadRuntimeConfig({ ...baseEnv, DANGEROUSLY_DISABLE_AUTH: 'false' });

      expect(config.dangerouslyDisableAuth).toBe(false);
    });

    it('preserves useStubTools flag when true', () => {
      const config = loadRuntimeConfig({
        ...baseEnv,
        OAK_CURRICULUM_MCP_USE_STUB_TOOLS: 'true',
      });

      expect(config.useStubTools).toBe(true);
    });

    it('includes env object from readEnv', () => {
      const config = loadRuntimeConfig(baseEnv);

      expect(config.env).toBeDefined();
      expect(config.env.OAK_API_KEY).toBe('test-key');
    });
  });

  describe('displayHostname', () => {
    it('uses VERCEL_PROJECT_PRODUCTION_URL in production environment', () => {
      const config = loadRuntimeConfig({
        ...baseEnv,
        VERCEL_ENV: 'production',
        VERCEL_URL: 'myapp-abc123.vercel.app',
        VERCEL_PROJECT_PRODUCTION_URL: 'curriculum-mcp-alpha.oaknational.dev',
      });

      expect(config.displayHostname).toBe('curriculum-mcp-alpha.oaknational.dev');
    });

    it('uses VERCEL_URL in preview environment even when production URL exists', () => {
      const config = loadRuntimeConfig({
        ...baseEnv,
        VERCEL_ENV: 'preview',
        VERCEL_URL: 'myapp-abc123.vercel.app',
        VERCEL_PROJECT_PRODUCTION_URL: 'curriculum-mcp-alpha.oaknational.dev',
      });

      expect(config.displayHostname).toBe('myapp-abc123.vercel.app');
    });

    it('uses VERCEL_URL in development environment', () => {
      const config = loadRuntimeConfig({
        ...baseEnv,
        VERCEL_ENV: 'development',
        VERCEL_URL: 'myapp-abc123.vercel.app',
        VERCEL_PROJECT_PRODUCTION_URL: 'curriculum-mcp-alpha.oaknational.dev',
      });

      expect(config.displayHostname).toBe('myapp-abc123.vercel.app');
    });

    it('falls back to VERCEL_URL if production URL is missing in production', () => {
      const config = loadRuntimeConfig({
        ...baseEnv,
        VERCEL_ENV: 'production',
        VERCEL_URL: 'myapp-abc123.vercel.app',
      });

      expect(config.displayHostname).toBe('myapp-abc123.vercel.app');
    });

    it('returns undefined when not on Vercel', () => {
      const config = loadRuntimeConfig(baseEnv);

      expect(config.displayHostname).toBeUndefined();
    });

    it('lowercases the display hostname', () => {
      const config = loadRuntimeConfig({
        ...baseEnv,
        VERCEL_ENV: 'production',
        VERCEL_PROJECT_PRODUCTION_URL: 'Curriculum-MCP-Alpha.OakNational.DEV',
      });

      expect(config.displayHostname).toBe('curriculum-mcp-alpha.oaknational.dev');
    });
  });
});
