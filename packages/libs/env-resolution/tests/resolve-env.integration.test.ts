import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { z } from 'zod';
import { resolveEnv } from '../src/resolve-env.js';

const TestSchema = z.object({
  FOO: z.string().min(1),
  BAR: z.string().min(1),
});

const MixedSchema = z.object({
  REQUIRED_A: z.string().min(1),
  REQUIRED_B: z.string().min(1),
  OPTIONAL_X: z.string().optional(),
  OPTIONAL_Y: z.string().optional(),
});

/**
 * Creates a temp directory tree that mimics a monorepo:
 *
 * ```text
 * tempDir/
 *   pnpm-workspace.yaml   (marker for findRepoRoot)
 *   .env                   (optional)
 *   .env.local             (optional)
 *   nested/                (startDir — exercises walk-up)
 * ```
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

  const nestedDir = mkdtempSync(join(repoRoot, 'nested-'));

  return {
    repoRoot,
    startDir: nestedDir,
    cleanup: () => rmSync(repoRoot, { recursive: true, force: true }),
  };
}

interface ThreeTierTree {
  repoRoot: string;
  appRoot: string;
  startDir: string;
  cleanup: () => void;
}

/**
 * Creates a temp directory tree that mimics a monorepo with a nested app:
 *
 * ```text
 * repoRoot/
 *   pnpm-workspace.yaml      (repo root marker)
 *   .env                      (optional — repo-level defaults)
 *   .env.local                (optional — repo-level overrides)
 *   apps/my-app/
 *     package.json            (app root marker)
 *     .env                    (optional — app-level defaults)
 *     .env.local              (optional — app-level overrides)
 *     src/                    (startDir — exercises walk-up)
 * ```
 */
