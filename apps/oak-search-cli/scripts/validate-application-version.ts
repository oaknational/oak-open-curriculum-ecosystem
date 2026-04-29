/**
 * Pre-build validation that the root `package.json` carries a valid semver.
 *
 * @remarks
 * Runs as a `pnpm build` pre-step inside `oak-search-cli`, executed via
 * `pnpm exec tsx`. Replaces the previous root-level
 * `scripts/validate-root-application-version.mjs` (deleted 2026-04-29)
 * per the workspace-to-root-script ban (owner direction 2026-04-29).
 *
 * Uses the canonical `isValidSemver` from `@oaknational/build-metadata`.
 * Turbo's build graph guarantees that this workspace's dependencies
 * (`@oaknational/build-metadata` among them) are built before this
 * script runs, so the import resolves to the freshly built `dist`.
 *
 * Exits 0 on success and writes a confirmation line to stdout. On
 * failure exits 1 with a message naming the bad value.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { isValidSemver } from '@oaknational/build-metadata';

function readPackageJsonVersion(rawJson: string): string | undefined {
  const parsed: unknown = JSON.parse(rawJson);
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return undefined;
  }
  if (!('version' in parsed)) {
    return undefined;
  }
  const { version } = parsed;
  return typeof version === 'string' ? version : undefined;
}

function trimToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function fail(message: string): never {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../../..');
const rootPackageJsonPath = path.join(repoRoot, 'package.json');

const rawPackageJson = readFileSync(rootPackageJsonPath, 'utf8');
const rawVersion = readPackageJsonVersion(rawPackageJson);

const override = trimToUndefined(process.env.APP_VERSION_OVERRIDE);
const version = override ?? trimToUndefined(rawVersion);

if (!version) {
  fail(
    'Application version resolution failed. ' +
      'Set APP_VERSION_OVERRIDE or restore the root package.json version.',
  );
}

if (!isValidSemver(version)) {
  fail(`Invalid application version "${version}". ` + 'Expected a semantic version such as 1.5.0.');
}

process.stdout.write(`Validated application version: ${version}\n`);
