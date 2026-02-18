import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { config as dotenvConfig } from 'dotenv';

/** Find the monorepo root by walking up until a directory containing pnpm-workspace.yaml or .git is found */
export function findRepoRoot(startDir: string): string {
  console.debug('Finding repo root from: ', startDir);
  let current = startDir;
  for (;;) {
    const workspace = join(current, 'pnpm-workspace.yaml');
    const gitDir = join(current, '.git');
    if (existsSync(workspace) || existsSync(gitDir)) {
      console.debug('Found repo root: ', current);
      return current;
    }
    const parent = dirname(current);
    if (parent === '/') {
      throw new Error('Could not find repo root. Iterated to `/`');
    }
    if (parent === current) {
      return current;
    }
    current = parent;
  }
}

export interface LoadRootEnvOptions {
  /** keys to ensure exist before skipping dotenv load */
  requiredKeys?: string[];
  /** override search order for env files; defaults to [".env.local", ".env"] */
  envFileOrder?: string[];
  /** starting directory for root resolution */
  startDir: string;
  /** environment object to check for required keys (caller provides process.env) */
  env?: Record<string, string | undefined>;
}

export interface EnvKeyStatus {
  readonly key: string;
  readonly present: boolean;
}

export interface LoadRootEnvResult {
  readonly repoRoot: string;
  readonly loaded: boolean;
  readonly path?: string;
  readonly keyStatus: readonly EnvKeyStatus[];
  readonly missingKeys: readonly string[];
}

function buildKeyStatus(
  envObj: Record<string, string | undefined>,
  keys: readonly string[],
): { keyStatus: readonly EnvKeyStatus[]; missingKeys: readonly string[] } {
  const keyStatus = keys.map((key) => {
    const value = envObj[key];
    return { key, present: typeof value === 'string' && value.length > 0 };
  });
  const missingKeys = keyStatus.filter((s) => !s.present).map((s) => s.key);
  return { keyStatus, missingKeys };
}

/** Load environment variables from repo-root .env files if required keys are missing */
export function loadRootEnv(options: LoadRootEnvOptions): LoadRootEnvResult {
  const envObj = options.env ?? {};
  const required = options.requiredKeys ?? [];
  const missing = required.filter((k) => !envObj[k]);
  if (missing.length === 0 && required.length > 0) {
    return {
      repoRoot: 'Required keys present, skipping dotenv load',
      loaded: false,
      ...buildKeyStatus(envObj, required),
    };
  }

  const repoRoot = findRepoRoot(options.startDir);

  const files = options.envFileOrder ?? ['.env.local', '.env'];
  for (const file of files) {
    const path = join(repoRoot, file);
    if (existsSync(path)) {
      dotenvConfig({ path });
      return { repoRoot, loaded: true, path, ...buildKeyStatus(envObj, required) };
    }
  }
  return { repoRoot, loaded: false, ...buildKeyStatus(envObj, required) };
}
