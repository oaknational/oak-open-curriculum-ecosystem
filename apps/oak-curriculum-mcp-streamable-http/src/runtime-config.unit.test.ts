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
  writeFileSync(join(repoRoot, 'package.json'), '{"name":"root","version":"9.9.9"}');

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

const validFixtureEnvLinesNoClerk = [validEnvLinesNoClerk, 'SENTRY_MODE=fixture'].join('\n');

const validLiveEnvLinesNoClerk = [
  validEnvLinesNoClerk,
  'SENTRY_MODE=sentry',
  'SENTRY_DSN=https://public@example.ingest.sentry.io/123456',
  'SENTRY_RELEASE_OVERRIDE=test-release',
  'SENTRY_TRACES_SAMPLE_RATE=1',
].join('\n');

describe('loadRuntimeConfig — result return type', () => {
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
        expect(result.value.version).toBe('1.5.0');
        expect(result.value.versionSource).toBe('root_package_json');
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

  it('accepts fixture observability env when auth is disabled', () => {
    const tree = createTestTree(validFixtureEnvLinesNoClerk);
    try {
      const result = loadRuntimeConfig({
        processEnv: {},
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.env.SENTRY_MODE).toBe('fixture');
      }
    } finally {
      tree.cleanup();
    }
  });

  it('accepts live observability env when auth is disabled', () => {
    const tree = createTestTree(validLiveEnvLinesNoClerk);
    try {
      const result = loadRuntimeConfig({
        processEnv: {},
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.env.SENTRY_MODE).toBe('sentry');
        expect(result.value.env.SENTRY_DSN).toBe('https://public@example.ingest.sentry.io/123456');
      }
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

describe('loadRuntimeConfig — discriminated union', () => {
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

describe('loadRuntimeConfig — vercelHostnames collection', () => {
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

describe('loadRuntimeConfig — version and git metadata', () => {
  it('uses APP_VERSION_OVERRIDE when present', () => {
    const tree = createTestTree(validEnvLines);
    try {
      const result = loadRuntimeConfig({
        processEnv: {
          APP_VERSION_OVERRIDE: '2.3.4',
        },
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.version).toBe('2.3.4');
        expect(result.value.versionSource).toBe('APP_VERSION_OVERRIDE');
      }
    } finally {
      tree.cleanup();
    }
  });

  it('captures git SHA metadata from Vercel', () => {
    const tree = createTestTree(validEnvLines);
    try {
      const result = loadRuntimeConfig({
        processEnv: {
          VERCEL_GIT_COMMIT_SHA: '3ad6f452abc123def4567890abc123def4567890',
        },
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.gitSha).toBe('3ad6f452abc123def4567890abc123def4567890');
        expect(result.value.gitShaSource).toBe('VERCEL_GIT_COMMIT_SHA');
      }
    } finally {
      tree.cleanup();
    }
  });

  it('fails fast for invalid APP_VERSION_OVERRIDE values', () => {
    const tree = createTestTree(validEnvLines);
    try {
      const result = loadRuntimeConfig({
        processEnv: {
          APP_VERSION_OVERRIDE: 'not-a-version',
        },
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('Invalid APP_VERSION_OVERRIDE value');
      }
    } finally {
      tree.cleanup();
    }
  });

  it('fails fast for invalid VERCEL_GIT_COMMIT_SHA values', () => {
    const tree = createTestTree(validEnvLines);
    try {
      const result = loadRuntimeConfig({
        processEnv: {
          VERCEL_GIT_COMMIT_SHA: 'not-a-sha',
        },
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('Invalid VERCEL_GIT_COMMIT_SHA value');
      }
    } finally {
      tree.cleanup();
    }
  });
});

describe('loadRuntimeConfig — display and misc', () => {
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
