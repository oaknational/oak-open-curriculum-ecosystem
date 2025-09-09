/**
 * Global test setup: load OAK_API_KEY (and friends) from the repo root .env files.
 *
 * Strategy:
 * - Respect already-set environment variables (CI/secrets take precedence)
 * - Prefer .env.e2e if present, then fall back to .env
 * - Resolve the repository root by walking up to find pnpm-workspace.yaml or .git
 */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { config as dotenvConfig } from 'dotenv';

function findRepoRoot(startDir: string): string {
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

// Only load from files if the key isn't already present
if (!process.env.OAK_API_KEY) {
  const repoRoot = findRepoRoot(process.cwd());
  const envE2EPath = join(repoRoot, '.env.e2e');
  const envPath = join(repoRoot, '.env');
  const chosen = existsSync(envE2EPath) ? envE2EPath : envPath;
  dotenvConfig({ path: chosen });
}
