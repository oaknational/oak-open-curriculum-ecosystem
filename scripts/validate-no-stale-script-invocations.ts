import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  findStaleScriptInvocations,
  type StaleScriptInvocationFinding,
} from './validate-no-stale-script-invocations-helpers.js';

/**
 * Standalone validator that walks authored repo surfaces (CI workflow YAML,
 * project documentation, app docs, agent research notes, agent directives,
 * memory, and Practice Core narrative) and fails if any file uses a stale
 * `node scripts/<name>.{mjs,ts,js}` invocation in place of the canonical
 * `pnpm exec tsx scripts/<name>.ts` form.
 *
 * The gate exists to prevent regression of the failure class fixed in
 * PR-90 commit `b8540657`: the TS6 migration renamed `.mjs` scripts to
 * `.ts` but left workflow YAML and authored markdown referencing the old
 * paths, breaking CI and producing reviewer comments. SonarCloud and
 * Copilot caught the drift externally; this validator catches it locally
 * before push.
 *
 * Wired into `pnpm test:root-scripts` after the vitest run, following the
 * canonical pattern set by `validate-eslint-boundaries.ts`.
 *
 * @packageDocumentation
 */

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Authored surfaces walked recursively. Tests, generated artefacts,
 * archives, and vendored skills are excluded by the predicate below.
 */
const SCANNED_ROOTS: ReadonlyArray<string> = [
  '.github/workflows',
  'docs',
  '.agent/research',
  '.agent/directives',
  '.agent/memory/active',
  '.agent/memory/operational',
  '.agent/memory/executive',
  '.agent/practice-core',
  'apps',
];

/**
 * File extensions that may contain authored prose or workflow steps.
 */
const SCANNED_EXTENSIONS: ReadonlySet<string> = new Set(['.md', '.yml', '.yaml']);

/**
 * Path-fragment exclusions. Files matching any fragment are skipped.
 *
 * - `/archive/` — historical record, never edited as live guidance.
 * - `/node_modules/` — vendored dependency tree.
 * - `clerk-backend-api/SKILL.md` — vendored third-party skill that
 *   references its upstream `node scripts/extract-tags.js` invocation
 *   (Clerk-internal, not Oak-internal).
 */
const EXCLUDED_PATH_FRAGMENTS: ReadonlyArray<string> = [
  '/archive/',
  '/node_modules/',
  'clerk-backend-api/SKILL.md',
];

/**
 * Files allowlisted in the helper because they legitimately discuss the
 * stale-invocation pattern in prose (e.g. plans describing the drift
 * verbatim alongside the cure).
 */
const ALLOWLISTED_PATHS: ReadonlyArray<string> = [
  '.agent/plans/architecture-and-infrastructure/current/pr-90-landing-closure.plan.md',
];

interface ScannableFile {
  readonly path: string;
  readonly content: string;
}

async function discoverScannableFiles(): Promise<ReadonlyArray<ScannableFile>> {
  const files: ScannableFile[] = [];

  for (const rootRelative of SCANNED_ROOTS) {
    const rootAbsolute = path.join(repoRoot, rootRelative);
    await collectFiles(rootAbsolute, files);
  }

  return files;
}

async function collectFiles(absoluteDir: string, accumulator: ScannableFile[]): Promise<void> {
  let entries: ReadonlyArray<{ name: string; isDirectory: () => boolean; isFile: () => boolean }>;
  try {
    entries = await fs.readdir(absoluteDir, { withFileTypes: true });
  } catch (error) {
    // Surfaces may be optional (e.g. `.agent/research` exists in some
    // checkouts and not others). A missing directory is not a failure.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return;
    }
    throw error;
  }

  for (const entry of entries) {
    const entryAbsolute = path.join(absoluteDir, entry.name);
    const entryRelative = path.relative(repoRoot, entryAbsolute);
    const normalizedRelative = entryRelative.split(path.sep).join('/');

    if (EXCLUDED_PATH_FRAGMENTS.some((fragment) => normalizedRelative.includes(fragment))) {
      continue;
    }

    if (entry.isDirectory()) {
      await collectFiles(entryAbsolute, accumulator);
      continue;
    }

    if (entry.isFile() && SCANNED_EXTENSIONS.has(path.extname(entry.name))) {
      const content = await fs.readFile(entryAbsolute, 'utf8');
      accumulator.push({ path: normalizedRelative, content });
    }
  }
}

function formatFindings(findings: ReadonlyArray<StaleScriptInvocationFinding>): string {
  return findings
    .map((finding) => `  ${finding.path}:${finding.line}  ${finding.match}`)
    .join('\n');
}

async function main(): Promise<void> {
  const files = await discoverScannableFiles();
  const findings = findStaleScriptInvocations(files, { allowlistedPaths: ALLOWLISTED_PATHS });

  if (findings.length === 0) {
    console.log(
      'validate-no-stale-script-invocations: OK (no stale `node scripts/...` references)',
    );
    return;
  }

  console.error(
    `validate-no-stale-script-invocations: ${findings.length} stale invocation(s) found.\n\n` +
      `${formatFindings(findings)}\n\n` +
      `Authored surfaces must use the canonical \`pnpm exec tsx scripts/<script>.ts\` form. ` +
      `Convert each finding above (or, for plans/research material legitimately describing ` +
      `the drift in prose, add the file path to ALLOWLISTED_PATHS in this script).`,
  );
  process.exit(1);
}

await main();
