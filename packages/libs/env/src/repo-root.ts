import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { config as dotenvConfig } from 'dotenv';

/** Find the monorepo root by walking up until a directory containing pnpm-workspace.yaml or .git is found */
export function findRepoRoot(startDir: string): string {
  let current = startDir;
  for (;;) {
    const workspace = join(current, 'pnpm-workspace.yaml');
    const gitDir = join(current, '.git');
    if (existsSync(workspace) || existsSync(gitDir)) return current;
    const parent = dirname(current);
    if (parent === current) return current;
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

/** Load environment variables from repo-root .env files if required keys are missing */
export function loadRootEnv(options: LoadRootEnvOptions): {
  repoRoot: string;
  loaded: boolean;
  path?: string;
} {
  const repoRoot = findRepoRoot(options.startDir);

  const envObj = options.env ?? {};
  const required = options.requiredKeys ?? [];
  const missing = required.filter((k) => !envObj[k]);
  if (missing.length === 0 && required.length > 0) {
    return { repoRoot, loaded: false };
  }

  const files = options.envFileOrder ?? ['.env.local', '.env'];
  for (const file of files) {
    const path = join(repoRoot, file);
    if (existsSync(path)) {
      dotenvConfig({ path });
      return { repoRoot, loaded: true, path };
    }
  }
  return { repoRoot, loaded: false };
}
