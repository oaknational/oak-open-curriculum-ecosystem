import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { z } from 'zod';
import { resolveEnv } from '../src/resolve-env.js';

const TestSchema = z.object({
  FOO: z.string().min(1),
  BAR: z.string().min(1),
});

/**
 * Creates a temp directory tree that mimics a monorepo:
 * tempDir/
 *   pnpm-workspace.yaml   (marker for findRepoRoot)
 *   .env                   (optional)
 *   .env.local             (optional)
 *   nested/                (startDir)
 */
function createTestTree(
  dotEnv?: string,
  dotEnvLocal?: string,
): {
  repoRoot: string;
  startDir: string;
  cleanup: () => void;
} {
  const repoRoot = mkdtempSync(join(tmpdir(), 'resolve-env-test-'));
  writeFileSync(join(repoRoot, 'pnpm-workspace.yaml'), 'packages: []');

  if (dotEnv !== undefined) {
    writeFileSync(join(repoRoot, '.env'), dotEnv);
  }
  if (dotEnvLocal !== undefined) {
    writeFileSync(join(repoRoot, '.env.local'), dotEnvLocal);
  }

  const startDir = join(repoRoot, 'nested');
  mkdtempSync(startDir);

  return {
    repoRoot,
    startDir: repoRoot,
    cleanup: () => rmSync(repoRoot, { recursive: true, force: true }),
  };
}

describe('resolveEnv', () => {
  let cleanup: () => void;

  afterEach(() => {
    cleanup?.();
  });

  describe('source hierarchy', () => {
    it('loads values from .env', () => {
      const tree = createTestTree('FOO=from_dotenv\nBAR=from_dotenv');
      cleanup = tree.cleanup;

      const result = resolveEnv({
        schema: TestSchema,
        processEnv: {},
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('from_dotenv');
        expect(result.value.BAR).toBe('from_dotenv');
      }
    });

    it('.env.local overrides .env', () => {
      const tree = createTestTree('FOO=from_dotenv\nBAR=from_dotenv', 'FOO=from_local');
      cleanup = tree.cleanup;

      const result = resolveEnv({
        schema: TestSchema,
        processEnv: {},
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('from_local');
        expect(result.value.BAR).toBe('from_dotenv');
      }
    });

    it('processEnv overrides both .env and .env.local', () => {
      const tree = createTestTree('FOO=from_dotenv\nBAR=from_dotenv', 'FOO=from_local');
      cleanup = tree.cleanup;

      const result = resolveEnv({
        schema: TestSchema,
        processEnv: { FOO: 'from_process', BAR: 'from_process' },
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('from_process');
        expect(result.value.BAR).toBe('from_process');
      }
    });
  });

  describe('schema validation', () => {
    it('returns Result ok with typed data on valid input', () => {
      const tree = createTestTree('FOO=hello\nBAR=world');
      cleanup = tree.cleanup;

      const result = resolveEnv({
        schema: TestSchema,
        processEnv: {},
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual({ FOO: 'hello', BAR: 'world' });
      }
    });

    it('returns Result err with diagnostics on missing required keys', () => {
      const tree = createTestTree('FOO=hello');
      cleanup = tree.cleanup;

      const result = resolveEnv({
        schema: TestSchema,
        processEnv: {},
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('BAR');
        expect(result.error.zodIssues.length).toBeGreaterThan(0);

        const barDiag = result.error.diagnostics.find((d) => d.key === 'BAR');
        expect(barDiag).toBeDefined();
        expect(barDiag?.present).toBe(false);

        const fooDiag = result.error.diagnostics.find((d) => d.key === 'FOO');
        expect(fooDiag).toBeDefined();
        expect(fooDiag?.present).toBe(true);
      }
    });

    it('returns Result err when no .env files exist and processEnv is incomplete', () => {
      const tree = createTestTree();
      cleanup = tree.cleanup;

      const result = resolveEnv({
        schema: TestSchema,
        processEnv: { FOO: 'only_foo' },
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.diagnostics.find((d) => d.key === 'BAR')?.present).toBe(false);
      }
    });
  });

  describe('non-mutating', () => {
    it('does not modify the processEnv object passed in', () => {
      const tree = createTestTree('FOO=from_dotenv\nBAR=from_dotenv');
      cleanup = tree.cleanup;

      const processEnv: Record<string, string> = {};

      resolveEnv({
        schema: TestSchema,
        processEnv,
        startDir: tree.startDir,
      });

      expect(processEnv).toEqual({});
    });
  });
});
