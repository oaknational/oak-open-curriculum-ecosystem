import { join, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { resolveEnv } from '../src/resolve-env.js';
import type { EnvFileSystem } from '../src/types.js';
import { createInMemoryFileSystem } from './test-helpers/in-memory-file-system.js';

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

const REPO_ROOT = join(sep, 'work', 'repo');
const APP_ROOT = join(REPO_ROOT, 'apps', 'my-app');
/** A start directory with no marker anywhere above it: the serverless shape. */
const NO_MARKER_DIR = join(sep, 'var', 'task', 'handler');
const EMPTY_FILE_SYSTEM = createInMemoryFileSystem({});

interface EnvTree {
  readonly fileSystem: EnvFileSystem;
  readonly startDir: string;
}

/**
 * A monorepo tree: the workspace manifest at the root plus `files`, keyed by
 * path relative to the root, with a nested start directory that exercises
 * the walk-up.
 */
function createRepoTree(files: Readonly<Record<string, string>>): EnvTree {
  const entries = Object.fromEntries(
    Object.entries({ 'pnpm-workspace.yaml': 'packages: []', ...files }).map(
      ([relativePath, text]) => [join(REPO_ROOT, relativePath), text],
    ),
  );
  return { fileSystem: createInMemoryFileSystem(entries), startDir: join(REPO_ROOT, 'nested') };
}

/**
 * A monorepo tree with a nested app (`apps/my-app/package.json` is the app
 * root marker) and a start directory inside the app.
 */
function createThreeTierTree(files: Readonly<Record<string, string>>): EnvTree {
  const tree = createRepoTree({ 'apps/my-app/package.json': '{"name":"my-app"}', ...files });
  return { fileSystem: tree.fileSystem, startDir: join(APP_ROOT, 'src') };
}

describe('resolveEnv', () => {
  describe("envFiles: 'none'", () => {
    it('validates the process environment alone: a key the process does not carry is absent', () => {
      const result = resolveEnv({
        schema: TestSchema,
        processEnv: { FOO: 'from_process' },
        envFiles: 'none',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('Failing keys: BAR');
        expect(result.error.diagnostics).toContainEqual({ key: 'BAR', present: false });
      }
    });

    it('accepts a process environment that carries every required key', () => {
      const result = resolveEnv({
        schema: TestSchema,
        processEnv: { FOO: 'from_process', BAR: 'from_process' },
        envFiles: 'none',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual({ FOO: 'from_process', BAR: 'from_process' });
      }
    });
  });

  describe('source hierarchy', () => {
    it('loads values from .env', () => {
      const tree = createRepoTree({ '.env': 'FOO=from_dotenv\nBAR=from_dotenv' });

      const result = resolveEnv({ schema: TestSchema, processEnv: {}, ...tree });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('from_dotenv');
        expect(result.value.BAR).toBe('from_dotenv');
      }
    });

    it('.env.local overrides .env', () => {
      const tree = createRepoTree({
        '.env': 'FOO=from_dotenv\nBAR=from_dotenv',
        '.env.local': 'FOO=from_local',
      });

      const result = resolveEnv({ schema: TestSchema, processEnv: {}, ...tree });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('from_local');
        expect(result.value.BAR).toBe('from_dotenv');
      }
    });

    it('processEnv overrides both .env and .env.local', () => {
      const tree = createRepoTree({
        '.env': 'FOO=from_dotenv\nBAR=from_dotenv',
        '.env.local': 'FOO=from_local',
      });

      const result = resolveEnv({
        schema: TestSchema,
        processEnv: { FOO: 'from_process', BAR: 'from_process' },
        ...tree,
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
      const tree = createRepoTree({ '.env': 'FOO=hello\nBAR=world' });

      const result = resolveEnv({ schema: TestSchema, processEnv: {}, ...tree });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual({ FOO: 'hello', BAR: 'world' });
      }
    });

    it('returns Result err with diagnostics on missing required keys', () => {
      const tree = createRepoTree({ '.env': 'FOO=hello' });

      const result = resolveEnv({ schema: TestSchema, processEnv: {}, ...tree });

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
      const tree = createRepoTree({});

      const result = resolveEnv({ schema: TestSchema, processEnv: { FOO: 'only_foo' }, ...tree });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.diagnostics.find((d) => d.key === 'BAR')?.present).toBe(false);
      }
    });
  });

  describe('non-mutating', () => {
    it('does not modify the processEnv object passed in', () => {
      const tree = createRepoTree({ '.env': 'FOO=from_dotenv\nBAR=from_dotenv' });
      const processEnv: Record<string, string> = {};

      resolveEnv({ schema: TestSchema, processEnv, ...tree });

      expect(processEnv).toEqual({});
    });
  });

  describe('serverless environment (no repo root)', () => {
    it('validates processEnv directly when no repo root markers exist', () => {
      const result = resolveEnv({
        schema: TestSchema,
        processEnv: { FOO: 'from_vercel', BAR: 'from_vercel' },
        startDir: NO_MARKER_DIR,
        fileSystem: EMPTY_FILE_SYSTEM,
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('from_vercel');
        expect(result.value.BAR).toBe('from_vercel');
      }
    });

    it('returns validation error when processEnv is incomplete and no .env files available', () => {
      const result = resolveEnv({
        schema: TestSchema,
        processEnv: { FOO: 'only_foo' },
        startDir: NO_MARKER_DIR,
        fileSystem: EMPTY_FILE_SYSTEM,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.diagnostics.find((d) => d.key === 'BAR')?.present).toBe(false);
      }
    });
  });

  describe('Vercel-specific error guidance', () => {
    it('includes Vercel guidance when VERCEL=1 and validation fails', () => {
      const result = resolveEnv({
        schema: TestSchema,
        processEnv: { VERCEL: '1', FOO: 'present' },
        startDir: NO_MARKER_DIR,
        fileSystem: EMPTY_FILE_SYSTEM,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('Vercel');
        expect(result.error.message).toContain('BAR');
      }
    });

    it('does not include Vercel guidance when not on Vercel', () => {
      const tree = createRepoTree({ '.env': 'FOO=hello' });

      const result = resolveEnv({ schema: TestSchema, processEnv: {}, ...tree });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).not.toContain('Vercel');
      }
    });

    it('Vercel guidance lists only keys that failed validation, not optional absent keys', () => {
      const result = resolveEnv({
        schema: MixedSchema,
        processEnv: { VERCEL: '1' },
        startDir: NO_MARKER_DIR,
        fileSystem: EMPTY_FILE_SYSTEM,
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
      const result = resolveEnv({
        schema: MixedSchema,
        processEnv: { VERCEL: '1', REQUIRED_A: 'set' },
        startDir: NO_MARKER_DIR,
        fileSystem: EMPTY_FILE_SYSTEM,
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
        '.env': 'FOO=repo\nBAR=repo',
        'apps/my-app/.env': 'FOO=app',
      });

      const result = resolveEnv({ schema: TestSchema, processEnv: {}, ...tree });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('app');
        expect(result.value.BAR).toBe('repo');
      }
    });

    it('app .env.local overrides app .env', () => {
      const tree = createThreeTierTree({
        '.env': 'FOO=repo\nBAR=repo',
        'apps/my-app/.env': 'FOO=app_base',
        'apps/my-app/.env.local': 'FOO=app_local',
      });

      const result = resolveEnv({ schema: TestSchema, processEnv: {}, ...tree });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('app_local');
        expect(result.value.BAR).toBe('repo');
      }
    });

    it('full five-source precedence: repo .env < repo .env.local < app .env < app .env.local < processEnv', () => {
      const tree = createThreeTierTree({
        '.env': 'FOO=repo_base\nBAR=repo_base',
        '.env.local': 'FOO=repo_local',
        'apps/my-app/.env': 'FOO=app_base',
        'apps/my-app/.env.local': 'FOO=app_local',
      });

      const result = resolveEnv({ schema: TestSchema, processEnv: { FOO: 'process' }, ...tree });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('process');
        expect(result.value.BAR).toBe('repo_base');
      }
    });

    it('repo .env.local overrides repo .env but app .env overrides both', () => {
      const tree = createThreeTierTree({
        '.env': 'FOO=repo_base\nBAR=repo_base',
        '.env.local': 'FOO=repo_local\nBAR=repo_local',
        'apps/my-app/.env': 'FOO=app_base',
      });

      const result = resolveEnv({ schema: TestSchema, processEnv: {}, ...tree });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('app_base');
        expect(result.value.BAR).toBe('repo_local');
      }
    });
  });

  describe('app root === repo root deduplication', () => {
    it('does not double-load .env files when package.json is at the repo root', () => {
      const tree = createRepoTree({
        'package.json': '{"name":"root"}',
        '.env': 'FOO=once\nBAR=once',
      });

      const result = resolveEnv({ schema: TestSchema, processEnv: {}, ...tree });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('once');
        expect(result.value.BAR).toBe('once');
      }
    });
  });

  describe('backward compatibility (no app-level .env files)', () => {
    it('works when app has package.json but no .env files', () => {
      const tree = createThreeTierTree({ '.env': 'FOO=repo\nBAR=repo' });

      const result = resolveEnv({ schema: TestSchema, processEnv: {}, ...tree });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.FOO).toBe('repo');
        expect(result.value.BAR).toBe('repo');
      }
    });
  });
});
