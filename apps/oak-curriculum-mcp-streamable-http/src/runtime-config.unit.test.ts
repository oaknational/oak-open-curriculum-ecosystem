import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadRuntimeConfig } from './runtime-config.js';

/**
 * Creates a minimal monorepo tree with .env files for testing.
 */
function createTestTree(dotEnv?: string): {
  startDir: string;
  cleanup: () => void;
} {
  const repoRoot = mkdtempSync(join(tmpdir(), 'runtime-config-test-'));
  writeFileSync(join(repoRoot, 'pnpm-workspace.yaml'), 'packages: []');

  if (dotEnv !== undefined) {
    writeFileSync(join(repoRoot, '.env'), dotEnv);
  }

  const nested = join(repoRoot, 'nested');
  mkdirSync(nested);

  return {
    startDir: repoRoot,
    cleanup: () => rmSync(repoRoot, { recursive: true, force: true }),
  };
}

const validEnvLines = [
  'OAK_API_KEY=test-key',
  'ELASTICSEARCH_URL=http://localhost:9200',
  'ELASTICSEARCH_API_KEY=test-api-key',
  'CLERK_PUBLISHABLE_KEY=pk_test_123',
  'CLERK_SECRET_KEY=sk_test_123',
].join('\n');

const validEnvLinesNoClerk = [
  'OAK_API_KEY=test-key',
  'ELASTICSEARCH_URL=http://localhost:9200',
  'ELASTICSEARCH_API_KEY=test-api-key',
  'DANGEROUSLY_DISABLE_AUTH=true',
].join('\n');

describe('loadRuntimeConfig', () => {
  describe('Result return type', () => {
    it('returns Result ok on valid env with auth enabled', () => {
      const tree = createTestTree(validEnvLines);
      try {
        const result = loadRuntimeConfig({
          processEnv: {},
          startDir: tree.startDir,
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.env.OAK_API_KEY).toBe('test-key');
        }
      } finally {
        tree.cleanup();
      }
    });

    it('returns Result ok on valid env with auth disabled', () => {
      const tree = createTestTree(validEnvLinesNoClerk);
      try {
        const result = loadRuntimeConfig({
          processEnv: {},
          startDir: tree.startDir,
        });

        expect(result.ok).toBe(true);
      } finally {
        tree.cleanup();
      }
    });

    it('returns Result err when required keys are missing', () => {
      const tree = createTestTree('OAK_API_KEY=test-key');
      try {
        const result = loadRuntimeConfig({
          processEnv: {},
          startDir: tree.startDir,
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error.message).toBeDefined();
          expect(result.error.diagnostics.length).toBeGreaterThan(0);
        }
      } finally {
        tree.cleanup();
      }
    });
  });

  describe('discriminated union', () => {
    it('sets dangerouslyDisableAuth to true when DANGEROUSLY_DISABLE_AUTH=true', () => {
      const tree = createTestTree(validEnvLinesNoClerk);
      try {
        const result = loadRuntimeConfig({
          processEnv: {},
          startDir: tree.startDir,
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.dangerouslyDisableAuth).toBe(true);
        }
      } finally {
        tree.cleanup();
      }
    });

    it('sets dangerouslyDisableAuth to false when auth enabled', () => {
      const tree = createTestTree(validEnvLines);
      try {
        const result = loadRuntimeConfig({
          processEnv: {},
          startDir: tree.startDir,
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.dangerouslyDisableAuth).toBe(false);
        }
      } finally {
        tree.cleanup();
      }
    });
  });

  describe('vercelHostnames collection', () => {
    it('collects all three Vercel URLs when all are present', () => {
      const tree = createTestTree(validEnvLines);
      try {
        const result = loadRuntimeConfig({
          processEnv: {
            VERCEL_URL: 'myapp-abc123.vercel.app',
            VERCEL_BRANCH_URL: 'myapp-git-feat-branch.vercel.app',
            VERCEL_PROJECT_PRODUCTION_URL: 'myapp.vercel.app',
          },
          startDir: tree.startDir,
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.vercelHostnames).toEqual([
            'myapp-abc123.vercel.app',
            'myapp-git-feat-branch.vercel.app',
            'myapp.vercel.app',
          ]);
        }
      } finally {
        tree.cleanup();
      }
    });

    it('returns empty array when no Vercel URLs present', () => {
      const tree = createTestTree(validEnvLines);
      try {
        const result = loadRuntimeConfig({
          processEnv: {},
          startDir: tree.startDir,
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.vercelHostnames).toEqual([]);
        }
      } finally {
        tree.cleanup();
      }
    });

    it('lowercases all URLs', () => {
      const tree = createTestTree(validEnvLines);
      try {
        const result = loadRuntimeConfig({
          processEnv: {
            VERCEL_URL: 'MyApp-ABC123.VERCEL.APP',
          },
          startDir: tree.startDir,
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.vercelHostnames).toEqual(['myapp-abc123.vercel.app']);
        }
      } finally {
        tree.cleanup();
      }
    });
  });

  describe('displayHostname', () => {
    it('uses VERCEL_PROJECT_PRODUCTION_URL in production environment', () => {
      const tree = createTestTree(validEnvLines);
      try {
        const result = loadRuntimeConfig({
          processEnv: {
            VERCEL_ENV: 'production',
            VERCEL_URL: 'myapp-abc123.vercel.app',
            VERCEL_PROJECT_PRODUCTION_URL: 'curriculum-mcp-alpha.oaknational.dev',
          },
          startDir: tree.startDir,
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.displayHostname).toBe('curriculum-mcp-alpha.oaknational.dev');
        }
      } finally {
        tree.cleanup();
      }
    });

    it('uses VERCEL_URL in preview environment', () => {
      const tree = createTestTree(validEnvLines);
      try {
        const result = loadRuntimeConfig({
          processEnv: {
            VERCEL_ENV: 'preview',
            VERCEL_URL: 'myapp-abc123.vercel.app',
            VERCEL_PROJECT_PRODUCTION_URL: 'curriculum-mcp-alpha.oaknational.dev',
          },
          startDir: tree.startDir,
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.displayHostname).toBe('myapp-abc123.vercel.app');
        }
      } finally {
        tree.cleanup();
      }
    });

    it('returns undefined when not on Vercel', () => {
      const tree = createTestTree(validEnvLines);
      try {
        const result = loadRuntimeConfig({
          processEnv: {},
          startDir: tree.startDir,
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.displayHostname).toBeUndefined();
        }
      } finally {
        tree.cleanup();
      }
    });
  });

  describe('other configuration fields', () => {
    it('preserves useStubTools flag when true', () => {
      const tree = createTestTree(validEnvLines);
      try {
        const result = loadRuntimeConfig({
          processEnv: { OAK_CURRICULUM_MCP_USE_STUB_TOOLS: 'true' },
          startDir: tree.startDir,
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.useStubTools).toBe(true);
        }
      } finally {
        tree.cleanup();
      }
    });
  });
});