function createThreeTierTree(files: {
  repoDotEnv?: string;
  repoDotEnvLocal?: string;
  appDotEnv?: string;
  appDotEnvLocal?: string;
}): ThreeTierTree {
  const repoRoot = mkdtempSync(join(tmpdir(), 'three-tier-'));
  writeFileSync(join(repoRoot, 'pnpm-workspace.yaml'), 'packages: []');

  if (files.repoDotEnv !== undefined) {
    writeFileSync(join(repoRoot, '.env'), files.repoDotEnv);
  }
  if (files.repoDotEnvLocal !== undefined) {
    writeFileSync(join(repoRoot, '.env.local'), files.repoDotEnvLocal);
  }

  const appRoot = join(repoRoot, 'apps', 'my-app');
  mkdirSync(appRoot, { recursive: true });
  writeFileSync(join(appRoot, 'package.json'), '{"name": "my-app"}');

  if (files.appDotEnv !== undefined) {
    writeFileSync(join(appRoot, '.env'), files.appDotEnv);
  }
  if (files.appDotEnvLocal !== undefined) {
    writeFileSync(join(appRoot, '.env.local'), files.appDotEnvLocal);
  }

  const startDir = join(appRoot, 'src');
  mkdirSync(startDir, { recursive: true });

  return {
    repoRoot,
    appRoot,
    startDir,
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

  describe('serverless environment (no repo root)', () => {
    it('validates processEnv directly when no repo root markers exist', () => {
      const noMarkerDir = mkdtempSync(join(tmpdir(), 'serverless-env-'));
      cleanup = () => rmSync(noMarkerDir, { recursive: true, force: true });

      const result = resolveEnv({
        schema: TestSchema,
        processEnv: { FOO: 'from_vercel', BAR: 'from_vercel' },
        startDir: noMarkerDir,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('from_vercel');
        expect(result.value.BAR).toBe('from_vercel');
      }
    });

    it('returns validation error when processEnv is incomplete and no .env files available', () => {
      const noMarkerDir = mkdtempSync(join(tmpdir(), 'serverless-env-'));
      cleanup = () => rmSync(noMarkerDir, { recursive: true, force: true });

      const result = resolveEnv({
        schema: TestSchema,
        processEnv: { FOO: 'only_foo' },
        startDir: noMarkerDir,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.diagnostics.find((d) => d.key === 'BAR')?.present).toBe(false);
      }
    });
  });

  describe('Vercel-specific error guidance', () => {
    it('includes Vercel guidance when VERCEL=1 and validation fails', () => {
      const noMarkerDir = mkdtempSync(join(tmpdir(), 'vercel-env-'));
      cleanup = () => rmSync(noMarkerDir, { recursive: true, force: true });

      const result = resolveEnv({
        schema: TestSchema,
        processEnv: { VERCEL: '1', FOO: 'present' },
        startDir: noMarkerDir,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('Vercel');
        expect(result.error.message).toContain('BAR');
      }
    });

    it('does not include Vercel guidance when not on Vercel', () => {
      const tree = createTestTree('FOO=hello');
      cleanup = tree.cleanup;

      const result = resolveEnv({
        schema: TestSchema,
        processEnv: {},
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).not.toContain('Vercel');
      }
    });

    it('Vercel guidance lists only keys that failed validation, not optional absent keys', () => {
      const noMarkerDir = mkdtempSync(join(tmpdir(), 'vercel-mixed-'));
      cleanup = () => rmSync(noMarkerDir, { recursive: true, force: true });

      const result = resolveEnv({
        schema: MixedSchema,
        processEnv: { VERCEL: '1' },
        startDir: noMarkerDir,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('REQUIRED_A');
        expect(result.error.message).toContain('REQUIRED_B');

        const vercelLine = result.error.message.split('\n').find((line) => line.includes('Vercel'));

        expect(vercelLine).toBeDefined();
        if (vercelLine) {
          expect(vercelLine).toContain('REQUIRED_A');
          expect(vercelLine).toContain('REQUIRED_B');
          expect(vercelLine).not.toContain('OPTIONAL_X');
          expect(vercelLine).not.toContain('OPTIONAL_Y');
        }
      }
    });

    it('Vercel guidance omits optional keys even when mixed with failing required keys', () => {
      const noMarkerDir = mkdtempSync(join(tmpdir(), 'vercel-partial-'));
      cleanup = () => rmSync(noMarkerDir, { recursive: true, force: true });

      const result = resolveEnv({
        schema: MixedSchema,
        processEnv: { VERCEL: '1', REQUIRED_A: 'set' },
        startDir: noMarkerDir,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        const vercelLine = result.error.message.split('\n').find((line) => line.includes('Vercel'));

        expect(vercelLine).toBeDefined();
        if (vercelLine) {
          expect(vercelLine).toContain('REQUIRED_B');
          expect(vercelLine).not.toContain('REQUIRED_A');
          expect(vercelLine).not.toContain('OPTIONAL_X');
          expect(vercelLine).not.toContain('OPTIONAL_Y');
        }
      }
    });
  });

  describe('three-tier hierarchy (repo → app → processEnv)', () => {
    it('app .env overrides repo .env for the same key', () => {
      const tree = createThreeTierTree({
        repoDotEnv: 'FOO=repo\nBAR=repo',
        appDotEnv: 'FOO=app',
      });
      cleanup = tree.cleanup;

      const result = resolveEnv({
        schema: TestSchema,
        processEnv: {},
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('app');
        expect(result.value.BAR).toBe('repo');
      }
    });

    it('app .env.local overrides app .env', () => {
      const tree = createThreeTierTree({
        repoDotEnv: 'FOO=repo\nBAR=repo',
        appDotEnv: 'FOO=app_base',
        appDotEnvLocal: 'FOO=app_local',
      });
      cleanup = tree.cleanup;

      const result = resolveEnv({
        schema: TestSchema,
        processEnv: {},
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('app_local');
        expect(result.value.BAR).toBe('repo');
      }
    });

    it('full five-source precedence: repo .env < repo .env.local < app .env < app .env.local < processEnv', () => {
      const tree = createThreeTierTree({
        repoDotEnv: 'FOO=repo_base\nBAR=repo_base',
        repoDotEnvLocal: 'FOO=repo_local',
        appDotEnv: 'FOO=app_base',
        appDotEnvLocal: 'FOO=app_local',
      });
      cleanup = tree.cleanup;

      const result = resolveEnv({
        schema: TestSchema,
        processEnv: { FOO: 'process' },
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('process');
        expect(result.value.BAR).toBe('repo_base');
      }
    });

    it('repo .env.local overrides repo .env but app .env overrides both', () => {
      const tree = createThreeTierTree({
        repoDotEnv: 'FOO=repo_base\nBAR=repo_base',
        repoDotEnvLocal: 'FOO=repo_local\nBAR=repo_local',
        appDotEnv: 'FOO=app_base',
      });
      cleanup = tree.cleanup;

      const result = resolveEnv({
        schema: TestSchema,
        processEnv: {},
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('app_base');
        expect(result.value.BAR).toBe('repo_local');
      }
    });
  });

  describe('app root === repo root deduplication', () => {
    it('does not double-load .env files when package.json is at the repo root', () => {
      const repoRoot = mkdtempSync(join(tmpdir(), 'single-root-'));
      writeFileSync(join(repoRoot, 'pnpm-workspace.yaml'), 'packages: []');
      writeFileSync(join(repoRoot, 'package.json'), '{"name":"root"}');
      writeFileSync(join(repoRoot, '.env'), 'FOO=once\nBAR=once');
      const startDir = join(repoRoot, 'src');
      mkdirSync(startDir, { recursive: true });
      cleanup = () => rmSync(repoRoot, { recursive: true, force: true });

      const result = resolveEnv({
        schema: TestSchema,
        processEnv: {},
        startDir,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('once');
        expect(result.value.BAR).toBe('once');
      }
    });
  });

  describe('backward compatibility (no app-level .env files)', () => {
    it('works when app has package.json but no .env files', () => {
      const tree = createThreeTierTree({
        repoDotEnv: 'FOO=repo\nBAR=repo',
      });
      cleanup = tree.cleanup;

      const result = resolveEnv({
        schema: TestSchema,
        processEnv: {},
        startDir: tree.startDir,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('repo');
        expect(result.value.BAR).toBe('repo');
      }
    });
  });
});
