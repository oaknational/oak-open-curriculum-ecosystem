import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const manifestPath = resolve(
  process.cwd(),
  '.agent/plans/semantic-search/archive/completed/field-integrity-test-manifest.json',
);

if (!existsSync(manifestPath)) {
  throw new Error(`Field-integrity manifest not found: ${manifestPath}`);
}

const manifestContents = readFileSync(manifestPath, 'utf8');
const parsedManifest = JSON.parse(manifestContents);

if (!Array.isArray(parsedManifest.testFiles) || parsedManifest.testFiles.length === 0) {
  throw new Error(
    `Field-integrity manifest must contain a non-empty testFiles array: ${manifestPath}`,
  );
}

for (const testPath of parsedManifest.testFiles) {
  if (typeof testPath !== 'string') {
    throw new Error(`Manifest entry must be a string path, received: ${String(testPath)}`);
  }
  const resolvedTestPath = resolve(process.cwd(), testPath);
  if (!existsSync(resolvedTestPath)) {
    throw new Error(`Manifest references missing test file: ${testPath}`);
  }
}

const runResult = spawnSync(
  'pnpm',
  ['vitest', 'run', '--config', 'vitest.field-integrity.config.ts', ...parsedManifest.testFiles],
  {
    stdio: 'inherit',
    env: process.env,
  },
);

if (runResult.status !== 0) {
  process.exit(runResult.status ?? 1);
}
